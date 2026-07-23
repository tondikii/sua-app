import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvitationSerializer } from './serializers/invitation.serializer';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  /**
   * Invite a user to a trip via username or email (exactly one).
   * Only existing participants may invite. Duplicate/pending/already-member
   * invites are rejected. (WORKFLOW §6, §11)
   */
  async createInvitation(tripId: string, inviterId: string, dto: any) {
    if ((!!dto.username && !!dto.email) || (!dto.username && !dto.email)) {
      throw new BadRequestException({
        code: 'INVALID_INVITATION_TARGET',
        message: 'Provide exactly one of: username or email',
      });
    }

    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId },
      include: { participants: { select: { userId: true } } },
    });

    if (!trip) {
      throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: 'Trip not found' });
    }

    const isParticipant = trip.participants.some((p) => p.userId === inviterId);
    if (!isParticipant) {
      throw new ForbiddenException({
        code: 'NOT_TRIP_PARTICIPANT',
        message: 'Only trip participants can invite others',
      });
    }

    const inv = dto.username
      ? await this.inviteByUsername(tripId, inviterId, dto.username, trip.participants)
      : await this.inviteByEmail(tripId, inviterId, dto.email!, trip.participants);

    return InvitationSerializer.toBasic(inv);
  }

  private async inviteByUsername(
    tripId: string,
    inviterId: string,
    username: string,
    participants: Array<{ userId: string }>,
  ) {
    const invitedUser = await this.prisma.user.findFirst({
      where: { username: username.toLowerCase() },
      select: { id: true },
    });

    if (!invitedUser) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: `User @${username} not found`,
      });
    }

    if (invitedUser.id === inviterId) {
      throw new BadRequestException({
        code: 'CANNOT_INVITE_SELF',
        message: 'You cannot invite yourself',
      });
    }

    if (participants.some((p) => p.userId === invitedUser.id)) {
      throw new ConflictException({
        code: 'ALREADY_PARTICIPANT',
        message: 'User is already a participant',
      });
    }

    // Reuse an existing row for this target: block if still pending, otherwise
    // reactivate a declined/cancelled/accepted one ("Undang kembali").
    const existing = await this.prisma.tripInvitation.findFirst({
      where: { tripId, invitedUserId: invitedUser.id },
      orderBy: { createdAt: 'desc' },
    });

    if (existing?.status === 'pending') {
      throw new ConflictException({
        code: 'INVITATION_EXISTS',
        message: 'User already has a pending invitation',
      });
    }

    if (existing) {
      const invitation = await this.prisma.tripInvitation.update({
        where: { id: existing.id },
        data: { status: 'pending', method: 'username', invitedBy: inviterId },
      });

      // Create notification for reactivated invitation
      await this.notifications.createNotification({
        userId: invitedUser.id,
        type: 'invite',
        actorId: inviterId,
        tripId,
        payload: { invitation_id: invitation.id },
      });

      return invitation;
    }

    const invitation = await this.prisma.tripInvitation.create({
      data: {
        tripId,
        invitedBy: inviterId,
        invitedUserId: invitedUser.id,
        method: 'username',
        status: 'pending',
      },
    });

    // Create notification for new invitation
    await this.notifications.createNotification({
      userId: invitedUser.id,
      type: 'invite',
      actorId: inviterId,
      tripId,
      payload: { invitation_id: invitation.id },
    });

    return invitation;
  }

  private async inviteByEmail(
    tripId: string,
    inviterId: string,
    email: string,
    participants: Array<{ userId: string }>,
  ) {
    const normalizedEmail = email.toLowerCase();

    // If the email belongs to an existing user, link it so they can respond in-app.
    const existingUser = await this.prisma.user.findFirst({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      if (existingUser.id === inviterId) {
        throw new BadRequestException({
          code: 'CANNOT_INVITE_SELF',
          message: 'You cannot invite yourself',
        });
      }
      if (participants.some((p) => p.userId === existingUser.id)) {
        throw new ConflictException({
          code: 'ALREADY_PARTICIPANT',
          message: 'User is already a participant',
        });
      }
    }

    const existing = await this.prisma.tripInvitation.findFirst({
      where: { tripId, invitedEmail: normalizedEmail },
      orderBy: { createdAt: 'desc' },
    });

    if (existing?.status === 'pending') {
      throw new ConflictException({
        code: 'INVITATION_EXISTS',
        message: 'This email already has a pending invitation',
      });
    }

    if (existing) {
      const invitation = await this.prisma.tripInvitation.update({
        where: { id: existing.id },
        data: {
          status: 'pending',
          method: 'email',
          invitedBy: inviterId,
          invitedUserId: existingUser?.id ?? null,
        },
      });

      // Create notification for reactivated invitation (only for registered users)
      if (existingUser) {
        await this.notifications.createNotification({
          userId: existingUser.id,
          type: 'invite',
          actorId: inviterId,
          tripId,
          payload: { invitation_id: invitation.id },
        });
      }

      return invitation;
    }

    const invitation = await this.prisma.tripInvitation.create({
      data: {
        tripId,
        invitedBy: inviterId,
        invitedUserId: existingUser?.id ?? null,
        invitedEmail: normalizedEmail,
        method: 'email',
        status: 'pending',
      },
    });

    // Create notification for new invitation (only for registered users)
    if (existingUser) {
      await this.notifications.createNotification({
        userId: existingUser.id,
        type: 'invite',
        actorId: inviterId,
        tripId,
        payload: { invitation_id: invitation.id },
      });
    }

    return invitation;
  }

  /**
   * Pending invitations addressed to the current user, enriched with trip +
   * inviter summaries (WORKFLOW §3 — tab Undangan). Cursor paginated.
   */
  async getUserInvitations(userId: string, cursor?: string, limit = 20) {
    const take = Math.min(limit, 100);

    const invitations = await this.prisma.tripInvitation.findMany({
      where: {
        invitedUserId: userId,
        status: 'pending',
        trip: { deletedAt: null },
      },
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: {
        trip: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            status: true,
            isAllDay: true,
            startTime: true,
            endTime: true,
          },
        },
        inviter: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
      },
    });

    const hasMore = invitations.length > take;
    const results = hasMore ? invitations.slice(0, take) : invitations;

    return {
      data: results.map((inv) => InvitationSerializer.toEnriched(inv)),
      next_cursor: hasMore ? (results[results.length - 1]?.id ?? null) : null,
    };
  }

  /**
   * Accept or decline a pending invitation (invitee only).
   * Accept = update status + insert trip_participants, atomically (ARCHITECTURE §3.4).
   */
  async respondToInvitation(
    tripId: string,
    invitationId: string,
    userId: string,
    accept: boolean,
  ): Promise<void> {
    const invitation = await this.prisma.tripInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.tripId !== tripId) {
      throw new NotFoundException({
        code: 'INVITATION_NOT_FOUND',
        message: 'Invitation not found',
      });
    }

    if (invitation.invitedUserId !== userId) {
      throw new ForbiddenException({
        code: 'INVITATION_ACCESS_DENIED',
        message: 'This invitation is not addressed to you',
      });
    }

    if (invitation.status !== 'pending') {
      throw new BadRequestException({
        code: 'INVITATION_NOT_PENDING',
        message: `Invitation is already ${invitation.status}`,
      });
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.tripInvitation.update({
        where: { id: invitationId },
        data: { status: accept ? 'accepted' : 'declined' },
      });

      if (accept) {
        await tx.tripParticipant.upsert({
          where: { tripId_userId: { tripId: invitation.tripId, userId } },
          create: { tripId: invitation.tripId, userId },
          update: {},
        });
      }
    });
  }

  /** Cancel a pending invitation — inviter only. */
  async cancelInvitation(tripId: string, invitationId: string, userId: string): Promise<void> {
    const invitation = await this.prisma.tripInvitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.tripId !== tripId) {
      throw new NotFoundException({
        code: 'INVITATION_NOT_FOUND',
        message: 'Invitation not found',
      });
    }

    if (invitation.invitedBy !== userId) {
      throw new ForbiddenException({
        code: 'NOT_INVITER',
        message: 'Only the inviter can cancel this invitation',
      });
    }

    if (invitation.status !== 'pending') {
      throw new BadRequestException({
        code: 'INVITATION_NOT_PENDING',
        message: `Cannot cancel an invitation that is ${invitation.status}`,
      });
    }

    await this.prisma.tripInvitation.update({
      where: { id: invitationId },
      data: { status: 'cancelled' },
    });
  }
}

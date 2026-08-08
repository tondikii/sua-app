import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripStatus } from '@prisma/client';
import { TripSerializer } from './serializers/trip.serializer';
import { InvitationSerializer } from './serializers/invitation.serializer';
import { R2Service } from '../integrations/r2/r2.service';
import type { CreateTripInput, UpdateTripInput } from '@atur-perjalanan/shared-validation';

const USER_SUMMARY_SELECT = {
  id: true,
  name: true,
  username: true,
  avatarUrl: true,
} as const;

@Injectable()
export class TripsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

  /**
   * Create a trip in fixed (`status=fixed`) or voting (`status=voting_pending`) mode.
   * Voting mode auto-creates a `tanggal` poll with one option per candidate and
   * sets `voting_deadline` — all inside a single Prisma transaction (ARCHITECTURE §3.4).
   * The creator is always inserted as the first participant.
   */
  async createTrip(userId: string, dto: CreateTripInput) {
    const {
      name,
      tags = [],
      start_date,
      end_date,
      is_all_day = true,
      start_time,
      end_time,
      candidates,
      voting_deadline,
    } = dto;

    const hasCandidates = Array.isArray(candidates) && candidates.length > 0;
    const hasFixedDates = Boolean(start_date || end_date);

    if (!hasFixedDates && !hasCandidates) {
      throw new BadRequestException({
        code: 'INVALID_TRIP_DATES',
        message: 'Provide either start_date/end_date (fixed) or 1–3 candidates (voting)',
      });
    }

    if (hasCandidates) {
      return this.createVotingTrip(userId, {
        name,
        tags,
        candidates: candidates!,
        voting_deadline,
      });
    }

    return this.createFixedTrip(userId, {
      name,
      tags,
      start_date,
      end_date,
      is_all_day,
      start_time,
      end_time,
    });
  }

  private async createFixedTrip(
    userId: string,
    data: {
      name: string;
      tags: string[];
      start_date?: string;
      end_date?: string;
      is_all_day: boolean;
      start_time?: string;
      end_time?: string;
    },
  ) {
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if (startDate && endDate && startDate > endDate) {
      throw new BadRequestException({
        code: 'INVALID_DATE_RANGE',
        message: 'start_date must be on or before end_date',
      });
    }

    const trip = await this.prisma.$transaction(async (tx) => {
      const created = await tx.trip.create({
        data: {
          creatorId: userId,
          name: data.name,
          tags: data.tags,
          status: TripStatus.fixed,
          startDate,
          endDate,
          isAllDay: data.is_all_day,
          startTime:
            !data.is_all_day && data.start_time
              ? new Date(`2000-01-01T${data.start_time}:00Z`)
              : null,
          endTime:
            !data.is_all_day && data.end_time
              ? new Date(`2000-01-01T${data.end_time}:00Z`)
              : null,
        },
      });

      await tx.tripParticipant.create({
        data: { tripId: created.id, userId },
      });

      return created;
    });

    return this.getTripDetail(trip.id, userId);
  }

  private async createVotingTrip(
    userId: string,
    data: {
      name: string;
      tags: string[];
      candidates: Array<{ start_date: string; end_date: string }>;
      voting_deadline?: string;
    },
  ) {
    if (data.candidates.length > 3) {
      throw new BadRequestException({
        code: 'TOO_MANY_CANDIDATES',
        message: 'Maximum 3 date candidates allowed',
      });
    }

    for (const candidate of data.candidates) {
      const start = new Date(candidate.start_date);
      const end = new Date(candidate.end_date);
      if (start > end) {
        throw new BadRequestException({
          code: 'INVALID_CANDIDATE_RANGE',
          message: `Invalid candidate range: ${candidate.start_date} – ${candidate.end_date}`,
        });
      }
    }

    const trip = await this.prisma.$transaction(async (tx) => {
      const created = await tx.trip.create({
        data: {
          creatorId: userId,
          name: data.name,
          tags: data.tags,
          status: TripStatus.voting_pending,
          isAllDay: true,
        },
      });

      await tx.tripParticipant.create({
        data: { tripId: created.id, userId },
      });

      const createdCandidates = await Promise.all(
        data.candidates.map((candidate) =>
          tx.tripDateCandidate.create({
            data: {
              tripId: created.id,
              startDate: new Date(candidate.start_date),
              endDate: new Date(candidate.end_date),
            },
          }),
        ),
      );

      const poll = await tx.tripPoll.create({
        data: {
          tripId: created.id,
          pollType: 'tanggal',
          title: 'Tanggal Perjalanan',
          status: 'active',
          createdBy: userId,
        },
      });

      await Promise.all(
        createdCandidates.map((candidate, idx) =>
          tx.tripPollOption.create({
            data: {
              pollId: poll.id,
              label: `${candidate.startDate.toISOString().split('T')[0]} – ${candidate.endDate.toISOString().split('T')[0]}`,
              sortOrder: idx,
              candidateId: candidate.id,
            },
          }),
        ),
      );

      const votingDeadline = data.voting_deadline
        ? new Date(data.voting_deadline)
        : this.calculateVotingDeadline(createdCandidates.map((c) => c.startDate));

      return tx.trip.update({
        where: { id: created.id },
        data: { votingDeadline },
      });
    });

    return this.getTripDetail(trip.id, userId);
  }

  /**
   * voting_deadline = LEAST(now + 14d, MIN(candidate.start_date) - 3d), clamped to >= now + 7d.
   * (ARCHITECTURE §4.3.2)
   */
  private calculateVotingDeadline(candidateStartDates: Date[]): Date {
    const now = Date.now();
    const earliest = Math.min(...candidateStartDates.map((d) => d.getTime()));
    const plus14d = now + 14 * 24 * 60 * 60 * 1000;
    const threeDaysBefore = earliest - 3 * 24 * 60 * 60 * 1000;
    const minDeadline = now + 7 * 24 * 60 * 60 * 1000;

    const deadline = Math.max(Math.min(plus14d, threeDaysBefore), minDeadline);
    return new Date(deadline);
  }

  /**
   * List the current user's trips (tab=upcoming|completed), cursor paginated.
   * Returns `{ data, next_cursor }` enriched cards (WORKFLOW §3).
   */
  async listTrips(userId: string, tab: 'upcoming' | 'completed', cursor?: string, limit = 20) {
    const take = Math.min(limit, 100);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tabWhere =
      tab === 'completed'
        ? { status: TripStatus.fixed, endDate: { lt: today } }
        : {
            OR: [
              { status: TripStatus.voting_pending },
              { endDate: { gte: today } },
              { endDate: null },
            ],
          };

    const trips = await this.prisma.trip.findMany({
      where: {
        participants: { some: { userId } },
        ...tabWhere,
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      include: {
        coverDocument: { select: { storageKey: true } },
        _count: { select: { participants: true } },
        participants: {
          take: 5,
          orderBy: { joinedAt: 'asc' },
          include: { user: { select: USER_SUMMARY_SELECT } },
        },
      },
    });

    const hasMore = trips.length > take;
    const results = hasMore ? trips.slice(0, take) : trips;

    const coverKeys = results
      .map((trip) => trip.coverDocument?.storageKey)
      .filter((key): key is string => Boolean(key));
    const signedCoverUrls = await this.r2.presignDownloads(coverKeys);

    return {
      data: await Promise.all(
        results.map((trip) =>
          TripSerializer.toCard(
            trip,
            trip.coverDocument?.storageKey
              ? (signedCoverUrls.get(trip.coverDocument.storageKey) ?? null)
              : null,
            this.r2,
          ),
        ),
      ),
      next_cursor: hasMore ? (results[results.length - 1]?.id ?? null) : null,
    };
  }

  /**
   * Load a trip and assert the viewer may see it (creator, participant, or invitee).
   * Used both for the detail endpoint and internally after mutations.
   */
  async getTripDetail(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId },
      include: {
        creator: { select: USER_SUMMARY_SELECT },
        coverDocument: { select: { storageKey: true } },
        participants: {
          orderBy: { joinedAt: 'asc' },
          include: { user: { select: USER_SUMMARY_SELECT } },
        },
        invitations: true,
        dateCandidates: {
          orderBy: { startDate: 'asc' },
          include: { votes: { select: { userId: true } } },
        },
      },
    });

    if (!trip) {
      throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: 'Trip not found' });
    }

    const isCreator = trip.creatorId === userId;
    const isParticipant = trip.participants.some((p) => p.userId === userId);
    const isInvited = trip.invitations.some(
      (i) => i.invitedUserId === userId && i.status === 'pending',
    );

    if (!isCreator && !isParticipant && !isInvited) {
      throw new ForbiddenException({
        code: 'TRIP_ACCESS_DENIED',
        message: 'You do not have access to this trip',
      });
    }

    return TripSerializer.toDetail(
      trip,
      trip.coverDocument?.storageKey
        ? await this.r2.presignDownload(trip.coverDocument.storageKey)
        : null,
      this.r2,
    );
  }

  /** Update trip metadata — creator only. */
  async updateTrip(tripId: string, userId: string, dto: UpdateTripInput) {
    await this.assertCreator(tripId, userId);

    await this.prisma.trip.update({
      where: { id: tripId },
      data: {
        name: dto.name,
        tags: dto.tags ?? undefined,
        startDate: dto.start_date ? new Date(dto.start_date) : undefined,
        endDate: dto.end_date ? new Date(dto.end_date) : undefined,
        isAllDay: dto.is_all_day,
        startTime: dto.start_time
          ? new Date(`2000-01-01T${dto.start_time}:00Z`)
          : undefined,
        endTime: dto.end_time ? new Date(`2000-01-01T${dto.end_time}:00Z`) : undefined,
        isPublic: dto.is_public,
      },
    });

    return this.getTripDetail(tripId, userId);
  }

  /** Soft-delete a trip — creator only. */
  async deleteTrip(tripId: string, userId: string): Promise<void> {
    await this.assertCreator(tripId, userId);

    await this.prisma.trip.update({
      where: { id: tripId },
      data: { deletedAt: new Date() },
    });
  }

  /** Set the trip cover from an existing trip_documents row — creator only. */
  async setTripCover(tripId: string, userId: string, documentId: string) {
    await this.assertCreator(tripId, userId);

    const doc = await this.prisma.tripDocument.findUnique({
      where: { id: documentId },
      select: { id: true, tripId: true },
    });

    if (!doc || doc.tripId !== tripId) {
      throw new NotFoundException({
        code: 'DOCUMENT_NOT_FOUND',
        message: 'Document not found in this trip',
      });
    }

    await this.prisma.trip.update({
      where: { id: tripId },
      data: { coverDocumentId: documentId },
    });

    return this.getTripDetail(tripId, userId);
  }

  /** Remove the trip cover (falls back to no cover) — creator only. */
  async removeTripCover(tripId: string, userId: string) {
    await this.assertCreator(tripId, userId);

    await this.prisma.trip.update({
      where: { id: tripId },
      data: { coverDocumentId: null },
    });

    return this.getTripDetail(tripId, userId);
  }

  /**
   * Members screen payload (WORKFLOW §11, Screen 97–102): active members plus
   * outstanding invitations (pending + declined) so the client can render the
   * "N pending" section, "Batalkan" / "Undang kembali" actions, and mark
   * already-invited users in search results. Any member may view.
   */
  async getTripMembers(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId },
      select: { id: true, creatorId: true },
    });

    if (!trip) {
      throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: 'Trip not found' });
    }

    const participants = await this.prisma.tripParticipant.findMany({
      where: { tripId },
      orderBy: { joinedAt: 'asc' },
      include: { user: { select: USER_SUMMARY_SELECT } },
    });

    const isMember = trip.creatorId === userId || participants.some((p) => p.userId === userId);
    if (!isMember) {
      throw new ForbiddenException({
        code: 'TRIP_ACCESS_DENIED',
        message: 'You do not have access to this trip',
      });
    }

    // Outstanding invitations: pending (awaiting response) + declined (re-invitable).
    // accepted → already a member; cancelled → withdrawn, both excluded.
    const invitations = await this.prisma.tripInvitation.findMany({
      where: { tripId, status: { in: ['pending', 'declined'] } },
      orderBy: { createdAt: 'desc' },
      include: { invitedUser: { select: USER_SUMMARY_SELECT } },
    });

    return {
      is_creator: trip.creatorId === userId,
      members: await Promise.all(
        participants.map((p) =>
          TripSerializer.toMember({ ...p, creatorId: trip.creatorId }, this.r2),
        ),
      ),
      invitations: await Promise.all(
        invitations.map((inv) => InvitationSerializer.toManaged(inv, this.r2)),
      ),
    };
  }

  /**
   * Leave a trip as a member — removes yourself from participants.
   * The creator cannot leave (they own the trip); they should delete instead.
   */
  async leaveTrip(tripId: string, userId: string): Promise<void> {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId },
      select: { id: true, creatorId: true },
    });

    if (!trip) {
      throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: 'Trip not found' });
    }

    if (trip.creatorId === userId) {
      throw new BadRequestException({
        code: 'CREATOR_CANNOT_LEAVE',
        message: 'The trip creator cannot leave the trip',
      });
    }

    const participant = await this.prisma.tripParticipant.findUnique({
      where: { tripId_userId: { tripId, userId } },
    });

    if (!participant) {
      throw new NotFoundException({
        code: 'MEMBER_NOT_FOUND',
        message: 'You are not a member of this trip',
      });
    }

    await this.prisma.tripParticipant.delete({
      where: { tripId_userId: { tripId, userId } },
    });
  }

  /** Remove a member — creator only; creator cannot remove themselves. */
  async removeMember(tripId: string, memberId: string, userId: string): Promise<void> {
    const trip = await this.assertCreator(tripId, userId);

    if (memberId === trip.creatorId) {
      throw new BadRequestException({
        code: 'CANNOT_REMOVE_CREATOR',
        message: 'The trip creator cannot be removed',
      });
    }

    const participant = await this.prisma.tripParticipant.findUnique({
      where: { tripId_userId: { tripId, userId: memberId } },
    });

    if (!participant) {
      throw new NotFoundException({
        code: 'MEMBER_NOT_FOUND',
        message: 'Member not found in this trip',
      });
    }

    await this.prisma.tripParticipant.delete({
      where: { tripId_userId: { tripId, userId: memberId } },
    });
  }

  /** Load a trip and assert `userId` is its creator. Returns the trip row. */
  private async assertCreator(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId },
      select: { id: true, creatorId: true },
    });

    if (!trip) {
      throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: 'Trip not found' });
    }

    if (trip.creatorId !== userId) {
      throw new ForbiddenException({
        code: 'NOT_TRIP_CREATOR',
        message: 'Only the trip creator can perform this action',
      });
    }

    return trip;
  }
}

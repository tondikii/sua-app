import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageSerializer } from './serializers/message.serializer';
import { R2Service } from '../integrations/r2/r2.service';

const USER_SUMMARY_SELECT = {
  id: true,
  name: true,
  username: true,
  avatarUrl: true,
} as const;

const MESSAGE_INCLUDE = {
  sender: { select: USER_SUMMARY_SELECT },
  replyTo: {
    include: { sender: { select: USER_SUMMARY_SELECT } },
  },
} as const;

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

  /**
   * List messages for a trip, most recent first, cursor paginated by
   * `created_at` (RFC3339). Participants only. (WORKFLOW §9, ARCHITECTURE §3.3)
   */
  async listMessages(tripId: string, userId: string, cursor?: string, limit = 20) {
    await this.assertParticipant(tripId, userId);

    const take = Math.min(limit, 100);

    const messages = await this.prisma.tripMessage.findMany({
      where: {
        tripId,
        deletedAt: null,
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: take + 1,
      include: MESSAGE_INCLUDE,
    });

    const hasMore = messages.length > take;
    const results = hasMore ? messages.slice(0, take) : messages;

    // Unread badge: count of messages from others after the user's read cursor.
    const readRow = await this.prisma.tripMessageRead.findUnique({
      where: { tripId_userId: { tripId, userId } },
    });
    const unreadCount = readRow
      ? await this.prisma.tripMessage.count({
          where: {
            tripId,
            deletedAt: null,
            createdAt: { gt: readRow.lastReadAt },
            senderId: { not: userId },
          },
        })
      : await this.prisma.tripMessage.count({
          where: { tripId, deletedAt: null, senderId: { not: userId } },
        });

    return {
      data: await Promise.all(results.map((m) => this.toMessageResponse(m))),
      next_cursor: hasMore ? (results[results.length - 1]?.createdAt.toISOString() ?? null) : null,
      unread_count: unreadCount,
    };
  }

  /**
   * Send a message. Participants only.
   * - `text`: requires `message_text`.
   * - `photo`/`video`: requires `media_url`; auto-inserts a `trip_documents`
   *   row with `from_chat=true` so it also appears in the Media tab
   *   (ARCHITECTURE §3.3, §7; WORKFLOW §9 → §10 integration).
   */
  async createMessage(tripId: string, userId: string, dto: any) {
    await this.assertParticipant(tripId, userId);

    if (dto.message_kind === 'text') {
      if (!dto.message_text) {
        throw new BadRequestException({
          code: 'MESSAGE_TEXT_REQUIRED',
          message: 'message_text is required for text messages',
        });
      }
    } else {
      if (!dto.media_url) {
        throw new BadRequestException({
          code: 'MEDIA_URL_REQUIRED',
          message: 'media_url is required for photo/video messages',
        });
      }
    }

    if (dto.reply_to_id) {
      const replyTarget = await this.prisma.tripMessage.findFirst({
        where: { id: dto.reply_to_id, tripId },
      });
      if (!replyTarget) {
        throw new NotFoundException({
          code: 'REPLY_TARGET_NOT_FOUND',
          message: 'The message being replied to was not found in this trip',
        });
      }
    }

    const message = await this.prisma.$transaction(async (tx) => {
      const created = await tx.tripMessage.create({
        data: {
          tripId,
          senderId: userId,
          messageKind: dto.message_kind,
          messageText: dto.message_text ?? null,
          mediaUrl: dto.media_url ?? null,
          replyToId: dto.reply_to_id ?? null,
        },
        include: MESSAGE_INCLUDE,
      });

      if (dto.message_kind === 'photo' || dto.message_kind === 'video') {
        await tx.tripDocument.create({
          data: {
            tripId,
            uploadedBy: userId,
            mediaType: dto.message_kind,
            storageKey: this.r2.extractStorageKey(dto.media_url!),
            storageUrl: dto.media_url!,
            fromChat: true,
          },
        });
      }

      return created;
    });

    return this.toMessageResponse(message);
  }

  /**
   * Soft delete a message — sender only (WORKFLOW §9, `Screen88`).
   */
  async deleteMessage(tripId: string, messageId: string, userId: string): Promise<void> {
    const message = await this.prisma.tripMessage.findFirst({
      where: { id: messageId, tripId },
    });

    if (!message) {
      throw new NotFoundException({
        code: 'MESSAGE_NOT_FOUND',
        message: 'Message not found',
      });
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException({
        code: 'NOT_MESSAGE_SENDER',
        message: 'Only the sender can delete this message',
      });
    }

    if (message.deletedAt) {
      return; // already deleted — idempotent
    }

    await this.prisma.tripMessage.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Advance the caller's read cursor for a trip's chat (unread badge, WORKFLOW §9).
   */
  async markRead(tripId: string, userId: string): Promise<void> {
    await this.assertParticipant(tripId, userId);

    await this.prisma.tripMessageRead.upsert({
      where: { tripId_userId: { tripId, userId } },
      create: { tripId, userId, lastReadAt: new Date() },
      update: { lastReadAt: new Date() },
    });
  }

  private async toMessageResponse(message: Parameters<typeof MessageSerializer.toList>[0]) {
    const mediaUrl = await this.resolveMediaUrl(message);
    return MessageSerializer.toList(message, mediaUrl);
  }

  private async resolveMediaUrl(
    message: Pick<
      Parameters<typeof MessageSerializer.toList>[0],
      'messageKind' | 'mediaUrl' | 'deletedAt'
    >,
  ): Promise<string | null> {
    if (message.deletedAt || !message.mediaUrl) return message.mediaUrl;
    if (message.messageKind !== 'photo' && message.messageKind !== 'video') {
      return message.mediaUrl;
    }

    return this.r2.presignDownload(this.r2.extractStorageKey(message.mediaUrl));
  }

  private async assertParticipant(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId, participants: { some: { userId } } },
      select: { id: true },
    });

    if (!trip) {
      throw new NotFoundException({
        code: 'TRIP_NOT_FOUND',
        message: 'Trip not found or access denied',
      });
    }

    return trip;
  }
}

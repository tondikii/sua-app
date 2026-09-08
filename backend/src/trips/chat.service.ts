import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageSerializer } from './serializers/message.serializer';
import { R2Service } from '../integrations/r2/r2.service';
import type { CreateMessageInput } from '@atur-perjalanan/shared-validation';
import type { MediaType } from '@prisma/client';

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

    // Batch presign all media keys in one go to minimize signing overhead.
    const mediaKeys = results
      .filter((m) => !m.deletedAt && m.mediaUrl && (m.messageKind === 'photo' || m.messageKind === 'video'))
      .map((m) => this.r2.extractStorageKey(m.mediaUrl!));
    const presignedMap = await this.r2.presignDownloads(mediaKeys);

    return {
      data: await Promise.all(
        results.map((m) => {
          if (m.deletedAt || !m.mediaUrl) return this.toMessageResponse(m, null);
          if (m.messageKind !== 'photo' && m.messageKind !== 'video') return this.toMessageResponse(m, m.mediaUrl);
          const key = this.r2.extractStorageKey(m.mediaUrl);
          return this.toMessageResponse(m, presignedMap.get(key) ?? m.mediaUrl);
        }),
      ),
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
  async createMessage(tripId: string, userId: string, dto: CreateMessageInput) {
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
      const storageKey =
        dto.message_kind === 'photo' || dto.message_kind === 'video'
          ? this.r2.extractStorageKey(dto.media_url!)
          : null;

      const created = await tx.tripMessage.create({
        data: {
          tripId,
          senderId: userId,
          messageKind: dto.message_kind,
          messageText: dto.message_text ?? null,
          mediaUrl: storageKey ? this.r2.resolvePublicUrl(storageKey) : null,
          mediaDuration: dto.media_duration_seconds
            ? this.toIntervalString(dto.media_duration_seconds)
            : null,
          replyToId: dto.reply_to_id ?? null,
        },
        include: MESSAGE_INCLUDE,
      });

      if (storageKey) {
        const mediaDuration = dto.media_duration_seconds
          ? this.toIntervalString(dto.media_duration_seconds)
          : null;
        await tx.tripDocument.create({
          data: {
            tripId,
            uploadedBy: userId,
            mediaType: dto.message_kind as MediaType,
            storageKey,
            storageUrl: this.r2.resolvePublicUrl(storageKey),
            mediaDuration,
            fromChat: true,
            messageId: created.id,
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

    await this.prisma.$transaction(async (tx) => {
      // Soft-delete the message (chat shows "Pesan dihapus").
      await tx.tripMessage.update({
        where: { id: messageId },
        data: { deletedAt: new Date() },
      });

      // Media sent through chat should vanish from the Media tab too, since
      // its origin (the message) no longer exists. Hard-delete the linked
      // trip_documents row (the R2 object stays; only the DB reference dies).
      const linkedDocs = await tx.tripDocument.findMany({
        where: { messageId },
      });
      for (const doc of linkedDocs) {
        // Clear cover references pointing at this document before deleting.
        await tx.trip.updateMany({
          where: { id: tripId, coverDocumentId: doc.id },
          data: { coverDocumentId: null },
        });
        await tx.tripActivity.updateMany({
          where: { tripId, coverDocumentId: doc.id },
          data: { coverDocumentId: null, coverSource: 'none' },
        });
      }
      await tx.tripDocument.deleteMany({
        where: { messageId },
      });
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

  private async toMessageResponse(
    message: Parameters<typeof MessageSerializer.toList>[0],
    mediaUrlOverride?: string | null,
  ) {
    const mediaUrl =
      mediaUrlOverride !== undefined ? mediaUrlOverride : await this.resolveMediaUrl(message);
    return MessageSerializer.toList(message, mediaUrl, this.r2);
  }

  /** Convert seconds to a Postgres interval string (e.g. 84 -> "00:01:24"). */
  private toIntervalString(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
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

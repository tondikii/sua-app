import { UserSummarySerializer } from '../../users/serializers/user.serializer';
import type { R2Service } from '../../integrations/r2/r2.service';
import type { TripMessage, UserSummary } from '@atur-perjalanan/shared-types';

type LocalUserSummary = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
} | null;

type MessageRow = {
  id: string;
  tripId: string;
  senderId: string;
  messageKind: string;
  messageText: string | null;
  mediaUrl: string | null;
  mediaDuration: unknown | null;
  replyToId: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  sender?: LocalUserSummary;
  replyTo?: (MessageRow & { sender?: LocalUserSummary }) | null;
};

async function toUserSummary(user: LocalUserSummary, r2: R2Service) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatar_url: await UserSummarySerializer.resolveAvatar(user.avatarUrl, r2),
  };
}

export class MessageSerializer {
  static async toList(
    message: MessageRow,
    mediaUrlOverride?: string | null,
    r2?: R2Service,
  ) {
    const isDeleted = !!message.deletedAt;
    const mediaUrl = mediaUrlOverride ?? message.mediaUrl;

    return {
      id: message.id,
      trip_id: message.tripId,
      sender: await toUserSummary(message.sender ?? null, r2!),
      message_kind: message.messageKind,
      message_text: isDeleted ? null : message.messageText,
      media_url: isDeleted ? null : mediaUrl,
      media_duration_seconds: this.durationToSeconds(message.mediaDuration),
      reply_to: message.replyTo
        ? {
            id: message.replyTo.id,
            sender: await toUserSummary(message.replyTo.sender ?? null, r2!),
            message_kind: message.replyTo.messageKind,
            message_text: message.replyTo.deletedAt ? null : message.replyTo.messageText,
          }
        : null,
      is_deleted: isDeleted,
      created_at: message.createdAt.toISOString(),
    };
  }

  private static durationToSeconds(duration: unknown): number | null {
    if (!duration) return null;
    if (typeof duration === 'string') {
      const parts = duration.split(':').map(Number);
      if (parts.length === 3) {
        const [h, m, s] = parts;
        return h * 3600 + m * 60 + s;
      }
    }
    return null;
  }
}

type UserSummary = {
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
    sender?: UserSummary;
    replyTo?: (MessageRow & { sender?: UserSummary }) | null;
  };
  
  function toUserSummary(user: UserSummary) {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar_url: user.avatarUrl,
    };
  }
  
  export class MessageSerializer {
    /**
     * Serialize a message for the chat thread list. Soft-deleted messages keep
     * their envelope (id, sender, created_at) but blank out content so clients
     * can render a "Pesan dihapus" placeholder without a second lookup.
     */
    static toList(message: MessageRow, mediaUrlOverride?: string | null) {
      const isDeleted = !!message.deletedAt;
      const mediaUrl = mediaUrlOverride ?? message.mediaUrl;

      return {
        id: message.id,
        trip_id: message.tripId,
        sender: toUserSummary(message.sender ?? null),
        message_kind: message.messageKind,
        message_text: isDeleted ? null : message.messageText,
        media_url: isDeleted ? null : mediaUrl,
        media_duration_seconds: this.durationToSeconds(message.mediaDuration),
        reply_to: message.replyTo
          ? {
              id: message.replyTo.id,
              sender: toUserSummary(message.replyTo.sender ?? null),
              message_kind: message.replyTo.messageKind,
              message_text: message.replyTo.deletedAt
                ? null
                : message.replyTo.messageText,
            }
          : null,
        is_deleted: isDeleted,
        created_at: message.createdAt.toISOString(),
      };
    }
  
    private static durationToSeconds(duration: unknown): number | null {
      if (!duration) return null;
      // Prisma maps INTERVAL to a string like "00:00:24" by default.
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
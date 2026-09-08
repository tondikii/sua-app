import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripMessage } from '@atur-perjalanan/shared-types';

interface SendMessagePayload {
  message_kind: 'text' | 'photo' | 'video';
  message_text?: string;
  media_url?: string;
  media_duration_seconds?: number;
  reply_to_id?: string;
}

type MessagesInfinite = {
  pages: { data: TripMessage[]; next_cursor: string | null; unread_count: number }[];
  pageParams: unknown[];
};

export function useSendMessage(tripId: string) {
  const qc = useQueryClient();
  return useMutation<TripMessage, Error, SendMessagePayload>({
    mutationFn: (payload) =>
      apiClient.post<TripMessage>(`/trips/${tripId}/messages`, payload),

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: ['messages', tripId] });
      const previous = qc.getQueryData<MessagesInfinite>(['messages', tripId]);

      // Build optimistic message from cached user (fallback to minimal sender).
      const cachedUser = (qc.getQueryData(['user']) as any) ?? (qc.getQueryData(['me']) as any);
      // Try also to read from trip cache for avatar fallback.
      const tripDetail = qc.getQueryData(['trip', tripId]) as any;
      const optimisticId = `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      // Resolve reply preview if available in cache.
      let replyTo: TripMessage['reply_to'] = null;
      if (payload.reply_to_id && previous) {
        const all = previous.pages.flatMap((p) => p.data);
        const found = all.find((m) => m.id === payload.reply_to_id);
        if (found) {
          replyTo = {
            id: found.id,
            sender: found.sender,
            message_kind: found.message_kind,
            message_text: found.message_text,
          } as any;
        }
      }

      const optimistic: TripMessage = {
        id: optimisticId,
        trip_id: tripId,
        sender: cachedUser
          ? {
              id: cachedUser.id ?? cachedUser.user?.id ?? 'me',
              name: cachedUser.name ?? cachedUser.user?.name ?? 'Kamu',
              username: cachedUser.username ?? cachedUser.user?.username ?? 'you',
              avatar_url: cachedUser.avatar_url ?? cachedUser.user?.avatar_url ?? null,
            }
          : tripDetail?.creator
            ? {
                id: tripDetail.creator.id,
                name: tripDetail.creator.name,
                username: tripDetail.creator.username,
                avatar_url: tripDetail.creator.avatar_url ?? null,
              }
            : { id: 'me', name: 'Kamu', username: 'you', avatar_url: null },
        message_kind: payload.message_kind,
        message_text: payload.message_text ?? null,
        media_url: payload.media_url ?? null,
        media_duration_seconds: payload.media_duration_seconds ?? null,
        reply_to: replyTo,
        is_deleted: false,
        created_at: new Date().toISOString(),
      };

      qc.setQueryData<MessagesInfinite>(['messages', tripId], (old) => {
        if (!old) {
          return {
            pages: [{ data: [optimistic], next_cursor: null, unread_count: 0 }],
            pageParams: [null],
          };
        }
        const pages = [...old.pages];
        // newest messages are pages[0].data[0] (desc order); optimistically prepend.
        pages[0] = { ...pages[0], data: [optimistic, ...pages[0].data] };
        return { ...old, pages };
      });

      return { previous, optimisticId };
    },

    onSuccess: (realMessage, _payload, context) => {
      qc.setQueryData<MessagesInfinite>(['messages', tripId], (old) => {
        if (!old || !context?.optimisticId) return old;
        const pages = old.pages.map((p) => ({
          ...p,
          data: p.data.map((m) => (m.id === context.optimisticId ? realMessage : m)),
        }));
        // Dedupe if realtime already inserted the real id (same id appears twice).
        const seen = new Set<string>();
        pages.forEach((p) => {
          p.data = p.data.filter((m) => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
          });
        });
        return { ...old, pages };
      });
      // Trip preview (last message) can be stale — refresh lightly without blocking.
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
    },

    onError: (_err, _payload, context) => {
      if (context?.previous) {
        qc.setQueryData(['messages', tripId], context.previous);
      }
    },
  });
}

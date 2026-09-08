import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripMessage } from '@atur-perjalanan/shared-types';

type MessagesInfinite = {
  pages: { data: TripMessage[]; next_cursor: string | null; unread_count: number }[];
  pageParams: unknown[];
};

export function useDeleteMessage(tripId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (messageId) =>
      apiClient.delete<void>(`/trips/${tripId}/messages/${messageId}`),

    onMutate: async (messageId) => {
      await qc.cancelQueries({ queryKey: ['messages', tripId] });
      const previous = qc.getQueryData<MessagesInfinite>(['messages', tripId]);
      qc.setQueryData<MessagesInfinite>(['messages', tripId], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            data: p.data.map((m) =>
              m.id === messageId ? { ...m, is_deleted: true, message_text: null, media_url: null } : m,
            ),
          })),
        };
      });
      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) qc.setQueryData(['messages', tripId], context.previous);
    },

    onSuccess: () => {
      // No full invalidate — optimistic already correct; realtime UPDATE will confirm.
    },
  });
}

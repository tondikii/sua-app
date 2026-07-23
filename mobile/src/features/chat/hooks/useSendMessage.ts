import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripMessage } from '@atur-perjalanan/shared-types';

interface SendMessagePayload {
  message_kind: 'text' | 'photo' | 'video';
  message_text?: string;
  media_url?: string;
  reply_to_id?: string;
}

export function useSendMessage(tripId: string) {
  const qc = useQueryClient();
  return useMutation<TripMessage, Error, SendMessagePayload>({
    mutationFn: (payload) =>
      apiClient.post<TripMessage>(`/trips/${tripId}/messages`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages', tripId] });
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
    },
  });
}

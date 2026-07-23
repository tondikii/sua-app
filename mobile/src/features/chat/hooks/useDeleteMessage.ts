import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useDeleteMessage(tripId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (messageId) =>
      apiClient.delete<void>(`/trips/${tripId}/messages/${messageId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages', tripId] }),
  });
}

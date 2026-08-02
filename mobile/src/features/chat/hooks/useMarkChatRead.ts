import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useMarkChatRead(tripId: string) {
  const qc = useQueryClient();
  return useMutation<void>({
    mutationFn: () => apiClient.put<void>(`/trips/${tripId}/messages/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages', tripId] });
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
    },
  });
}

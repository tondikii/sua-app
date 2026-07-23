import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useDeletePoll(tripId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (pollId) => apiClient.delete<void>(`/trips/${tripId}/polls/${pollId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['polls', tripId] }),
  });
}

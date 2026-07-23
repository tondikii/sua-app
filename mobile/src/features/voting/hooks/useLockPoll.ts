import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useLockPoll(tripId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (pollId) =>
      apiClient.post<void>(`/trips/${tripId}/polls/${pollId}/lock`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['polls', tripId] });
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
      qc.invalidateQueries({ queryKey: ['activities', tripId] });
    },
  });
}

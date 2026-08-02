import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useRemoveCover(tripId: string) {
  const qc = useQueryClient();
  return useMutation<unknown, Error, void>({
    mutationFn: () => apiClient.delete(`/trips/${tripId}/cover`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents', tripId] });
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

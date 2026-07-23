import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useDeleteTrip(tripId: string) {
  const qc = useQueryClient();
  return useMutation<void>({
    mutationFn: () => apiClient.delete<void>(`/trips/${tripId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

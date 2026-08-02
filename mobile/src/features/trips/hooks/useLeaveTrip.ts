import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

/** Member leaves the trip themselves (POST /trips/:tripId/leave). */
export function useLeaveTrip(tripId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error>({
    mutationFn: () => apiClient.post<void>(`/trips/${tripId}/leave`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
      qc.invalidateQueries({ queryKey: ['members', tripId] });
      qc.invalidateQueries({ queryKey: ['trips', 'upcoming'] });
      qc.invalidateQueries({ queryKey: ['trips', 'completed'] });
    },
  });
}

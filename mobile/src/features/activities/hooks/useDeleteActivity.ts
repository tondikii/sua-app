import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useDeleteActivity(tripId: string) {
  const qc = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (activityId) =>
      apiClient.delete(`/trips/${tripId}/activities/${activityId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['activities', tripId] });
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
    },
  });
}

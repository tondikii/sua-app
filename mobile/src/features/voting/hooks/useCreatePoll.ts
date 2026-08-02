import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripPoll, CreatePollPayload } from '@atur-perjalanan/shared-types';

export function useCreatePoll(tripId: string) {
  const qc = useQueryClient();
  return useMutation<TripPoll, Error, CreatePollPayload>({
    mutationFn: (payload) => apiClient.post<TripPoll>(`/trips/${tripId}/polls`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['polls', tripId] });
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
    },
  });
}

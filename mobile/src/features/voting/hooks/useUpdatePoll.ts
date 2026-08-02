import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripPoll, UpdatePollPayload } from '@atur-perjalanan/shared-types';

/** Edit an active poll — creator only (PATCH /trips/:tripId/polls/:pollId). */
export function useUpdatePoll(tripId: string) {
  const qc = useQueryClient();
  return useMutation<TripPoll, Error, { pollId: string; payload: UpdatePollPayload }>({
    mutationFn: ({ pollId, payload }) =>
      apiClient.patch<TripPoll>(`/trips/${tripId}/polls/${pollId}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['polls', tripId] });
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
    },
  });
}

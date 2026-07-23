import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripPoll } from '@atur-perjalanan/shared-types';

interface CreatePollPayload {
  poll_type: 'aktivitas' | 'lainnya';
  title: string;
  options: string[];
  deadline?: string;
}

export function useCreatePoll(tripId: string) {
  const qc = useQueryClient();
  return useMutation<TripPoll, Error, CreatePollPayload>({
    mutationFn: (payload) => apiClient.post<TripPoll>(`/trips/${tripId}/polls`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['polls', tripId] }),
  });
}

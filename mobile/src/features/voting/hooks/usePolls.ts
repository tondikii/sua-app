import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripPoll } from '@atur-perjalanan/shared-types';

interface PollsResponse {
  data: TripPoll[];
}

export function usePolls(tripId: string) {
  return useQuery<PollsResponse>({
    queryKey: ['polls', tripId],
    queryFn: () => apiClient.get<PollsResponse>(`/trips/${tripId}/polls`),
    staleTime: 15_000,
  });
}

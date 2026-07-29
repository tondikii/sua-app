import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripSummary } from '@atur-perjalanan/shared-types';

interface TripsResponse {
  data: TripSummary[];
  next_cursor: string | null;
}

export function useUserTrips(username: string) {
  return useQuery<TripsResponse>({
    queryKey: ['userTrips', username],
    queryFn: () => apiClient.get<TripsResponse>(`/users/${username}/trips`),
    enabled: !!username,
    staleTime: 30_000,
    refetchOnMount: 'always',
  });
}

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripActivity } from '@atur-perjalanan/shared-types';

interface ActivitiesResponse {
  data: TripActivity[];
  next_cursor: string | null;
}

export function useActivities(tripId: string) {
  return useQuery<ActivitiesResponse>({
    queryKey: ['activities', tripId],
    queryFn: () => apiClient.get<ActivitiesResponse>(`/trips/${tripId}/activities`),
    staleTime: 30_000,
  });
}

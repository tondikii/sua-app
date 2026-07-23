import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripDetail } from '@atur-perjalanan/shared-types';

export function useTripDetail(tripId: string) {
  return useQuery<TripDetail>({
    queryKey: ['trip', tripId],
    queryFn: () => apiClient.get<TripDetail>(`/trips/${tripId}`),
    staleTime: 30_000,
  });
}

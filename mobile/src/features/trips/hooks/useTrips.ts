import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripSummary } from '@atur-perjalanan/shared-types';

interface TripsPage {
  data: TripSummary[];
  next_cursor: string | null;
}

export function useTrips(tab: 'upcoming' | 'completed') {
  return useInfiniteQuery<TripsPage>({
    queryKey: ['trips', tab],
    queryFn: ({ pageParam }) => {
      const cursor = pageParam ? `&cursor=${pageParam}` : '';
      return apiClient.get<TripsPage>(`/trips?tab=${tab}&limit=20${cursor}`);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
    staleTime: 30_000,
  });
}

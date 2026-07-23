import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripMessage } from '@atur-perjalanan/shared-types';

interface MessagesPage {
  data: TripMessage[];
  next_cursor: string | null;
}

export function useMessages(tripId: string) {
  return useInfiniteQuery<MessagesPage>({
    queryKey: ['messages', tripId],
    queryFn: ({ pageParam }) => {
      const cursor = pageParam ? `?cursor=${pageParam}` : '';
      return apiClient.get<MessagesPage>(`/trips/${tripId}/messages${cursor}`);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
    staleTime: 5_000,
    refetchInterval: 10_000,
  });
}

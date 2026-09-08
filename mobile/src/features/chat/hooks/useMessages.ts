import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripMessage } from '@atur-perjalanan/shared-types';

interface MessagesPage {
  data: TripMessage[];
  next_cursor: string | null;
  unread_count: number;
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
    // Chat is realtime-driven: no polling, small stale window so
    // background refetch is cheap but not on every focus.
    staleTime: 15_000,
    gcTime: 5 * 60_000,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Keep previous data while fetching next page to avoid flicker.
    placeholderData: (prev) => prev,
  });
}

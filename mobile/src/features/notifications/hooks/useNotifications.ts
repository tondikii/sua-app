import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { AppNotification } from '@atur-perjalanan/shared-types';

interface NotificationsPage {
  data: AppNotification[];
  next_cursor: string | null;
}

export function useNotifications() {
  return useInfiniteQuery<NotificationsPage>({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) => {
      const cursor = pageParam ? `?cursor=${pageParam}` : '';
      return apiClient.get<NotificationsPage>(`/notifications${cursor}`);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
    staleTime: 15_000,
  });
}

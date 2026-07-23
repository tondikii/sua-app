import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

interface UnreadCountResponse {
  unread_count: number;
}

export function useUnreadCount() {
  return useQuery<UnreadCountResponse>({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => apiClient.get<UnreadCountResponse>('/notifications/unread-count'),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { UserSummary } from '@atur-perjalanan/shared-types';

interface SearchResponse {
  data: UserSummary[];
  next_cursor: string | null;
}

export function useUserSearch(query: string) {
  return useQuery<SearchResponse>({
    queryKey: ['users', 'search', query],
    queryFn: () =>
      apiClient.get<SearchResponse>(`/users/search?q=${encodeURIComponent(query)}&limit=20`),
    enabled: query.trim().length >= 2,
    staleTime: 10_000,
  });
}

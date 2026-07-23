import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { WishlistItem } from '@atur-perjalanan/shared-types';

interface WishlistsPage {
  data: WishlistItem[];
  next_cursor: string | null;
}

export function useWishlists(priority?: string, tag?: string) {
  return useInfiniteQuery<WishlistsPage>({
    queryKey: ['wishlists', priority, tag],
    queryFn: ({ pageParam }) => {
      const parts: string[] = [];
      if (priority) parts.push(`priority=${priority}`);
      if (tag) parts.push(`tag=${tag}`);
      if (pageParam) parts.push(`cursor=${pageParam}`);
      const qs = parts.length > 0 ? `?${parts.join('&')}` : '';
      return apiClient.get<WishlistsPage>(`/wishlists${qs}`);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
    staleTime: 30_000,
  });
}

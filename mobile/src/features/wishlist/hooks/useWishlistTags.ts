import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

interface TagsResponse {
  data: string[];
}

export function useWishlistTags() {
  return useQuery<TagsResponse>({
    queryKey: ['wishlists', 'tags'],
    queryFn: () => apiClient.get<TagsResponse>('/wishlists/tags'),
    staleTime: 60_000,
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { WishlistItem, RefLink } from '@atur-perjalanan/shared-types';

interface CreateWishlistPayload {
  place_name: string;
  start_time?: string;
  end_time?: string;
  location_label?: string;
  maps_link?: string;
  ref_links?: RefLink[];
  notes?: string;
  tags?: string[];
  priority_level?: 'high' | 'medium' | 'low';
  thumbnail_url?: string;
}

export function useCreateWishlist() {
  const qc = useQueryClient();
  return useMutation<WishlistItem, Error, CreateWishlistPayload>({
    mutationFn: (payload) => apiClient.post<WishlistItem>('/wishlists', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { WishlistItem } from '@atur-perjalanan/shared-types';

export function useUpdateWishlist(id: string) {
  const qc = useQueryClient();
  return useMutation<WishlistItem, Error, Partial<WishlistItem>>({
    mutationFn: (payload) => apiClient.put<WishlistItem>(`/wishlists/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}

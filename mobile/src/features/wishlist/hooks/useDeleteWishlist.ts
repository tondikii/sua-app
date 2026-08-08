import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useDeleteWishlist() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => apiClient.delete<void>(`/wishlists/${id}`),
    onSuccess: () => {
      // refetchType 'all' so the tags query refetches even when the wishlist
      // screen is not the active screen (e.g. buried under another route).
      qc.invalidateQueries({ queryKey: ['wishlists'], refetchType: 'all' });
    },
  });
}

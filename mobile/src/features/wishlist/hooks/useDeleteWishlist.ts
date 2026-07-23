import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useDeleteWishlist() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => apiClient.delete<void>(`/wishlists/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlists'] });
    },
  });
}

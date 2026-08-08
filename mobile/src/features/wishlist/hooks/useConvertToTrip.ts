import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripDetail } from '@atur-perjalanan/shared-types';

interface ConvertPayload {
  trip_name?: string;
  tags?: string[];
  start_date: string;
  end_date: string;
  is_all_day?: boolean;
  start_time?: string;
  end_time?: string;
}

export function useConvertToTrip(wishlistId: string) {
  const qc = useQueryClient();
  return useMutation<TripDetail, Error, ConvertPayload>({
    mutationFn: (payload) =>
      apiClient.post<TripDetail>(`/wishlists/${wishlistId}/convert-to-trip`, payload),
    onSuccess: () => {
      // refetchType 'all' so the tags query refetches even when the wishlist
      // screen is not the active screen (e.g. buried under the create-trip form).
      qc.invalidateQueries({ queryKey: ['wishlists'], refetchType: 'all' });
      qc.invalidateQueries({ queryKey: ['trips'], refetchType: 'all' });
    },
  });
}

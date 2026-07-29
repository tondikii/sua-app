import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripDetail } from '@atur-perjalanan/shared-types';

interface ConvertPayload {
  trip_name?: string;
  tags?: string[];
  start_date: string;
  end_date: string;
  is_all_day?: boolean;
}

export function useConvertToTrip(wishlistId: string) {
  const qc = useQueryClient();
  return useMutation<TripDetail, Error, ConvertPayload>({
    mutationFn: (payload) =>
      apiClient.post<TripDetail>(`/wishlists/${wishlistId}/convert-to-trip`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlists'] });
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

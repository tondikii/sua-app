import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripDetail } from '@atur-perjalanan/shared-types';

interface ConvertPayload {
  trip_name?: string;
  tags?: string[];
}

export function useConvertToTrip(wishlistId: string) {
  const qc = useQueryClient();
  return useMutation<TripDetail, Error, ConvertPayload | undefined>({
    mutationFn: (payload) =>
      apiClient.post<TripDetail>(`/wishlists/${wishlistId}/convert-to-trip`, payload ?? {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlists'] });
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

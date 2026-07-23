import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripDetail } from '@atur-perjalanan/shared-types';

interface UpdateTripPayload {
  name?: string;
  tags?: string[];
  start_date?: string;
  end_date?: string;
  is_all_day?: boolean;
  start_time?: string;
  end_time?: string;
  is_public?: boolean;
}

export function useUpdateTrip(tripId: string) {
  const qc = useQueryClient();
  return useMutation<TripDetail, Error, UpdateTripPayload>({
    mutationFn: (payload) =>
      apiClient.put<TripDetail>(`/trips/${tripId}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
      qc.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

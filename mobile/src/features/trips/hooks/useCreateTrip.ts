import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripDetail } from '@atur-perjalanan/shared-types';

interface CreateTripPayload {
  name: string;
  tags?: string[];
  start_date?: string;
  end_date?: string;
  is_all_day?: boolean;
  start_time?: string;
  end_time?: string;
  candidates?: { start_date: string; end_date: string }[];
  voting_deadline?: string;
}

export function useCreateTrip() {
  const qc = useQueryClient();

  return useMutation<TripDetail, Error, CreateTripPayload>({
    mutationFn: (payload) => apiClient.post<TripDetail>('/trips', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trips', 'upcoming'] });
    },
  });
}

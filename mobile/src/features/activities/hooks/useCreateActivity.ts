import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripActivity } from '@atur-perjalanan/shared-types';

interface CreateActivityPayload {
  place_name: string;
  activity_date?: string;
  start_time: string;
  end_time: string;
  kind?: string;
  description?: string;
  location_label?: string;
  maps_link?: string;
  ref_links?: { url: string; label?: string }[];
  cover_source?: string;
  cover_icon?: string;
  cover_document_id?: string | null;
  thumbnail_url?: string | null;
  sort_order?: number;
}

export function useCreateActivity(tripId: string) {
  const qc = useQueryClient();

  return useMutation<TripActivity, Error, CreateActivityPayload>({
    mutationFn: (payload) =>
      apiClient.post<TripActivity>(`/trips/${tripId}/activities`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['activities', tripId] });
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
    },
  });
}

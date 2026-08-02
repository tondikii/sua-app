import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useSyncMapsThumbnail(tripId: string) {
  return useMutation<{ thumbnail_url: string | null }, Error, { maps_link: string }>({
    mutationFn: ({ maps_link }) =>
      apiClient.post<{ thumbnail_url: string | null }>(
        `/trips/${tripId}/activities/sync-maps-thumbnail`,
        { maps_link },
      ),
  });
}

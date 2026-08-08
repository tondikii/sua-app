import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripDetail } from '@atur-perjalanan/shared-types';

export function useSetCover(tripId: string) {
  const qc = useQueryClient();
  return useMutation<TripDetail, Error, string>({
    mutationFn: (documentId) =>
      apiClient.put<TripDetail>(`/trips/${tripId}/cover`, { document_id: documentId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents', tripId] });
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.invalidateQueries({ queryKey: ['userTrips'] });
    },
  });
}

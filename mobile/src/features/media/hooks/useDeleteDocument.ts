import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useDeleteDocument(tripId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (documentId) =>
      apiClient.delete<void>(`/trips/${tripId}/documents/${documentId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents', tripId] });
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
    },
  });
}

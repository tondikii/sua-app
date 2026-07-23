import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useRemoveMember(tripId: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (userId) =>
      apiClient.delete<void>(`/trips/${tripId}/members/${userId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members', tripId] });
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
    },
  });
}

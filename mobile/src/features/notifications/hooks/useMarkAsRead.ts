import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useMarkAsRead() {
  const qc = useQueryClient();

  const markOne = useMutation<void, Error, string>({
    mutationFn: (id) => apiClient.put<void>(`/notifications/${id}/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  const markAll = useMutation<void, Error>({
    mutationFn: () => apiClient.put<void>('/notifications/read-all'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  return { markOne, markAll };
}

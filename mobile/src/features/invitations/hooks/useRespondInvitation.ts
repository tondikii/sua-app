import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

interface RespondPayload {
  tripId: string;
  invitationId: string;
  accept: boolean;
}

export function useRespondInvitation() {
  const qc = useQueryClient();

  return useMutation<void, Error, RespondPayload>({
    mutationFn: ({ tripId, invitationId, accept }) =>
      apiClient.put<void>(`/trips/${tripId}/invitations/${invitationId}`, { accept }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invitations'] });
      qc.invalidateQueries({ queryKey: ['trips', 'upcoming'] });
      qc.invalidateQueries({ queryKey: ['trips', 'completed'] });
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });
}

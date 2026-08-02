import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

/** Cancel a pending invitation — inviter only (DELETE /v1/trips/:tripId/invitations/:invitationId). */
export function useCancelInvitation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      apiClient.delete<void>(`/trips/${tripId}/invitations/${invitationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['tripMembers', tripId] });
    },
  });
}

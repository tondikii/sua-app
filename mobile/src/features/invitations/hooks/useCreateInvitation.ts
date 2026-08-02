import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { InvitationBasic } from '@atur-perjalanan/shared-types';

interface CreateInvitationPayload {
  username?: string;
  email?: string;
}

export function useCreateInvitation(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInvitationPayload) =>
      apiClient.post<InvitationBasic>(`/trips/${tripId}/invitations`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['tripMembers', tripId] });
    },
  });
}

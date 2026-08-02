import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { UserSummary, ManagedInvitation } from '@atur-perjalanan/shared-types';

export interface Member extends UserSummary {
  joined_at: string;
  role: 'creator' | 'member';
}

export interface MembersResponse {
  is_creator: boolean;
  members: Member[];
  invitations: ManagedInvitation[];
}

export function useMembers(tripId: string) {
  return useQuery<MembersResponse>({
    queryKey: ['members', tripId],
    queryFn: () => apiClient.get<MembersResponse>(`/trips/${tripId}/members`),
    staleTime: 30_000,
  });
}

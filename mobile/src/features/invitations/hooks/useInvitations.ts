import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { TripInvitation } from '@atur-perjalanan/shared-types';

interface InvitationsPage {
  data: TripInvitation[];
  next_cursor: string | null;
}

export function useInvitations() {
  return useInfiniteQuery<InvitationsPage>({
    queryKey: ['invitations'],
    queryFn: ({ pageParam }) => {
      const cursor = pageParam ? `?cursor=${pageParam}` : '';
      return apiClient.get<InvitationsPage>(`/trips/invitations${cursor}`);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
    staleTime: 30_000,
  });
}

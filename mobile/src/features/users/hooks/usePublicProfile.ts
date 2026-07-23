import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { UserProfile } from '@atur-perjalanan/shared-types';

export function usePublicProfile(username: string) {
  return useQuery<UserProfile>({
    queryKey: ['user', username],
    queryFn: () => apiClient.get<UserProfile>(`/users/${username}`),
    enabled: !!username,
    staleTime: 30_000,
  });
}

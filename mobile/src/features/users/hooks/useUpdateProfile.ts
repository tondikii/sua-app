import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useAuth } from '@/auth/AuthProvider';
import type { UserProfile } from '@atur-perjalanan/shared-types';

interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  website_url?: string;
  location_label?: string;
  is_public?: boolean;
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { setUser } = useAuth();
  return useMutation<UserProfile, Error, UpdateProfilePayload>({
    mutationFn: (payload) => apiClient.put<UserProfile>('/users/me', payload),
    onSuccess: (profile) => {
      setUser(profile);
      // Profile/avatar changes ripple into trips, members, polls, search,
      // invitations and notifications — refresh them all so avatars stay fresh.
      qc.invalidateQueries({ queryKey: ['user'] });
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.invalidateQueries({ queryKey: ['members'] });
      qc.invalidateQueries({ queryKey: ['trip'] });
      qc.invalidateQueries({ queryKey: ['polls'] });
      qc.invalidateQueries({ queryKey: ['users', 'search'] });
      qc.invalidateQueries({ queryKey: ['invitations'] });
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

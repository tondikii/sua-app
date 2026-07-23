import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { UserProfile } from '@atur-perjalanan/shared-types';

interface UpdateProfilePayload {
  bio?: string;
  website_url?: string;
  location_label?: string;
  is_public?: boolean;
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation<UserProfile, Error, UpdateProfilePayload>({
    mutationFn: (payload) => apiClient.put<UserProfile>('/users/me', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
}

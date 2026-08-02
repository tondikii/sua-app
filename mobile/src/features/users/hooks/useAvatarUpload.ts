import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useAuth } from '@/auth/AuthProvider';
import type { UserProfile } from '@atur-perjalanan/shared-types';

interface PresignAvatarResponse {
  upload_url: string;
  storage_key: string;
  expires_in: number;
}

/**
 * Profile avatar upload following the trip-media presign flow:
 * POST /users/me/avatar/presign → PUT blob to R2 → PUT /users/me/avatar.
 * On success the AuthProvider user is refreshed so avatars update everywhere.
 */
export function useAvatarUpload() {
  const qc = useQueryClient();
  const { setUser } = useAuth();

  const presign = useMutation({
    mutationFn: (contentType: string) =>
      apiClient.post<PresignAvatarResponse>('/users/me/avatar/presign', { content_type: contentType }),
  });

  const register = useMutation({
    mutationFn: (storageKey: string) =>
      apiClient.put<UserProfile>('/users/me/avatar', { storage_key: storageKey }),
  });

  const uploadAvatar = async (file: Blob, contentType: string) => {
    const presignData = await presign.mutateAsync(contentType);
    const uploadResponse = await fetch(presignData.upload_url, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
    });
    if (!uploadResponse.ok) throw new Error('Upload to R2 failed');
    const profile = await register.mutateAsync(presignData.storage_key);
    setUser(profile);
    // Avatar URLs are embedded in many payloads (trips, members, polls,
    // search, invitations, notifications) — invalidate them all so the new
    // photo appears everywhere instead of stale cached data.
    qc.invalidateQueries({ queryKey: ['user'] });
    qc.invalidateQueries({ queryKey: ['trips'] });
    qc.invalidateQueries({ queryKey: ['members'] });
    qc.invalidateQueries({ queryKey: ['trip'] });
    qc.invalidateQueries({ queryKey: ['polls'] });
    qc.invalidateQueries({ queryKey: ['users', 'search'] });
    qc.invalidateQueries({ queryKey: ['invitations'] });
    qc.invalidateQueries({ queryKey: ['notifications'] });
    return profile;
  };

  return { presign, register, uploadAvatar };
}

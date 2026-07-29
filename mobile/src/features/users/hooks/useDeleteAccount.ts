import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useAuth } from '@/auth/AuthProvider';

export function useDeleteAccount() {
  const { signOut } = useAuth();

  return useMutation({
    mutationFn: () => apiClient.delete<undefined>('/users/me'),
    onSuccess: () => {
      signOut();
    },
  });
}

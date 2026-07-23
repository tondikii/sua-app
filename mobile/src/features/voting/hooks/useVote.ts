import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useVote(tripId: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['polls', tripId] });

  const vote = useMutation<void, Error, { pollId: string; optionId: string }>({
    mutationFn: ({ pollId, optionId }) =>
      apiClient.post<void>(`/trips/${tripId}/polls/${pollId}/vote`, { option_id: optionId }),
    onSuccess: invalidate,
  });

  const retractVote = useMutation<void, Error, string>({
    mutationFn: (pollId) => apiClient.delete<void>(`/trips/${tripId}/polls/${pollId}/vote`),
    onSuccess: invalidate,
  });

  const voteDateCandidate = useMutation<void, Error, string>({
    mutationFn: (candidateId) =>
      apiClient.post<void>(`/trips/${tripId}/candidates/${candidateId}/vote`),
    onSuccess: invalidate,
  });

  const retractDateVote = useMutation<void, Error, string>({
    mutationFn: (candidateId) =>
      apiClient.delete<void>(`/trips/${tripId}/candidates/${candidateId}/vote`),
    onSuccess: invalidate,
  });

  return { vote, retractVote, voteDateCandidate, retractDateVote };
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { PresignResponse } from '@atur-perjalanan/shared-types';
import type { TripDocumentItem } from './useDocuments';

interface PresignPayload {
  trip_id: string;
  media_type: 'photo' | 'video';
  content_type: string;
}

interface RegisterPayload {
  storage_key: string;
  media_type: 'photo' | 'video';
}

export function useUploadDocument(tripId: string) {
  const qc = useQueryClient();

  const presign = useMutation<PresignResponse, Error, PresignPayload>({
    mutationFn: (payload) => apiClient.post<PresignResponse>('/uploads/presign', payload),
  });

  const register = useMutation<TripDocumentItem, Error, RegisterPayload>({
    mutationFn: (payload) =>
      apiClient.post<TripDocumentItem>(`/trips/${tripId}/documents`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents', tripId] });
      qc.invalidateQueries({ queryKey: ['trip', tripId] });
    },
  });

  const uploadFile = async (file: Blob, mediaType: 'photo' | 'video', contentType: string) => {
    const presignData = await presign.mutateAsync({
      trip_id: tripId,
      media_type: mediaType,
      content_type: contentType,
    });

    const uploadResponse = await fetch(presignData.upload_url, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error('Upload to R2 failed');
    }

    const doc = await register.mutateAsync({
      storage_key: presignData.storage_key,
      media_type: mediaType,
    });

    return doc;
  };

  /**
   * Presign + PUT to R2 only — does NOT register a trip_documents row.
   * Used by the chat media flow, where the backend's `createMessage`
   * auto-inserts the `from_chat=true` document row (WORKFLOW §9 → §10).
   * Returns the R2 storage key to send as `media_url`.
   */
  const uploadChatMedia = async (
    file: Blob,
    mediaType: 'photo' | 'video',
    contentType: string,
  ): Promise<string> => {
    const presignData = await presign.mutateAsync({
      trip_id: tripId,
      media_type: mediaType,
      content_type: contentType,
    });

    const uploadResponse = await fetch(presignData.upload_url, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error('Upload to R2 failed');
    }

    return presignData.storage_key;
  };

  return { presign, register, uploadFile, uploadChatMedia };
}

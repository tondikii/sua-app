import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface TripDocumentItem {
  id: string;
  trip_id: string;
  uploaded_by: string;
  media_type: 'photo' | 'video';
  storage_key: string;
  url: string;
  url_expires_in: number;
  is_cover: boolean;
  from_chat: boolean;
  created_at: string;
}

interface DocumentsResponse {
  data: TripDocumentItem[];
}

export function useDocuments(tripId: string) {
  return useQuery<DocumentsResponse>({
    queryKey: ['documents', tripId],
    queryFn: () => apiClient.get<DocumentsResponse>(`/trips/${tripId}/documents`),
    staleTime: 30_000,
  });
}

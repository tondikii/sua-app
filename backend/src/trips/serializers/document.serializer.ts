import type { TripDocument } from '@atur-perjalanan/shared-types';

type DocumentRow = {
  id: string;
  tripId: string;
  uploadedBy: string;
  mediaType: string;
  storageKey: string;
  storageUrl: string;
  mediaDuration: unknown | null;
  fromChat: boolean;
  createdAt: Date;
};

function durationToSeconds(duration: unknown): number | null {
  if (!duration) return null;
  if (typeof duration === 'string') {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      const [h, m, s] = parts;
      return h * 3600 + m * 60 + s;
    }
  }
  return null;
}

export class DocumentSerializer {
  static toList(
    doc: DocumentRow,
    coverDocumentId: string | null,
    accessUrl?: string,
    urlExpiresIn?: number,
  ) {
    return {
      id: doc.id,
      trip_id: doc.tripId,
      uploaded_by: doc.uploadedBy,
      media_type: doc.mediaType,
      storage_key: doc.storageKey,
      url: accessUrl ?? doc.storageUrl,
      ...(urlExpiresIn ? { url_expires_in: urlExpiresIn } : {}),
      is_cover: doc.id === coverDocumentId,
      from_chat: doc.fromChat,
      media_duration_seconds: durationToSeconds(doc.mediaDuration),
      created_at: doc.createdAt.toISOString(),
    };
  }
}

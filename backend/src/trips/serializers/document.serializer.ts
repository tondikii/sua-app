import type { TripDocument } from '@atur-perjalanan/shared-types';

type DocumentRow = {
  id: string;
  tripId: string;
  uploadedBy: string;
  mediaType: string;
  storageKey: string;
  storageUrl: string;
  fromChat: boolean;
  createdAt: Date;
};

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
      created_at: doc.createdAt.toISOString(),
    };
  }
}

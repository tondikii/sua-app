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
    static toList(doc: DocumentRow, coverDocumentId: string | null) {
      return {
        id: doc.id,
        trip_id: doc.tripId,
        uploaded_by: doc.uploadedBy,
        media_type: doc.mediaType,
        storage_key: doc.storageKey,
        url: doc.storageUrl,
        is_cover: doc.id === coverDocumentId,
        from_chat: doc.fromChat,
        created_at: doc.createdAt.toISOString(),
      };
    }
  }
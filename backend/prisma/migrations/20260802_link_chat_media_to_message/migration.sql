-- AlterTable: link chat media documents to their originating message.
ALTER TABLE "trip_documents" ADD COLUMN "message_id" UUID;

-- Backfill: find the message whose media_url matches this document's storage
-- key, so existing from_chat media is linked and follows message deletion.
UPDATE "trip_documents" td
SET "message_id" = m."id"
FROM "trip_messages" m
WHERE td."from_chat" = true
  AND m."trip_id" = td."trip_id"
  AND m."media_url" IS NOT NULL
  AND td."storage_key" = SUBSTRING(m."media_url" FROM 'trips/[^/]+/[^/?]+');

-- Add FK with cascade so deleting a message removes its media documents.
ALTER TABLE "trip_documents"
  ADD CONSTRAINT "trip_documents_message_id_fkey"
  FOREIGN KEY ("message_id") REFERENCES "trip_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

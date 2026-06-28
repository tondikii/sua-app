DROP INDEX IF EXISTS idx_trip_messages_trip_active;
ALTER TABLE trip_messages DROP COLUMN IF EXISTS deleted_at;

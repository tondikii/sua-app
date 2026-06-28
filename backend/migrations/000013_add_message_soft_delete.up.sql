ALTER TABLE trip_messages
    ADD COLUMN deleted_at TIMESTAMPTZ;

DROP INDEX IF EXISTS idx_trip_messages_trip_created;
CREATE INDEX idx_trip_messages_trip_active
    ON trip_messages (trip_id, created_at DESC)
    WHERE deleted_at IS NULL;

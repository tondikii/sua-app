CREATE TABLE trip_messages (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id      UUID        NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    sender_id    UUID        NOT NULL REFERENCES users(id),
    message_text TEXT        NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Composite index serves the primary chat query:
-- "fetch N most recent messages for trip X ordered chronologically."
CREATE INDEX idx_trip_messages_trip_created ON trip_messages (trip_id, created_at DESC);

CREATE TABLE trip_participants (
    trip_id   UUID        NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id   UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (trip_id, user_id)
);

-- Optimise the primary Home tab query: "which trips does user X participate in?"
CREATE INDEX idx_trip_participants_user_id ON trip_participants (user_id);

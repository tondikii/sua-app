CREATE TYPE notification_type AS ENUM ('invite', 'follow', 'voting_deadline', 'destination_update');

CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        notification_type NOT NULL,
    actor_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    trip_id     UUID REFERENCES trips(id) ON DELETE CASCADE,
    payload     JSONB NOT NULL DEFAULT '{}',
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread
    ON notifications (user_id, created_at DESC)
    WHERE is_read = FALSE;

CREATE INDEX idx_notifications_user_all
    ON notifications (user_id, created_at DESC);

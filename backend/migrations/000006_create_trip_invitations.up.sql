CREATE TABLE trip_invitations (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id         UUID         NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    invited_by      UUID         NOT NULL REFERENCES users(id),
    invited_user_id UUID         REFERENCES users(id) ON DELETE CASCADE,
    invited_email   VARCHAR(320),
    method          VARCHAR(10)  NOT NULL
                        CONSTRAINT chk_invitations_method CHECK (method IN ('username', 'email')),
    status          VARCHAR(10)  NOT NULL DEFAULT 'pending'
                        CONSTRAINT chk_invitations_status CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    -- Enforce mutual exclusivity: username invites must have a user_id; email invites must not.
    CONSTRAINT chk_invitation_target CHECK (
        (method = 'username' AND invited_user_id IS NOT NULL AND invited_email IS NULL) OR
        (method = 'email'    AND invited_email   IS NOT NULL AND invited_user_id IS NULL)
    )
);

-- Fast lookup for the notification bell: pending invitations for a given user.
CREATE INDEX idx_trip_invitations_pending_user ON trip_invitations (invited_user_id)
    WHERE status = 'pending';
CREATE INDEX idx_trip_invitations_trip_id ON trip_invitations (trip_id);

CREATE TRIGGER trg_trip_invitations_updated_at
    BEFORE UPDATE ON trip_invitations
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

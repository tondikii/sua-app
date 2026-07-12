-- Add missing indices per ARCHITECTURE.md §3.3

-- Users - text search indices (pg_trgm)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_users_username_trgm ON users USING GIN (username gin_trgm_ops);
CREATE INDEX idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);

-- Trips - soft delete filter optimization
CREATE INDEX idx_trips_creator_id ON trips (creator_id) WHERE deleted_at IS NULL;

-- Trip participants - lookup by user
CREATE INDEX idx_trip_participants_user_id ON trip_participants (user_id);

-- Trip invitations - pending invitations lookup
CREATE INDEX idx_trip_invitations_invited_user ON trip_invitations (invited_user_id) WHERE status = 'pending';
CREATE INDEX idx_trip_invitations_trip_id ON trip_invitations (trip_id);

-- Trip date candidates - lookup by trip
CREATE INDEX idx_trip_date_candidates_trip_id ON trip_date_candidates (trip_id);

-- Trip date votes - lookup by user
CREATE INDEX idx_trip_date_votes_user_id ON trip_date_votes (user_id);

-- Trip polls - max 1 active poll per type per trip (unique partial index)
CREATE UNIQUE INDEX idx_trip_polls_one_active_per_type ON trip_polls (trip_id, poll_type) WHERE status = 'active';

-- Trip activities - timeline optimization
CREATE INDEX idx_trip_activities_trip_day ON trip_activities (trip_id, activity_date, start_time);

-- Trip messages - active messages only for chat query
CREATE INDEX idx_trip_messages_trip_active ON trip_messages (trip_id, created_at DESC) WHERE deleted_at IS NULL;

-- Trip documents - list by trip
CREATE INDEX idx_trip_documents_trip_id ON trip_documents (trip_id, created_at DESC);

-- Notifications - unread count optimization
CREATE INDEX idx_notifications_user_unread ON notifications (user_id, created_at DESC) WHERE is_read = FALSE;

-- Trip date candidates - constraint for valid date range
ALTER TABLE trip_date_candidates ADD CONSTRAINT valid_candidate_range CHECK (start_date <= end_date);

-- Trip activities - constraint for valid time range
ALTER TABLE trip_activities ADD CONSTRAINT valid_activity_time CHECK (start_time <= end_time);

-- Trip date invitations - constraint that ensures either username or email is set
ALTER TABLE trip_invitations ADD CONSTRAINT invitation_target_check CHECK (
    (method = 'username' AND invited_user_id IS NOT NULL) OR
    (method = 'email' AND invited_email IS NOT NULL)
);

-- Trips - constraint for valid date range
ALTER TABLE trips ADD CONSTRAINT valid_date_range CHECK (
    start_date IS NULL OR end_date IS NULL OR start_date <= end_date
);

-- Follows - no self-follow constraint
ALTER TABLE follows ADD CONSTRAINT no_self_follow CHECK (follower_id <> following_id);

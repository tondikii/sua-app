CREATE TABLE trip_date_votes (
    candidate_id UUID        NOT NULL REFERENCES trip_date_candidates(id) ON DELETE CASCADE,
    user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Composite PK enforces one vote per user per candidate.
    PRIMARY KEY (candidate_id, user_id)
);

-- Optimise: "which candidates has user X voted for?" (used to highlight voted options in UI).
CREATE INDEX idx_trip_date_votes_user_id ON trip_date_votes (user_id);

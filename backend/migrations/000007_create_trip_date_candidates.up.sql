CREATE TABLE trip_date_candidates (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id    UUID        NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    start_date DATE        NOT NULL,
    end_date   DATE        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_candidate_date_range CHECK (start_date <= end_date)
);

CREATE INDEX idx_trip_date_candidates_trip_id ON trip_date_candidates (trip_id);

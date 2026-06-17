CREATE TABLE trips (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id  UUID         NOT NULL REFERENCES users(id),
    name        VARCHAR(255) NOT NULL,
    tags        JSONB        NOT NULL DEFAULT '[]',
    status      VARCHAR(20)  NOT NULL DEFAULT 'voting_pending'
                    CONSTRAINT chk_trips_status CHECK (status IN ('voting_pending', 'fixed')),
    start_date  DATE,
    end_date    DATE,
    is_public   BOOLEAN      NOT NULL DEFAULT FALSE,
    deleted_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_trips_date_range CHECK (
        start_date IS NULL OR end_date IS NULL OR start_date <= end_date
    )
);

-- Partial indexes exclude soft-deleted rows from the working set.
CREATE INDEX idx_trips_creator_id ON trips (creator_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_trips_status     ON trips (status)     WHERE deleted_at IS NULL;

-- GIN index for tag-based filtering (JSONB @> operator).
CREATE INDEX idx_trips_tags ON trips USING GIN (tags);

CREATE TRIGGER trg_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

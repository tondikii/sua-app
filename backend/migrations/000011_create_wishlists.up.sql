CREATE TABLE wishlists (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    place_name     VARCHAR(255) NOT NULL,
    link           TEXT,
    tags           JSONB        NOT NULL DEFAULT '[]',
    priority_level VARCHAR(10)  NOT NULL DEFAULT 'medium'
                       CONSTRAINT chk_wishlists_priority CHECK (priority_level IN ('high', 'medium', 'low')),
    deleted_at     TIMESTAMPTZ,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Partial indexes exclude soft-deleted rows from all working-set queries.
CREATE INDEX idx_wishlists_user_active     ON wishlists (user_id)                 WHERE deleted_at IS NULL;
CREATE INDEX idx_wishlists_priority_active ON wishlists (user_id, priority_level) WHERE deleted_at IS NULL;

-- GIN index for tag-based filtering (JSONB @> operator).
CREATE INDEX idx_wishlists_tags ON wishlists USING GIN (tags);

CREATE TRIGGER trg_wishlists_updated_at
    BEFORE UPDATE ON wishlists
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

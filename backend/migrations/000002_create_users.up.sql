CREATE TABLE users (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id   VARCHAR(255) NOT NULL UNIQUE,
    email       VARCHAR(320) NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    avatar_url  TEXT,
    bio         TEXT,
    is_public   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Trigram indexes for ILIKE / similarity search on the Explore tab.
CREATE INDEX idx_users_username_trgm ON users USING GIN (username gin_trgm_ops);
CREATE INDEX idx_users_name_trgm     ON users USING GIN (name     gin_trgm_ops);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

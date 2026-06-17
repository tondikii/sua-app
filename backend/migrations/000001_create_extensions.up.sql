-- Required PostgreSQL extensions.
-- Must run before any table or trigger creation.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Reusable trigger function: automatically bumps updated_at on every UPDATE.
-- Applied to all tables that carry an updated_at column.
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

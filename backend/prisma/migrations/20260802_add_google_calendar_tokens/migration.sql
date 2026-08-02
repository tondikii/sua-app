-- Add Google Calendar OAuth token columns to users (M16).
-- Stored so the backend can create events in the user's own calendar.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS google_access_token TEXT,
  ADD COLUMN IF NOT EXISTS google_refresh_token TEXT,
  ADD COLUMN IF NOT EXISTS google_token_expires_at TIMESTAMPTZ;

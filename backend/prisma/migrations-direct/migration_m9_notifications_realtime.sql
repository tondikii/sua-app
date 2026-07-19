-- =============================================================================
-- M9 — Notifications Realtime enablement (Supabase-specific, MANUAL)
-- =============================================================================
-- Path : backend/prisma/migrations-direct/migration_m9_notifications_realtime.sql
-- Run  : ONCE per Supabase project — Supabase Dashboard → SQL Editor → paste → Run
--        (or: supabase db execute --file backend/prisma/migrations-direct/migration_m9_notifications_realtime.sql)
--
-- Do NOT place this file under backend/prisma/migrations/ — that folder is for
-- Prisma Migrate only. Do NOT run `prisma migrate` against this file.
--
-- Why this file exists (and Claude's full DDL does not):
--   The notifications table was already created by Prisma migrations (init + M4).
--   The ONLY things Prisma cannot express are Supabase Realtime publication + RLS.
--   See backend/M9_REALTIME_WIRING.md for complete integration instructions.
--
-- Prerequisites (already satisfied if you ran `prisma migrate deploy`):
--   - public.notifications table exists
--   - Backend creates notifications via NotificationsService
--   - Backend uses Supabase client with proper JWT auth
-- =============================================================================

-- Step 1: Create the publication if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

-- Step 2: Add notifications table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Step 3: Enable Row Level Security for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for notifications

-- Policy: Users can view their own notifications (for realtime subscriptions)
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Backend can insert notifications on behalf of users
DROP POLICY IF EXISTS "Backend can insert notifications" ON notifications;
CREATE POLICY "Backend can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own notifications (mark as read)
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  USING (user_id = auth.uid());

-- =============================================================================
-- Verification (run these SELECTs after the transaction succeeds)
-- =============================================================================
-- Expect 1 row:
--   SELECT pubname, schemaname, tablename
--   FROM pg_publication_tables
--   WHERE pubname = 'supabase_realtime' AND tablename = 'notifications';
--
-- Expect relrowsecurity = true:
--   SELECT relname, relrowsecurity
--   FROM pg_class
--   WHERE relname = 'notifications';
--
-- Expect 3 rows (SELECT, INSERT, UPDATE policies):
--   SELECT policyname, cmd, qual
--   FROM pg_policies
--   WHERE tablename = 'notifications';
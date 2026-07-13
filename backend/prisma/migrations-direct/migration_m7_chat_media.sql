-- =============================================================================
-- M7 — Chat Realtime enablement (Supabase-specific, MANUAL)
-- =============================================================================
-- Path : backend/prisma/migration_m7_chat_media.sql
-- Run  : ONCE per Supabase project — Supabase Dashboard → SQL Editor → paste → Run
--        (or: supabase db execute --file backend/prisma/migration_m7_chat_media.sql)
--
-- Do NOT place this file under backend/prisma/migrations/ — that folder is for
-- Prisma Migrate only. Do NOT run `prisma migrate` against this file.
--
-- Why this file exists (and Claude's full DDL does not):
--   trip_messages, trip_message_reads, trip_documents, cover_document_id, and
--   indexes were already created by Prisma migrations (init + M4). The ONLY
--   things Prisma cannot express are Supabase Realtime publication + RLS.
--   See docs/ARCHITECTURE.md §6 and docs/M7_WIRING_NOTES..md §7.
--
-- Prerequisites (already satisfied if you ran `prisma migrate deploy`):
--   - public.trip_messages
--   - public.trip_participants (trip_id, user_id)
--   - Backend mints realtime_token (RealtimeTokenService + SUPABASE_JWT_SECRET)
-- =============================================================================

BEGIN;

-- 1. Broadcast trip_messages INSERT/UPDATE/DELETE to Realtime WebSocket clients.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'trip_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_messages;
  END IF;
END $$;

-- 2. Row-level security (safe to re-run).
ALTER TABLE public.trip_messages ENABLE ROW LEVEL SECURITY;

-- 3. Participants-only SELECT. auth.uid() resolves from realtime_token JWT `sub`
--    (app user UUID minted by backend — NOT Supabase Auth users).
DROP POLICY IF EXISTS trip_messages_select_participants ON public.trip_messages;

CREATE POLICY trip_messages_select_participants ON public.trip_messages
  FOR SELECT
  USING (
    trip_id IN (
      SELECT trip_id
      FROM public.trip_participants
      WHERE user_id = auth.uid()
    )
  );

COMMIT;

-- =============================================================================
-- Verification (run these SELECTs after the transaction succeeds)
-- =============================================================================
-- Expect 1 row:
--   SELECT pubname, schemaname, tablename
--   FROM pg_publication_tables
--   WHERE pubname = 'supabase_realtime' AND tablename = 'trip_messages';
--
-- Expect relrowsecurity = true:
--   SELECT relname, relrowsecurity
--   FROM pg_class
--   WHERE relname = 'trip_messages';
--
-- Expect 1 row:
--   SELECT policyname, cmd, qual
--   FROM pg_policies
--   WHERE tablename = 'trip_messages';

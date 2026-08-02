-- Allow poll option candidate_id to store non-UUID identifiers (e.g. frontend-generated dp-* IDs).
-- Previously required a valid UUID referencing trip_date_candidates.id.
ALTER TABLE trip_poll_options
  DROP CONSTRAINT IF EXISTS trip_poll_options_candidate_id_fkey,
  ALTER COLUMN candidate_id TYPE TEXT USING candidate_id::TEXT;
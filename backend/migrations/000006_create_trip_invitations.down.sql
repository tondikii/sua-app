DROP TRIGGER IF EXISTS trg_trip_invitations_updated_at ON trip_invitations;
DROP INDEX  IF EXISTS idx_trip_invitations_trip_id;
DROP INDEX  IF EXISTS idx_trip_invitations_pending_user;
DROP TABLE  IF EXISTS trip_invitations;

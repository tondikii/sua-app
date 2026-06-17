DROP TRIGGER IF EXISTS trg_wishlists_updated_at ON wishlists;
DROP INDEX  IF EXISTS idx_wishlists_tags;
DROP INDEX  IF EXISTS idx_wishlists_priority_active;
DROP INDEX  IF EXISTS idx_wishlists_user_active;
DROP TABLE  IF EXISTS wishlists;

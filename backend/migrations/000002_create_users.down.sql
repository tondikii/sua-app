DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
DROP INDEX  IF EXISTS idx_users_name_trgm;
DROP INDEX  IF EXISTS idx_users_username_trgm;
DROP TABLE  IF EXISTS users;

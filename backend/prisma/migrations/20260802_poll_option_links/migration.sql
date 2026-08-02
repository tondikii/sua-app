-- Add maps_link + ref_links to trip_poll_options so voting options can carry
-- Google Maps links and reference links (same pattern as activities/wishlists).
ALTER TABLE trip_poll_options
  ADD COLUMN maps_link TEXT,
  ADD COLUMN ref_links JSONB NOT NULL DEFAULT '[]';

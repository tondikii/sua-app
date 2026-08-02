-- Add maps_link + ref_links to wishlists (WORKFLOW §12 / Figma Screen 108)
-- Keeps legacy `link` column intact for backward compatibility.

ALTER TABLE wishlists ADD COLUMN maps_link TEXT;
ALTER TABLE wishlists ADD COLUMN ref_links JSONB NOT NULL DEFAULT '[]';

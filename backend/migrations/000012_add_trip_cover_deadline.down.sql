ALTER TABLE trips
    DROP COLUMN IF EXISTS cover_image_url,
    DROP COLUMN IF EXISTS voting_deadline;

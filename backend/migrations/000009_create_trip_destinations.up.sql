CREATE TABLE trip_destinations (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id        UUID         NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    place_name     VARCHAR(255) NOT NULL,
    maps_link      TEXT,
    reference_link TEXT,
    sort_order     INTEGER      NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Composite index covers the primary query pattern: list destinations for a trip
-- ordered by sort_order.
CREATE INDEX idx_trip_destinations_trip_order ON trip_destinations (trip_id, sort_order);

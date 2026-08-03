-- Allow activities whose end_time is earlier in the day than start_time
-- (multi-day activities, e.g. Sat 13:00 -> Sun 12:00). The wall-clock time
-- columns only store HH:MM; the day offset is implied by the trip's date range.
ALTER TABLE trip_activities
  DROP CONSTRAINT IF EXISTS valid_activity_time;

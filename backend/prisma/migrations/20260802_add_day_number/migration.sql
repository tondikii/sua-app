-- AlterTable: Add day_number column with default 1
ALTER TABLE "trip_activities" ADD COLUMN "day_number" INTEGER NOT NULL DEFAULT 1;

-- Backfill: compute day_number from activity_date vs trip start_date
UPDATE "trip_activities" ta
SET "day_number" = COALESCE(
  (
    SELECT (ta."activity_date" - t."start_date")::int + 1
    FROM "trips" t
    WHERE t."id" = ta."trip_id"
      AND t."start_date" IS NOT NULL
      AND ta."activity_date" IS NOT NULL
  ),
  1
);

-- Ensure day_number >= 1
ALTER TABLE "trip_activities" ADD CONSTRAINT "trip_activities_day_number_check" CHECK ("day_number" >= 1);

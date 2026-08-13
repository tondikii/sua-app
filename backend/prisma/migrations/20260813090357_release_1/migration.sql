-- AlterTable
ALTER TABLE "trip_activities" ALTER COLUMN "start_time" SET DEFAULT '09:00'::time,
ALTER COLUMN "end_time" SET DEFAULT '10:00'::time;

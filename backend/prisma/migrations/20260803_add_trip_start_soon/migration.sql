-- Add trip_start_soon to the notification_type enum (trip start reminders).
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'trip_start_soon';

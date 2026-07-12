-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('voting_pending', 'fixed');

-- CreateEnum
CREATE TYPE "InvitationMethod" AS ENUM ('username', 'email');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('pending', 'accepted', 'declined', 'cancelled');

-- CreateEnum
CREATE TYPE "PollType" AS ENUM ('tanggal', 'aktivitas', 'lainnya');

-- CreateEnum
CREATE TYPE "PollStatus" AS ENUM ('active', 'locked', 'cancelled', 'expired');

-- CreateEnum
CREATE TYPE "ActivityKind" AS ENUM ('gather', 'transport', 'meal', 'activity', 'destination');

-- CreateEnum
CREATE TYPE "CoverSource" AS ENUM ('none', 'maps', 'trip_media', 'device', 'icon');

-- CreateEnum
CREATE TYPE "MessageKind" AS ENUM ('text', 'photo', 'video');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('photo', 'video');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('invite', 'follow', 'voting_deadline', 'activity_update');

-- CreateEnum
CREATE TYPE "PriorityLevel" AS ENUM ('high', 'medium', 'low');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "google_id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "avatar_url" TEXT,
    "bio" TEXT,
    "website_url" TEXT,
    "location_label" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "follower_id" UUID NOT NULL,
    "following_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("follower_id","following_id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" UUID NOT NULL,
    "creator_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "status" "TripStatus" NOT NULL DEFAULT 'voting_pending',
    "start_date" DATE,
    "end_date" DATE,
    "is_all_day" BOOLEAN NOT NULL DEFAULT true,
    "start_time" TIME,
    "end_time" TIME,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "cover_document_id" UUID,
    "voting_deadline" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_participants" (
    "trip_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_participants_pkey" PRIMARY KEY ("trip_id","user_id")
);

-- CreateTable
CREATE TABLE "trip_invitations" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "invited_by" UUID NOT NULL,
    "invited_user_id" UUID,
    "invited_email" VARCHAR(320),
    "method" "InvitationMethod" NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "trip_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_date_candidates" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_date_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_date_votes" (
    "candidate_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_date_votes_pkey" PRIMARY KEY ("candidate_id","user_id")
);

-- CreateTable
CREATE TABLE "trip_polls" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "poll_type" "PollType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "status" "PollStatus" NOT NULL DEFAULT 'active',
    "deadline" TIMESTAMPTZ,
    "locked_at" TIMESTAMPTZ,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_poll_options" (
    "id" UUID NOT NULL,
    "poll_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "candidate_id" UUID,

    CONSTRAINT "trip_poll_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_poll_votes" (
    "poll_id" UUID NOT NULL,
    "option_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_poll_votes_pkey" PRIMARY KEY ("poll_id","user_id")
);

-- CreateTable
CREATE TABLE "trip_activities" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "place_name" VARCHAR(255) NOT NULL,
    "activity_date" DATE,
    "start_time" TIME NOT NULL DEFAULT '09:00'::time,
    "end_time" TIME NOT NULL DEFAULT '10:00'::time,
    "kind" "ActivityKind" NOT NULL DEFAULT 'activity',
    "description" TEXT,
    "location_label" TEXT,
    "maps_link" TEXT,
    "ref_links" JSONB NOT NULL DEFAULT '[]',
    "cover_source" "CoverSource" NOT NULL DEFAULT 'none',
    "cover_icon" VARCHAR(50),
    "cover_document_id" UUID,
    "thumbnail_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "trip_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_messages" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "message_kind" "MessageKind" NOT NULL DEFAULT 'text',
    "message_text" TEXT,
    "media_url" TEXT,
    "media_duration" TEXT,
    "reply_to_id" UUID,
    "deleted_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_message_reads" (
    "trip_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "last_read_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_message_reads_pkey" PRIMARY KEY ("trip_id","user_id")
);

-- CreateTable
CREATE TABLE "trip_documents" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "uploaded_by" UUID NOT NULL,
    "media_type" "MediaType" NOT NULL,
    "storage_key" TEXT NOT NULL,
    "storage_url" TEXT NOT NULL,
    "from_chat" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "actor_id" UUID,
    "trip_id" UUID,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlists" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "place_name" VARCHAR(255) NOT NULL,
    "start_time" TIME,
    "end_time" TIME,
    "location_label" TEXT,
    "link" TEXT,
    "notes" TEXT,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "priority_level" "PriorityLevel" NOT NULL DEFAULT 'medium',
    "thumbnail_url" TEXT,
    "deleted_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_cover_document_id_fkey" FOREIGN KEY ("cover_document_id") REFERENCES "trip_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_participants" ADD CONSTRAINT "trip_participants_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_participants" ADD CONSTRAINT "trip_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_invitations" ADD CONSTRAINT "trip_invitations_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_invitations" ADD CONSTRAINT "trip_invitations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_invitations" ADD CONSTRAINT "trip_invitations_invited_user_id_fkey" FOREIGN KEY ("invited_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_date_candidates" ADD CONSTRAINT "trip_date_candidates_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_date_votes" ADD CONSTRAINT "trip_date_votes_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "trip_date_candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_date_votes" ADD CONSTRAINT "trip_date_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_polls" ADD CONSTRAINT "trip_polls_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_polls" ADD CONSTRAINT "trip_polls_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_poll_options" ADD CONSTRAINT "trip_poll_options_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "trip_polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_poll_options" ADD CONSTRAINT "trip_poll_options_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "trip_date_candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_poll_votes" ADD CONSTRAINT "trip_poll_votes_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "trip_polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_poll_votes" ADD CONSTRAINT "trip_poll_votes_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "trip_poll_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_poll_votes" ADD CONSTRAINT "trip_poll_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_activities" ADD CONSTRAINT "trip_activities_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_activities" ADD CONSTRAINT "trip_activities_cover_document_id_fkey" FOREIGN KEY ("cover_document_id") REFERENCES "trip_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_messages" ADD CONSTRAINT "trip_messages_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_messages" ADD CONSTRAINT "trip_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_messages" ADD CONSTRAINT "trip_messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "trip_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_message_reads" ADD CONSTRAINT "trip_message_reads_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_message_reads" ADD CONSTRAINT "trip_message_reads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_documents" ADD CONSTRAINT "trip_documents_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_documents" ADD CONSTRAINT "trip_documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

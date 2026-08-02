-- Add Expo push token registrations (push notification support).
CREATE TABLE "push_tokens" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "token" TEXT NOT NULL,
  "platform" VARCHAR(16) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "push_tokens_pkey" PRIMARY KEY ("id")
);

-- FK: deleting a user removes their push tokens.
ALTER TABLE "push_tokens" ADD CONSTRAINT "push_tokens_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- One registration per (user, device token).
CREATE UNIQUE INDEX "push_tokens_user_id_token_key" ON "push_tokens"("user_id", "token");
CREATE INDEX "push_tokens_user_id_idx" ON "push_tokens"("user_id");

import { z } from 'zod';

// ── Shared constants ───────────────────────────────────────

/** Matches a 24-hour wall-clock time, "HH:MM" (e.g. "09:00", "23:30"). */
const TIME_HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const PRIORITY_LEVELS = ['high', 'medium', 'low'] as const;

// ── Auth ─────────────────────────────────────────────────────

export const GoogleAuthSchema = z.object({
  id_token: z.string(),
});
export type GoogleAuthInput = z.infer<typeof GoogleAuthSchema>;

export const CompleteRegistrationSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});
export type CompleteRegistrationInput = z.infer<typeof CompleteRegistrationSchema>;

// ── Users ────────────────────────────────────────────────────

export const CheckUsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});
export type CheckUsernameInput = z.infer<typeof CheckUsernameSchema>;

export const SearchUsersSchema = z.object({
  q: z.string().min(1),
  cursor: z.string().optional(),
  limit: z.coerce.number().optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  bio: z.string().max(150).optional(),
  website_url: z.string().url().max(255).optional(),
  location_label: z.string().max(100).optional(),
  is_public: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .transform((v) => v === true || v === 'true')
    .optional(),
});
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const PresignAvatarSchema = z.object({
  content_type: z.string(),
});
export type PresignAvatarInput = z.infer<typeof PresignAvatarSchema>;

export const UpdateAvatarSchema = z.object({
  storage_key: z.string(),
});
export type UpdateAvatarInput = z.infer<typeof UpdateAvatarSchema>;

// ── Trips ────────────────────────────────────────────────────

const DateCandidateSchema = z.object({
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
});

export const CreateTripSchema = z.object({
  name: z.string().max(255),
  tags: z.array(z.string()).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  is_all_day: z.boolean().optional(),
  start_time: z.string().regex(TIME_HHMM, 'start_time must be in HH:MM format').optional(),
  end_time: z.string().regex(TIME_HHMM, 'end_time must be in HH:MM format').optional(),
  candidates: z.array(DateCandidateSchema).optional(),
  voting_deadline: z.string().datetime().optional(),
});
export type CreateTripInput = z.infer<typeof CreateTripSchema>;

export const UpdateTripSchema = z.object({
  name: z.string().max(255).optional(),
  tags: z.array(z.string()).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  is_all_day: z.boolean().optional(),
  start_time: z.string().regex(TIME_HHMM, 'start_time must be in HH:MM format').optional(),
  end_time: z.string().regex(TIME_HHMM, 'end_time must be in HH:MM format').optional(),
  is_public: z.boolean().optional(),
});
export type UpdateTripInput = z.infer<typeof UpdateTripSchema>;

const RefLinkSchema = z.object({
  url: z.string().url(),
  label: z.string().max(255).optional(),
});

const ActivityKindEnum = z.enum(['gather', 'transport', 'meal', 'activity', 'destination']);
const CoverSourceEnum = z.enum(['none', 'maps', 'trip_media', 'device', 'icon']);

export const CreateActivitySchema = z.object({
  place_name: z.string().max(255),
  activity_date: z.string().datetime().optional(),
  day_number: z.number().int().min(1).optional(),
  start_time: z.string().regex(TIME_HHMM),
  end_time: z.string().regex(TIME_HHMM),
  kind: ActivityKindEnum.optional(),
  description: z.string().optional(),
  location_label: z.string().optional(),
  maps_link: z.string().url().optional(),
  ref_links: z.array(RefLinkSchema).optional(),
  cover_source: CoverSourceEnum.optional(),
  cover_icon: z.string().optional(),
  cover_document_id: z.string().uuid().nullable().optional(),
  thumbnail_url: z.string().nullable().optional(),
  sort_order: z.number().optional(),
});
export type CreateActivityInput = z.infer<typeof CreateActivitySchema>;

export const UpdateActivitySchema = CreateActivitySchema.partial();
export type UpdateActivityInput = z.infer<typeof UpdateActivitySchema>;

export const CreateMessageSchema = z.object({
  message_kind: z.enum(['text', 'photo', 'video']),
  message_text: z.string().max(2000).optional(),
  media_url: z.string().optional(),
  media_duration_seconds: z.number().int().min(0).optional(),
  reply_to_id: z.string().uuid().optional(),
});
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;

export const CreateInvitationSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
});
export type CreateInvitationInput = z.infer<typeof CreateInvitationSchema>;

export const RespondInvitationSchema = z.object({
  accept: z.boolean(),
});

export const SetTripCoverSchema = z.object({
  document_id: z.string().uuid(),
});

export const PresignUploadSchema = z.object({
  trip_id: z.string().uuid(),
  media_type: z.enum(['photo', 'video']),
  content_type: z.string(),
});
export type PresignUploadInput = z.infer<typeof PresignUploadSchema>;

export const CreateDocumentSchema = z.object({
  storage_key: z.string(),
  media_type: z.enum(['photo', 'video']),
});
export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>;

// ── Voting ────────────────────────────────────────────────────

const PollRefLinkSchema = z.object({
  url: z.string().url('ref link url must be a valid URL'),
  label: z.string().max(255).optional(),
});

const PollOptionSchema = z.union([
  z.string(),
  z.object({
    label: z.string(),
    candidate_id: z.string().optional(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'start_date must be a date in YYYY-MM-DD format').optional(),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'end_date must be a date in YYYY-MM-DD format').optional(),
    maps_link: z.string().url('maps_link must be a valid URL').optional(),
    ref_links: z.array(PollRefLinkSchema).optional(),
    start_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'start_time must be in HH:MM format').optional(),
    end_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'end_time must be in HH:MM format').optional(),
  }),
]);

export const CreatePollSchema = z.object({
  title: z.string().max(255),
  poll_type: z.enum(['tanggal', 'aktivitas', 'lainnya']),
  options: z.array(PollOptionSchema).min(1).max(10),
  deadline: z.string().datetime().optional(),
});
export type CreatePollInput = z.infer<typeof CreatePollSchema>;

export const UpdatePollSchema = CreatePollSchema.partial().extend({
  options: z.array(PollOptionSchema).min(1).max(10).optional(),
});
export type UpdatePollInput = z.infer<typeof UpdatePollSchema>;

export const VoteSchema = z.object({
  option_id: z.string().uuid(),
});

export const VoteDateCandidateSchema = z.object({
  candidate_id: z.string().uuid(),
});

// ── Notifications ────────────────────────────────────────────

export const CreateNotificationSchema = z.object({
  userId: z.string(),
  type: z.enum(['invite', 'follow', 'voting_deadline', 'activity_update']),
  actorId: z.string().optional(),
  tripId: z.string().optional(),
  payload: z.record(z.unknown()).optional(),
});

export const MarkAsReadSchema = z.object({
  is_read: z.boolean().optional(),
});

export const RegisterPushTokenSchema = z.object({
  token: z.string().min(1),
  platform: z.enum(['ios', 'android']),
});
export type RegisterPushTokenInput = z.infer<typeof RegisterPushTokenSchema>;

// ── Wishlist ──────────────────────────────────────────────────

export const CreateWishlistSchema = z.object({
  place_name: z.string().max(255),
  start_time: z.string().regex(TIME_HHMM, 'start_time must be in HH:MM format').optional(),
  end_time: z.string().regex(TIME_HHMM, 'end_time must be in HH:MM format').optional(),
  location_label: z.string().optional(),
  maps_link: z.string().url('maps_link must be a valid URL').optional(),
  ref_links: z
    .array(
      z.object({
        url: z.string().url('ref link url must be a valid URL'),
        label: z.string().optional(),
      }),
    )
    .optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priority_level: z.enum(PRIORITY_LEVELS).optional(),
  thumbnail_url: z.string().optional(),
});
export type CreateWishlistInput = z.infer<typeof CreateWishlistSchema>;

export const UpdateWishlistSchema = CreateWishlistSchema.partial();
export type UpdateWishlistInput = z.infer<typeof UpdateWishlistSchema>;

export const ConvertToTripSchema = z.object({
  trip_name: z.string().max(255).optional(),
  tags: z.array(z.string()).optional(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  is_all_day: z.boolean().optional(),
  start_time: z.string().regex(TIME_HHMM, 'start_time must be in HH:MM format').optional(),
  end_time: z.string().regex(TIME_HHMM, 'end_time must be in HH:MM format').optional(),
});
export type ConvertToTripInput = z.infer<typeof ConvertToTripSchema>;

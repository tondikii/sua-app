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
  bio: z.string().max(150).optional(),
  website_url: z.string().url().max(255).optional(),
  location_label: z.string().max(100).optional(),
  is_public: z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .transform((v) => v === true || v === 'true')
    .optional(),
});
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

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
  label: z.string().max(255),
});

const ActivityKindEnum = z.enum(['gather', 'transport', 'meal', 'activity', 'destination']);
const CoverSourceEnum = z.enum(['none', 'maps', 'trip_media', 'device', 'icon']);

export const CreateActivitySchema = z.object({
  place_name: z.string().max(255),
  activity_date: z.string().datetime().optional(),
  start_time: z.string().regex(TIME_HHMM),
  end_time: z.string().regex(TIME_HHMM),
  kind: ActivityKindEnum.optional(),
  description: z.string().optional(),
  location_label: z.string().optional(),
  maps_link: z.string().url().optional(),
  ref_links: z.array(RefLinkSchema).optional(),
  cover_source: CoverSourceEnum.optional(),
  cover_icon: z.string().optional(),
  cover_document_id: z.string().uuid().optional(),
  thumbnail_url: z.string().optional(),
  sort_order: z.number().optional(),
});
export type CreateActivityInput = z.infer<typeof CreateActivitySchema>;

export const UpdateActivitySchema = CreateActivitySchema.partial();
export type UpdateActivityInput = z.infer<typeof UpdateActivitySchema>;

export const CreateMessageSchema = z.object({
  message_kind: z.enum(['text', 'photo', 'video']),
  message_text: z.string().max(2000).optional(),
  media_url: z.string().optional(),
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

export const CreateDocumentSchema = z.object({
  storage_key: z.string(),
  media_type: z.enum(['photo', 'video']),
});

// ── Voting ────────────────────────────────────────────────────

export const CreatePollSchema = z.object({
  title: z.string().max(255),
  poll_type: z.enum(['aktivitas', 'lainnya']),
  options: z.array(z.string()).min(2).max(10),
  deadline: z.string().datetime().optional(),
});

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

// ── Wishlist ──────────────────────────────────────────────────

export const CreateWishlistSchema = z.object({
  place_name: z.string().max(255),
  start_time: z.string().regex(TIME_HHMM, 'start_time must be in HH:MM format').optional(),
  end_time: z.string().regex(TIME_HHMM, 'end_time must be in HH:MM format').optional(),
  location_label: z.string().optional(),
  link: z.string().url('link must be a valid URL').optional(),
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
});

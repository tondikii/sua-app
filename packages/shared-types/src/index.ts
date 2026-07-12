// ────────────────────────────────────────────────────────────
//  @atur-perjalanan/shared-types
//  Shared TypeScript types consumed by both backend and mobile.
//  Keep this file free of runtime dependencies.
// ────────────────────────────────────────────────────────────

// ── Common ───────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

// ── User ─────────────────────────────────────────────────────

export interface UserSummary {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
}

export interface UserProfile extends UserSummary {
  bio: string | null;
  website_url: string | null;
  location_label: string | null;
  is_public: boolean;
  trip_count: number;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  realtime_token: string;
  is_new_user: boolean;
  user?: UserProfile;
}

// ── Trip ─────────────────────────────────────────────────────

export type TripStatus = 'voting_pending' | 'fixed';

export interface TripSummary {
  id: string;
  name: string;
  tags: string[];
  status: TripStatus;
  start_date: string | null;
  end_date: string | null;
  is_all_day: boolean;
  start_time: string | null;
  end_time: string | null;
  cover_image_url: string | null;
  voting_deadline: string | null;
  participant_count: number;
  participants_preview: UserSummary[];
}

export interface TripDetail extends TripSummary {
  creator: UserSummary;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface DateCandidate {
  id: string;
  start_date: string;
  end_date: string;
  vote_count: number;
  has_voted: boolean;
}

// ── Invitation ───────────────────────────────────────────────

export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export interface TripInvitation {
  id: string;
  trip: TripSummary;
  inviter: UserSummary;
  status: InvitationStatus;
  method: 'username' | 'email';
  invited_email: string | null;
  created_at: string;
}

// ── Activity / Itinerary ─────────────────────────────────────

export type ActivityKind = 'gather' | 'transport' | 'meal' | 'activity' | 'destination';
export type CoverSource = 'none' | 'maps' | 'trip_media' | 'device' | 'icon';

export interface RefLink {
  url: string;
  label: string;
}

export interface TripActivity {
  id: string;
  trip_id: string;
  place_name: string;
  activity_date: string | null;
  start_time: string;
  end_time: string;
  kind: ActivityKind;
  description: string | null;
  location_label: string | null;
  maps_link: string | null;
  ref_links: RefLink[];
  cover_source: CoverSource;
  cover_icon: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ── Voting / Poll ─────────────────────────────────────────────

export type PollType = 'tanggal' | 'aktivitas' | 'lainnya';
export type PollStatus = 'active' | 'locked' | 'cancelled' | 'expired';

export interface PollOption {
  id: string;
  label: string;
  sort_order: number;
  vote_count: number;
  has_voted: boolean;
  candidate_id: string | null;
}

export interface TripPoll {
  id: string;
  trip_id: string;
  poll_type: PollType;
  title: string;
  status: PollStatus;
  deadline: string | null;
  locked_at: string | null;
  created_by: UserSummary;
  options: PollOption[];
  created_at: string;
}

// ── Chat ─────────────────────────────────────────────────────

export type MessageKind = 'text' | 'photo' | 'video';

export interface TripMessage {
  id: string;
  trip_id: string;
  sender: UserSummary;
  message_kind: MessageKind;
  message_text: string | null;
  media_url: string | null;
  reply_to: TripMessage | null;
  is_deleted: boolean;
  created_at: string;
}

// ── Document / Media ─────────────────────────────────────────

export type MediaType = 'photo' | 'video';

export interface TripDocument {
  id: string;
  trip_id: string;
  uploaded_by: UserSummary;
  media_type: MediaType;
  storage_key: string;
  storage_url: string;
  from_chat: boolean;
  created_at: string;
}

export interface PresignResponse {
  upload_url: string;
  storage_key: string;
  expires_in: number;
}

// ── Notification ─────────────────────────────────────────────

export type NotificationType = 'invite' | 'follow' | 'voting_deadline' | 'activity_update';

export interface AppNotification {
  id: string;
  type: NotificationType;
  actor: UserSummary | null;
  trip: { id: string; name: string } | null;
  payload: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// ── Wishlist ─────────────────────────────────────────────────

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface WishlistItem {
  id: string;
  user_id: string;
  place_name: string;
  start_time: string | null;
  end_time: string | null;
  location_label: string | null;
  link: string | null;
  notes: string | null;
  tags: string[];
  priority_level: PriorityLevel;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

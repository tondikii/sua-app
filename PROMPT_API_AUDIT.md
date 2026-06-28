# API Audit & Implementation Plan — Atur Perjalanan M5.1

> **Status**: Audit selesai. Dokumen ini berisi temuan audit aktual dan implementation plan untuk M5.1.  
> **Referensi kode yang diaudit**: `backend/cmd/api/router.go`, `backend/internal/handler/*.go`, `backend/internal/domain/*.go`, `backend/migrations/*.sql`  
> **Figma baseline**: `figma/src/app/App.tsx` (32 layar), `docs/FIGMA.md § Kebutuhan API`

---

## Ringkasan Audit

| Kategori | Jumlah |
|----------|--------|
| ✅ Endpoint ada & cukup | 15 |
| ⚠️ Endpoint ada tapi response kurang lengkap | 10 |
| ❌ Endpoint hilang sama sekali | 8 |
| 🗄️ Schema DB yang perlu migration baru | 4 |

**Verdict**: Backend M1–M5 solid. Gap utama ada di enrichment response dan 4 domain baru (notifications, user trips, check-username, delete message).

---

## Bagian 1 — Temuan Audit Lengkap

### AUTH (§1–2)

| Endpoint | Status | Temuan |
|----------|--------|--------|
| `POST /v1/auth/google` | ✅ | Shape benar: `{ access_token, is_new_user, user? }` |
| `POST /v1/auth/complete-registration` | ✅ | Shape benar: `{ user }` |
| `GET /v1/users/check-username?username=` | ❌ MISSING | Diperlukan `Screen10Username` real-time validation |

**Catatan**: `POST /v1/auth/google` untuk new user hanya mengembalikan `access_token` + `is_new_user: true` tanpa `user` object — ini **disengaja** (user belum punya username), sudah benar.

---

### HOME — `GET /v1/trips` & `GET /v1/trips/invitations` (§3)

| Field/Feature | Status | Detail |
|---------------|--------|--------|
| Endpoint ada | ✅ | Route terdaftar, auth-gated |
| Cursor pagination | ✅ | UUID-based keyset |
| `?tab=upcoming\|completed` filter | ❌ MISSING | `Screen2Home` punya 3 tab; saat ini semua trip dikembalikan tanpa filter |
| `cover_image_url` di response | ❌ MISSING | Kolom belum ada di tabel `trips`; Figma `Screen2Home` butuh hero image |
| `participants_preview[]` di response | ❌ MISSING | Stacked avatars di trip card butuh preview 4–5 peserta |
| `participant_count` di response | ❌ MISSING | Figma: "X anggota" pada header trip detail |
| `GET /v1/trips/invitations` ada | ✅ | Shape: `[{ id, trip_id, invited_by, method, status, created_at }]` |
| Trip summary di invitation | ❌ MISSING | Figma `Screen2Home` tab Undangan butuh nama trip; saat ini hanya `trip_id` UUID |
| Inviter profile di invitation | ❌ MISSING | Figma butuh nama+avatar inviter; saat ini hanya `invited_by` UUID |

---

### USERS — Profile & Social (§4)

| Endpoint | Status | Temuan |
|----------|--------|--------|
| `GET /v1/users/me` | ⚠️ Partial | Ada, tapi `userDTO` kurang `followers_count`, `following_count`, `public_trip_count` |
| `PUT /v1/users/me` | ✅ | Shape benar: terima `{ bio, is_public }` |
| `GET /v1/users/search` | ⚠️ Partial | Ada, tapi: (1) tidak auth-gated → tidak bisa return `is_following`; (2) tidak ada `public_trip_count` per result |
| `GET /v1/users/:username` | ⚠️ Breaking needed | Ada, tapi **MASALAH PRIVASI**: private account saat ini tetap mengembalikan profil penuh ke siapa saja. Tidak ada `can_view_content` / `is_following` di response |
| `GET /v1/users/:username/trips` | ❌ MISSING | Endpoint tidak terdaftar di router sama sekali — dibutuhkan `Screen3Profile` grid trip |
| `POST /v1/users/:username/follow` | ✅ | Ada |
| `DELETE /v1/users/:username/follow` | ✅ | Ada |

**Detail masalah privasi `GET /v1/users/:username`**:  
Kode di `user_handler.go:84–89` mengembalikan `toUserDTO(u)` penuh untuk semua viewer. Seharusnya, jika akun privat dan viewer bukan follower: sembunyikan `bio`, kembalikan `can_view_content: false`.

---

### TRIPS — Create, Detail, Candidates (§5, §6, §8)

| Endpoint | Status | Temuan |
|----------|--------|--------|
| `POST /v1/trips` | ⚠️ Partial | Logika `fixed`/`voting_pending` benar ✅; tapi tidak ada `cover_image_url`, `voting_deadline` di response |
| `GET /v1/trips/:tripId` | ⚠️ Partial | Ada, tapi `tripResponse` kurang `participants_preview`, `participant_count`, `cover_image_url` |
| `PUT /v1/trips/:tripId` | ✅ | Ada, creator-only ✅ |
| `DELETE /v1/trips/:tripId` | ✅ | Soft delete ✅ |
| `GET /v1/trips/:tripId/destinations` | ✅ | Ada, returns list |
| `POST /v1/trips/:tripId/destinations` | ✅ | Ada |
| `DELETE /v1/trips/:tripId/destinations/:id` | ✅ | Ada |
| `GET /v1/trips/:tripId/destinations/:id` | ❌ MISSING | `Screen29DestinationDetail` sheet butuh detail endpoint atau enrich list response |
| `GET /v1/trips/:tripId/candidates` | ⚠️ Partial | Ada, tapi response adalah raw `domain.TripDateCandidate{}` (bukan DTO); kurang `voters_preview[]` dan `user_has_voted: bool` |
| `POST/DELETE .../candidates/:id/vote` | ✅ | Ada |
| `POST .../candidates/:id/lock` | ✅ | Ada, creator-only, returns 204 |

**Masalah kandidat response**: `GetTripDateCandidates` handler langsung serialize `[]*domain.TripDateCandidate{}` ke JSON — fields exposed termasuk internal types. Sebaiknya gunakan DTO yang proper.

---

### INVITATIONS (§7)

| Endpoint | Status | Temuan |
|----------|--------|--------|
| `POST /v1/trips/:tripId/invitations` | ✅ | Ada, accept `{ username }` atau `{ email }` |
| `PUT /v1/trips/:tripId/invitations/:id` | ⚠️ Partial | Ada, tapi body adalah `{ accept: bool }` — bukan `{ status: "accepted"\|"rejected" }` (minor inconsistency dari PROMPT_API_AUDIT.md, bisa diterima) |

---

### CHAT (§9)

| Endpoint | Status | Temuan |
|----------|--------|--------|
| `GET /v1/trips/:tripId/messages` | ⚠️ Partial | Ada, cursor-paginated ✅; tapi `messageResponse` punya `sender_id` (UUID string) bukan embedded `sender { id, name, username, avatar_url }` — mobile harus call user endpoint terpisah untuk setiap sender |
| `POST /v1/trips/:tripId/messages` | ✅ | Ada |
| `DELETE /v1/trips/:tripId/messages/:id` | ❌ MISSING | `Screen28ChatLongPress` → menu "Hapus". Tabel `trip_messages` tidak punya kolom `deleted_at` |

---

### WISHLIST (§10)

| Endpoint | Status | Temuan |
|----------|--------|--------|
| `GET /v1/wishlists` | ✅ | Ada, filter by tag/priority ✅, cursor ✅ |
| `POST /v1/wishlists` | ✅ | Ada |
| `PUT /v1/wishlists/:id` | ✅ | Ada, ownership check ✅ |
| `DELETE /v1/wishlists/:id` | ✅ | Soft delete ✅ |

---

### NOTIFICATIONS (§11)

| Endpoint | Status | Temuan |
|----------|--------|--------|
| `GET /v1/notifications` | ❌ MISSING | Tabel `notifications` **tidak ada** di migrations (000001–000011). Domain seluruhnya absent |
| `GET /v1/notifications/unread-count` | ❌ MISSING | — |
| `PUT /v1/notifications/:id/read` | ❌ MISSING | — |
| `PUT /v1/notifications/read-all` | ❌ MISSING | — |

---

### SETTINGS (§12)

| Feature | Status | Temuan |
|---------|--------|--------|
| Privacy toggle | ✅ | Via `PUT /v1/users/me { is_public }` |
| Logout | ✅ local-only | Tidak butuh backend endpoint (token discard di client) |
| Push notification preferences | ❌ post-MVP | Belum ada, tidak blocking M5.1 |

---

## Bagian 2 — Implementation Plan M5.1

Ordered by dependency (schema dulu, lalu domain, lalu enrich).

---

### Fase A — Database Migrations (4 migrations baru)

**Migration 000012**: Tambah kolom di `trips`

```sql
-- 000012_add_trip_cover_and_deadline.up.sql
ALTER TABLE trips
    ADD COLUMN cover_image_url  TEXT,
    ADD COLUMN voting_deadline  TIMESTAMPTZ;

-- Set voting_deadline retroactively for existing voting_pending trips (optional)
-- UPDATE trips SET voting_deadline = created_at + INTERVAL '7 days'
--   WHERE status = 'voting_pending' AND voting_deadline IS NULL;
```

**Migration 000013**: Soft-delete untuk `trip_messages`

```sql
-- 000013_add_message_soft_delete.up.sql
ALTER TABLE trip_messages ADD COLUMN deleted_at TIMESTAMPTZ;
CREATE INDEX idx_trip_messages_deleted ON trip_messages (trip_id, created_at DESC)
    WHERE deleted_at IS NULL;
-- (drop old index idx_trip_messages_trip_created and recreate with WHERE clause)
```

**Migration 000014**: Tabel `notifications`

```sql
-- 000014_create_notifications.up.sql
CREATE TABLE notifications (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type         VARCHAR(30) NOT NULL  -- 'invite', 'follow', 'voting_deadline', 'destination_update'
                     CONSTRAINT chk_notif_type CHECK (
                         type IN ('invite', 'follow', 'voting_deadline', 'destination_update')
                     ),
    actor_id     UUID        REFERENCES users(id) ON DELETE SET NULL,
    trip_id      UUID        REFERENCES trips(id) ON DELETE CASCADE,
    payload      JSONB       NOT NULL DEFAULT '{}',
    read         BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_unread
    ON notifications (user_id, created_at DESC)
    WHERE read = FALSE;

CREATE INDEX idx_notifications_user_all
    ON notifications (user_id, created_at DESC);
```

**Migration 000015**: Follow counts (view atau computed columns)

```sql
-- 000015_add_follow_count_helpers.up.sql
-- Convenience view untuk follow counts; dipakai di user queries
CREATE OR REPLACE VIEW user_follow_counts AS
SELECT
    u.id                                              AS user_id,
    COUNT(DISTINCT f_in.follower_id)                  AS followers_count,
    COUNT(DISTINCT f_out.following_id)                AS following_count
FROM users u
LEFT JOIN follows f_in  ON f_in.following_id = u.id
LEFT JOIN follows f_out ON f_out.follower_id  = u.id
GROUP BY u.id;
```

---

### Fase B — Domain Layer Updates

#### B1 — Update `domain/trip.go`

Tambah fields ke `Trip` struct:

```go
type Trip struct {
    // ... existing fields ...
    CoverImageURL *string    // M5.1
    VotingDeadline *time.Time // M5.1
}

// Tambah ke TripService interface:
// ListTripsByUser returns trips created by a user (for profile grid)
// role: "created" | "participated"
ListTripsByUser(ctx context.Context, ownerUsername string, viewerID *uuid.UUID, role string) ([]*Trip, error)
```

Tambah ke `TripDateCandidate` untuk voting enrichment:

```go
type TripDateCandidateWithVotes struct {
    TripDateCandidate
    VotersPreview []VoterPreview `json:"voters_preview"`
    UserHasVoted  bool           `json:"user_has_voted"`
}

type VoterPreview struct {
    ID        string  `json:"id"`
    Name      string  `json:"name"`
    AvatarURL *string `json:"avatar_url"`
}
```

#### B2 — Update `domain/user.go`

```go
// ProfileView adalah user profile yang disajikan ke viewer tertentu
type ProfileView struct {
    User
    FollowersCount  int  `json:"followers_count"`
    FollowingCount  int  `json:"following_count"`
    PublicTripCount int  `json:"public_trip_count"`
    IsFollowing     bool `json:"is_following"`
    CanViewContent  bool `json:"can_view_content"`
}

// Update UserService interface:
// GetProfileView menggantikan GetProfile — aware of viewer context
GetProfileView(ctx context.Context, username string, viewerID *uuid.UUID) (*ProfileView, error)
// CheckUsernameAvailable: true = available
CheckUsernameAvailable(ctx context.Context, username string) (bool, error)
```

Tambah ke `FollowRepository`:

```go
type FollowRepository interface {
    Create(ctx context.Context, followerID, followingID uuid.UUID) error
    Delete(ctx context.Context, followerID, followingID uuid.UUID) error
    IsFollowing(ctx context.Context, followerID, followingID uuid.UUID) (bool, error)   // NEW
    CountFollowers(ctx context.Context, userID uuid.UUID) (int, error)                  // NEW
    CountFollowing(ctx context.Context, userID uuid.UUID) (int, error)                  // NEW
}
```

#### B3 — Buat `domain/notification.go` (domain baru)

```go
package domain

type NotificationType string

const (
    NotifTypeInvite             NotificationType = "invite"
    NotifTypeFollow             NotificationType = "follow"
    NotifTypeVotingDeadline     NotificationType = "voting_deadline"
    NotifTypeDestinationUpdate  NotificationType = "destination_update"
)

type Notification struct {
    ID        uuid.UUID
    UserID    uuid.UUID
    Type      NotificationType
    ActorID   *uuid.UUID
    TripID    *uuid.UUID
    Payload   map[string]any
    Read      bool
    CreatedAt time.Time
}

type NotificationRepository interface {
    Create(ctx context.Context, n *Notification) error
    FindByUser(ctx context.Context, userID uuid.UUID, cursor *time.Time, limit int) ([]*Notification, error)
    CountUnread(ctx context.Context, userID uuid.UUID) (int, error)
    MarkRead(ctx context.Context, notificationID, userID uuid.UUID) error
    MarkAllRead(ctx context.Context, userID uuid.UUID) error
}

type NotificationService interface {
    List(ctx context.Context, userID uuid.UUID, cursor *time.Time, limit int) ([]*Notification, error)
    UnreadCount(ctx context.Context, userID uuid.UUID) (int, error)
    MarkRead(ctx context.Context, notificationID, userID uuid.UUID) error
    MarkAllRead(ctx context.Context, userID uuid.UUID) error
    // Notify* dipanggil dari service lain (TripService, UserService):
    NotifyInvite(ctx context.Context, inviteeID, inviterID, tripID uuid.UUID) error
    NotifyFollow(ctx context.Context, followedID, followerID uuid.UUID) error
    NotifyDestinationUpdate(ctx context.Context, tripID, actorID uuid.UUID, destName string) error
}
```

---

### Fase C — Repository Layer Updates

#### C1 — Update `repository/user_repo.go`

Tambah method:
```go
// GetProfileView: single query dengan COUNT followers/following dan public_trip_count
func (r *UserRepository) GetProfileView(ctx, username string, viewerID *uuid.UUID) (*domain.ProfileView, error)
// Query: JOIN users u + LEFT JOIN follows f_in + LEFT JOIN follows f_out +
//        CASE WHEN u.is_public OR (viewerID != nil AND is_following) THEN true END AS can_view_content
```

#### C2 — Update `repository/follow_repo.go`

```go
func (r *FollowRepository) IsFollowing(ctx, followerID, followingID uuid.UUID) (bool, error)
func (r *FollowRepository) CountFollowers(ctx, userID uuid.UUID) (int, error)
func (r *FollowRepository) CountFollowing(ctx, userID uuid.UUID) (int, error)
```

#### C3 — Update `repository/trip_repo.go`

```go
// ListByCreator: trips created by userID where is_public=true (or all if viewer is owner)
func (r *TripRepository) ListByCreator(ctx, creatorID uuid.UUID, publicOnly bool) ([]*domain.Trip, error)
```

#### C4 — Update `repository/trip_message_repo.go`

```go
// Tambah SoftDelete, dan pastikan FindByTrip exclude deleted_at IS NOT NULL
func (r *TripMessageRepository) SoftDelete(ctx, messageID, senderID uuid.UUID) error
// Update FindByTrip: WHERE deleted_at IS NULL
```

#### C5 — Update `repository/trip_date_candidate_repo.go`

```go
// FindByTripWithVotes: join dengan trip_date_votes untuk voter preview
func (r *TripDateCandidateRepository) FindByTripWithVotes(ctx, tripID, viewerID uuid.UUID) ([]*domain.TripDateCandidateWithVotes, error)
```

#### C6 — Buat `repository/notification_repo.go` (baru)

Implement `domain.NotificationRepository` interface.

---

### Fase D — Service Layer Updates

#### D1 — Update `service/user_service.go`

```go
// Tambah method:
func (s *UserService) CheckUsernameAvailable(ctx, username string) (bool, error)
func (s *UserService) GetProfileView(ctx, username string, viewerID *uuid.UUID) (*domain.ProfileView, error)
```

**Privacy enforcement di `GetProfileView`**:
1. Ambil user + follow counts
2. Jika `user.is_public == true` → `can_view_content = true`
3. Jika `user.is_public == false` && viewerID == user.ID → `can_view_content = true` (owner)
4. Jika `user.is_public == false` && `IsFollowing(viewerID, user.ID)` → `can_view_content = true`
5. Otherwise → `can_view_content = false` (sembunyikan bio, jangan return trips)

#### D2 — Update `service/trip_service.go`

```go
// Tambah:
func (s *TripService) ListTripsByUser(ctx, ownerUsername string, viewerID *uuid.UUID, role string) ([]*domain.Trip, error)
// + trigger NotifyDestinationUpdate setelah AddDestination berhasil
// + set voting_deadline pada CreateTrip jika candidates > 1
// + cover_image_url propagate dari input ke domain.Trip
```

#### D3 — Update `service/notification_service.go` (baru)

Implement `domain.NotificationService`. Dipanggil dari:
- `TripService.InviteParticipant` → `NotifyInvite`
- `TripService.AddDestination` → `NotifyDestinationUpdate`
- `UserService.Follow` → `NotifyFollow`

---

### Fase E — Handler Layer Updates

#### E1 — Update `handler/user_handler.go`

```go
// Tambah route: GET /v1/users/check-username
func (h *UserHandler) GetCheckUsername(c *gin.Context)
// response: { "available": bool, "username": string }

// Tambah route: GET /v1/users/:username/trips
func (h *UserHandler) GetUserTrips(c *gin.Context)
// response: []tripResponse (public trips only unless owner/follower)
// error: 403 PROFILE_PRIVATE jika private && not following

// Update GetProfile → gunakan GetProfileView
// response DTO baru: profileDTO yang include followers_count, following_count,
//                    can_view_content, is_following
// Jika can_view_content == false: sembunyikan bio field (return null)
```

Update `RegisterRoutes`:
```go
users.GET("/check-username", h.GetCheckUsername)        // sebelum /:username
users.GET("/:username/trips", h.GetUserTrips)
```

#### E2 — Update `handler/trip_handler.go`

```go
// Update tripResponse struct:
type tripResponse struct {
    // ... existing ...
    CoverImageURL      *string         `json:"cover_image_url"`
    VotingDeadline     *time.Time      `json:"voting_deadline"`
    ParticipantCount   int             `json:"participant_count"`
    ParticipantsPreview []participantPreview `json:"participants_preview"`
}

// Update GetTrips: tambah ?tab=upcoming|completed filter
// Update messageResponse: embed sender object
type messageResponse struct {
    // ... existing ...
    Sender senderDTO `json:"sender"`  // replace sender_id UUID
}

// Update candidatesResponse: gunakan TripDateCandidateWithVotes DTO
// Tambah DELETE /v1/trips/:tripId/messages/:messageId handler
func (h *TripHandler) DeleteTripMessage(c *gin.Context)
```

#### E3 — Buat `handler/notification_handler.go` (baru)

```go
type NotificationHandler struct { svc domain.NotificationService }

func (h *NotificationHandler) RegisterRoutes(r gin.IRouter, jwtSecret []byte) {
    notifs := r.Group("/notifications")
    notifs.Use(middleware.AuthRequired(jwtSecret))
    notifs.GET("/", h.GetNotifications)               // cursor-paginated
    notifs.GET("/unread-count", h.GetUnreadCount)     // { unread_count: int }
    notifs.PUT("/:id/read", h.PutMarkRead)            // mark single as read
    notifs.PUT("/read-all", h.PutMarkAllRead)         // mark all as read
}
```

#### E4 — Update `router.go`

```go
notifHandler := handler.NewNotificationHandler(notifSvc)
notifHandler.RegisterRoutes(v1, jwtSecret)
// tambah notifRepo + notifSvc di composition root
```

---

## Bagian 3 — Updated Response Schemas (Target M5.1)

### `userDTO` (updated)

```json
{
  "id": "uuid",
  "username": "string",
  "name": "string",
  "email": "string",              // only on /me
  "avatar_url": "string | null",
  "bio": "string | null",         // null jika can_view_content=false
  "is_public": true,
  "followers_count": 42,          // NEW
  "following_count": 17,          // NEW
  "public_trip_count": 5,         // NEW
  "is_following": false,          // NEW (viewer perspective)
  "can_view_content": true,       // NEW (false → hide bio+trips)
  "created_at": "RFC3339"
}
```

### `tripResponse` (updated)

```json
{
  "id": "uuid",
  "creator_id": "uuid",
  "name": "string",
  "tags": ["#Pantai"],
  "status": "voting_pending | fixed",
  "start_date": "date | null",
  "end_date": "date | null",
  "cover_image_url": "string | null",   // NEW
  "voting_deadline": "RFC3339 | null",  // NEW
  "participant_count": 4,               // NEW
  "participants_preview": [             // NEW (max 5)
    { "id": "uuid", "name": "Rafa", "avatar_url": "https://..." }
  ],
  "is_public": false,
  "created_at": "RFC3339",
  "updated_at": "RFC3339"
}
```

### `messageResponse` (updated)

```json
{
  "id": "uuid",
  "trip_id": "uuid",
  "sender": {                          // NEW — embedded sender (bukan sender_id)
    "id": "uuid",
    "name": "Budi",
    "username": "budi99",
    "avatar_url": "https://..."
  },
  "message_text": "string",
  "created_at": "RFC3339"
}
```

### `candidateResponse` (updated)

```json
{
  "id": "uuid",
  "trip_id": "uuid",
  "start_date": "date",
  "end_date": "date",
  "vote_count": 3,
  "user_has_voted": true,              // NEW
  "voters_preview": [                  // NEW (max 3)
    { "id": "uuid", "name": "Siti", "avatar_url": "https://..." }
  ],
  "created_at": "RFC3339"
}
```

### `invitationResponse` (updated)

```json
{
  "id": "uuid",
  "trip": {                            // NEW — embedded trip summary
    "id": "uuid",
    "name": "Lombok Weekend Escape",
    "cover_image_url": "https://..."
  },
  "inviter": {                         // NEW — embedded inviter summary
    "id": "uuid",
    "name": "Rafa",
    "username": "rafa_planner",
    "avatar_url": "https://..."
  },
  "method": "username",
  "status": "pending",
  "created_at": "RFC3339"
}
```

### `notificationResponse` (baru)

```json
{
  "id": "uuid",
  "type": "invite | follow | voting_deadline | destination_update",
  "actor": {                           // user yang melakukan aksi
    "id": "uuid",
    "name": "Siti",
    "username": "siti_travel",
    "avatar_url": "https://..."
  },
  "trip": {                            // null untuk type=follow
    "id": "uuid",
    "name": "Bali Cultural Retreat"
  },
  "payload": {},                       // type-specific extras
  "read": false,
  "created_at": "RFC3339"
}
```

---

## Bagian 4 — M5.1 Sprint Backlog (Urutan Pengerjaan)

### Sprint 1 — Schema (estimasi: ½ hari)
1. [ ] Migration 000012: `trips.cover_image_url`, `trips.voting_deadline`
2. [ ] Migration 000013: `trip_messages.deleted_at`
3. [ ] Migration 000014: tabel `notifications`
4. [ ] Migration 000015: view `user_follow_counts`
5. [ ] Update `domain/trip.go`: tambah field baru ke struct `Trip`

### Sprint 2 — Follow Counts & Privacy (estimasi: ½ hari)
6. [ ] Update `repository/follow_repo.go`: `IsFollowing`, `CountFollowers`, `CountFollowing`
7. [ ] Buat `domain.ProfileView` struct
8. [ ] Update `service/user_service.go`: `GetProfileView` dengan privacy logic
9. [ ] Update `handler/user_handler.go`: `GetProfile` → pakai `GetProfileView`, return `profileDTO`
   - Private account → `can_view_content=false` → `bio=null`
10. [ ] Tambah `GET /v1/users/check-username` (handler + service method `CheckUsernameAvailable`)
11. [ ] Update Search: auth-gate optional (JWT jika ada → populate `is_following`)

### Sprint 3 — User Trips + Trip Enrichment (estimasi: ½ hari)
12. [ ] `repository/trip_repo.go`: `ListByCreator(ownerID, publicOnly bool)`
13. [ ] `service/trip_service.go`: `ListTripsByUser` dengan privacy check
14. [ ] `handler/user_handler.go`: `GET /v1/users/:username/trips` handler
15. [ ] Update `tripResponse` struct: tambah `cover_image_url`, `voting_deadline`, `participant_count`, `participants_preview`
16. [ ] Update `GetTrips`: `?tab=upcoming|completed` filter via query param
17. [ ] Update `invitationResponse`: embed trip summary + inviter profile

### Sprint 4 — Chat Message Delete + Candidate Enrichment (estimasi: ½ hari)
18. [ ] `repository/trip_message_repo.go`: `SoftDelete`, update `FindByTrip` (WHERE deleted_at IS NULL)
19. [ ] Update `domain/trip.go`: `TripMessage` tambah `DeletedAt *time.Time`
20. [ ] `service/trip_service.go`: `DeleteMessage(ctx, messageID, senderID, tripID)` — ownership check
21. [ ] `handler/trip_handler.go`: `DELETE /v1/trips/:tripId/messages/:messageId`
22. [ ] Update `messageResponse`: embed `sender { id, name, username, avatar_url }` (JOIN query)
23. [ ] `repository/trip_date_candidate_repo.go`: `FindByTripWithVotes`
24. [ ] Update `GetTripDateCandidates`: gunakan `TripDateCandidateWithVotes` DTO

### Sprint 5 — Notifications Domain (estimasi: 1 hari)
25. [ ] Buat `domain/notification.go`
26. [ ] Buat `repository/notification_repo.go`
27. [ ] Buat `service/notification_service.go`
28. [ ] Buat `handler/notification_handler.go`: 4 routes
29. [ ] Update `router.go`: wire `NotificationHandler`
30. [ ] Integrate: `TripService.InviteParticipant` → `NotifyInvite`
31. [ ] Integrate: `TripService.AddDestination` → `NotifyDestinationUpdate`
32. [ ] Integrate: `UserService.Follow` → `NotifyFollow`

### Sprint 6 — Tests & Postman (estimasi: ½ hari)
33. [ ] Integration tests: privacy matrix (public account × private account × follower × stranger)
34. [ ] Unit tests: `NotificationService` (mock repo)
35. [ ] Unit tests: `CheckUsernameAvailable`
36. [ ] Postman folder `10 — Notifications & Gaps (M5.1)` dengan semua endpoint baru

---

## Bagian 5 — Checklist Verifikasi Final

Setelah M5.1 selesai, verifikasi:

- [ ] `GET /v1/users/check-username?username=johndoe` → `{ available: true }` / `{ available: false }`
- [ ] `GET /v1/users/:username` private account + non-follower → `can_view_content: false`, `bio: null`
- [ ] `GET /v1/users/:username` private account + follower → `can_view_content: true`, `bio: "..."`, `followers_count: N`
- [ ] `GET /v1/users/:username/trips` private + non-follower → `403 PROFILE_PRIVATE`
- [ ] `GET /v1/users/:username/trips` owner → semua trip
- [ ] `GET /v1/trips` tanpa `?tab` → semua trip; dengan `?tab=upcoming` → hanya mendatang
- [ ] `GET /v1/trips/:id` → response include `cover_image_url`, `participant_count`, `participants_preview`
- [ ] `GET /v1/trips/:id/candidates` → response include `user_has_voted`, `voters_preview`
- [ ] `GET /v1/trips/:id/messages` → setiap message punya `sender { name, avatar_url }` (bukan `sender_id`)
- [ ] `DELETE /v1/trips/:id/messages/:msgId` oleh sender → 204; oleh non-sender → 403
- [ ] `GET /v1/notifications` → list tipe invite/follow/voting/destination
- [ ] `GET /v1/notifications/unread-count` → `{ unread_count: N }`
- [ ] `PUT /v1/notifications/:id/read` → 204, notification.read = true
- [ ] Terima undangan → `GET /v1/notifications` berisi notif type=invite; follow back → type=follow
- [ ] Tambah destinasi → semua peserta trip dapat notif type=destination_update

---

## Bagian 6 — Ringkasan Gap Map (Figma Screen → API Gap)

| Screen | Fitur UI yang terlihat | Gap Backend |
|--------|------------------------|-------------|
| `Screen2Home` | Hero cover image di trip card | `trips.cover_image_url` kolom belum ada |
| `Screen2Home` | Tab Mendatang/Selesai/Undangan | `?tab` filter belum ada di `GET /v1/trips` |
| `Screen2Home` | Stacked avatars peserta di card | `participants_preview[]` belum di response |
| `Screen3Profile` | Grid trip di profil | `GET /v1/users/:username/trips` endpoint tidak ada |
| `Screen3Profile` | Followers/Following stats | `followers_count`, `following_count` belum di `userDTO` |
| `Screen6Voting` | "X orang sudah vote" + avatars | `voters_preview[]`, `user_has_voted` belum di candidate response |
| `Screen7Chat` | Nama + avatar per bubble | `sender` object belum embedded di `messageResponse` |
| `Screen10Username` | Real-time cek username tersedia | `GET /v1/users/check-username` tidak ada |
| `Screen11Notifikasi` | Semua tipe notifikasi | Seluruh domain notifikasi tidak ada |
| `Screen14BottomSheetUndang` | Nama trip + nama inviter di notif | `invitationResponse` belum embed trip/inviter |
| `Screen20PublicProfile` | Akun privat → tampilan terbatas | `GET /v1/users/:username` tidak enforce privasi |
| `Screen28ChatLongPress` | Menu "Hapus" untuk pesan sendiri | `DELETE .../messages/:id` tidak ada |
| `Screen29DestinationDetail` | Sheet detail destinasi | Belum ada GET detail endpoint, hanya list |
| `Screen31CalendarSyncModal` | Modal sukses lock tanggal | Backend sudah return 204 — modal trigger di FE |

---

*Dokumen ini dihasilkan dari audit aktual kode di `backend/` per 27 Juni 2026. Update setelah setiap sprint M5.1.*

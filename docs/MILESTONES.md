# Milestones — Atur Perjalanan

> **Tujuan dokumen ini**: 
> - Peta jalan pengembangan lengkap dari *setup* infrastruktur (M0) hingga rilis di Play Store (M15).
> - Setiap milestone dirancang agar dapat dikerjakan oleh AI agent secara mandiri cukup dengan prompt seperti **"Let's implement M7"** dan referensi dokumen ini.
> - Untuk product team: Tracking progress development, dependency map antar milestone, dan estimasi effort per tahap.

---

## 📊 Progress Overview

| # | Milestone | Status |
|---|-----------|--------|
| M0 | Foundation & Infrastructure | ✅ Selesai |
| M1 | Backend – Autentikasi | ✅ Selesai |
| M2 | Backend – Manajemen Trip | ✅ Selesai |
| M3 | Backend – Kolaborasi & Chat | ✅ Selesai |
| M4 | Backend – Profil & Wishlist | ✅ Selesai |
| M5 | Backend – Testing & Hardening | ✅ Selesai |
| M5.1 | Backend – API Gaps & Privacy (Figma) | ✅ Selesai |
| M6 | Mobile – KMP Shared Module | 🔲 Belum |
| M7 | Android – Auth & Onboarding | 🔲 Belum |
| M8 | Android – Home & Trip UI | 🔲 Belum |
| M9 | Android – Kolaborasi & Chat UI | 🔲 Belum |
| M10 | Android – Profil & Wishlist UI | 🔲 Belum |
| M11 | Google Calendar Integration | 🔲 Belum |
| M12 | Figma Design Alignment | 🔲 Belum |
| M13 | Mobile Testing Suite | 🔲 Belum |
| M14 | CI/CD Pipelines | 🔲 Belum |
| M15 | Play Store Release | 🔲 Belum |

---

## M0 — Foundation & Infrastructure ✅ SELESAI

**Tujuan**: Menyiapkan infrastruktur dasar monorepo.

**Referensi**: `docs/ARCHITECTURE.md §2`, `docker-compose.yml`, `Makefile`, `.env.example`

### Checklist
- [x] Struktur direktori monorepo sesuai `ARCHITECTURE.md §2`
- [x] `docker-compose.yml` menjalankan PostgreSQL 16-alpine dengan health check
- [x] `Makefile` menyediakan perintah: `up`, `down`, `migrate-up`, `migrate-down`, `build`, `run`, `test`, `test-integration`, `lint`
- [x] `.env.example` mendokumentasikan semua variabel yang dibutuhkan
- [x] 15 file migrasi SQL tersedia di `backend/migrations/` (000001–000015)
- [x] `backend/go.mod` dan `backend/go.sum` valid

---

## M1 — Backend: Autentikasi ✅ SELESAI

**Tujuan**: Alur autentikasi Google Sign-In → JWT app token.

**Referensi**: `docs/ARCHITECTURE.md §1.3, §4.4`, `docs/WORKFLOW.md §2`

### Checklist
- [x] `POST /v1/auth/google` — verifikasi Google ID Token, upsert `users`, kembalikan JWT
- [x] `POST /v1/auth/complete-registration` — simpan `username` pengguna baru (JWT required)
- [x] Auth middleware `internal/middleware/auth.go` memvalidasi JWT (HS256, secret dari env)
- [x] JWT payload hanya berisi `sub` (UUID) dan `exp`; token expiry 24 jam
- [x] `internal/platform/googleapi/auth.go` memverifikasi ID Token via Google
- [x] Pengguna baru → response `is_new_user: true`; pengguna lama → langsung ke app

---

## M2 — Backend: Manajemen Trip ✅ SELESAI

**Tujuan**: CRUD trip, manajemen aktivitas itinerary (`trip_destinations` di DB), pengundangan partisipan.

**Referensi**: `docs/ARCHITECTURE.md §4.3`, `docs/WORKFLOW.md §6–§7`, `docs/ACCEPTANCE_CRITERIA.md §5`

### Checklist
- [x] `GET /v1/trips` — list trip user (cursor-paginated)
- [x] `POST /v1/trips` — buat trip; 1 tanggal → `status=fixed`; >1 → `status=voting_pending` + `trip_date_candidates`
- [x] `GET /v1/trips/:tripId` — detail trip (creator & participant visibility)
- [x] `PUT /v1/trips/:tripId` — update info trip (creator only)
- [x] `DELETE /v1/trips/:tripId` — soft delete (`deleted_at`, creator only)
- [x] `POST /v1/trips/:tripId/invitations` — undang via username atau email
- [x] `PUT /v1/trips/:tripId/invitations/:id` — terima / tolak undangan
- [x] `GET /v1/trips/invitations` — list undangan pending milik user yang sedang login (tab "Undangan")
- [x] `GET /v1/trips/:tripId/destinations` — list aktivitas itinerary (UI: tab Itinerary)
- [x] `POST /v1/trips/:tripId/destinations` — tambah aktivitas
- [x] `DELETE /v1/trips/:tripId/destinations/:id` — hapus aktivitas
- [x] Semua query trips menyertakan `WHERE deleted_at IS NULL`
- [x] Pembuatan trip + kandidat tanggal dibungkus dalam satu transaksi pgx

---

## M3 — Backend: Kolaborasi & Chat ✅ SELESAI

**Tujuan**: Voting tanggal, penguncian tanggal, chat internal trip.

**Referensi**: `docs/ARCHITECTURE.md §4.3`, `docs/WORKFLOW.md §8, §9`, `docs/ACCEPTANCE_CRITERIA.md §4`

### Checklist
- [x] `GET /v1/trips/:tripId/candidates` — list kandidat tanggal + jumlah vote
- [x] `POST /v1/trips/:tripId/candidates/:id/vote` — berikan vote (participants only)
- [x] `DELETE /v1/trips/:tripId/candidates/:id/vote` — tarik vote
- [x] `POST /v1/trips/:tripId/candidates/:id/lock` — kunci tanggal (creator only): update `trips.start_date`, `trips.end_date`, set `status=fixed`
- [x] `GET /v1/trips/:tripId/messages` — list pesan (cursor-paginated, chronological)
- [x] `POST /v1/trips/:tripId/messages` — kirim pesan (participants only)
- [x] Penguncian tanggal dan update `trips` dibungkus dalam transaksi DB
- [x] Google Calendar sync hanya via menu ⋮ detail trip (M11 mengimplementasikan OAuth + create event)

---

## M4 — Backend: Profil & Wishlist ✅ SELESAI

**Tujuan**: Profil pengguna, pencarian user, manajemen wishlist.

**Referensi**: `docs/ARCHITECTURE.md §4.3`, `docs/WORKFLOW.md §4, §5, §12`, `docs/ACCEPTANCE_CRITERIA.md §3–§4`

### Checklist
- [x] `GET /v1/users/me` — profil user yang sedang login
- [x] `PUT /v1/users/me` — update bio
- [x] `GET /v1/users/search` — pencarian username/nama (pg_trgm, cursor-paginated)
- [x] `GET /v1/users/:username` — profil user lain
- [x] `GET /v1/wishlists` — list wishlist (filter by tag/priority, cursor-paginated)
- [x] `POST /v1/wishlists` — buat item wishlist baru
- [x] `PUT /v1/wishlists/:id` — update wishlist (ownership check)
- [x] `DELETE /v1/wishlists/:id` — soft delete wishlist
- [x] Route ordering: `/search` dan `/me` terdaftar sebelum `/:username`

---

## M5 — Backend: Testing & Hardening ✅ SELESAI

**Tujuan**: Middleware keamanan + test suite yang memvalidasi semua business logic.

**Referensi**: `docs/ARCHITECTURE.md §4.2, §4.6`, `docs/ACCEPTANCE_CRITERIA.md`

### Checklist
- [x] **Rate Limiter** — `internal/middleware/rate_limiter.go`: per-IP sliding-window, 120 req/min, **hanya dipasang di grup `/v1/`** (tidak termasuk `/health`)
- [x] **Request ID** — `internal/middleware/request_id.go`: inject/propagate `X-Request-ID` di setiap request
- [x] **Bug Fix** — `trip_repo.Update` sekarang menyertakan kolom `status` sehingga `LockDate` benar-benar menyimpan `status=fixed` ke DB
- [x] **Bug Fix** — `wishlist_repo.FindByID` sekarang menyertakan `AND deleted_at IS NULL`
- [x] **Cursor pagination** — `user_repo.SearchByQuery` mengimplementasikan keyset pagination via `id > cursor`
- [x] **Interface cleanup** — `TripRepository` hanya memiliki `ListByParticipant` (duplikat `FindByParticipant` dihapus dari interface)
- [x] **Constructor cleanup** — `NewTripService` tidak lagi menerima `TripParticipantRepository` atau `FollowRepository` yang tidak terpakai (SQL transaksi langsung menggunakan pool)
- [x] **Unit Tests – jwtutil** — `platform/jwtutil/jwtutil_test.go`: round-trip, wrong secret, tampered token, expired, invalid subject (coverage: 85%)
- [x] **Unit Tests – Middleware** — `middleware/auth_test.go`, `rate_limiter_test.go`, `request_id_test.go` (coverage: 88%)
- [x] **Unit Tests – User Service** — UpsertFromGoogle, CompleteRegistration, GetProfile, UpdateProfile, GetByID (coverage: >80%)
- [x] **Unit Tests – Trip Service** — GetTrip, UpdateTrip, DeleteTrip, CastVote/RetractVote, LockDate, InviteParticipant, AddDestination/RemoveDestination, SendMessage/GetMessages, ListPendingInvitations (coverage: ~55% unit-only; transactional methods covered by integration tests)
- [x] **Unit Tests – Wishlist Service** — Create (default priority), List (filter), Update, Delete (ownership) (coverage: >80%)
- [x] **Integration Tests scaffold** — `service/integration_test.go` (`//go:build integration`): CreateTrip fixed/voting, RespondToInvitation; dijalankan dengan `make test-integration`
- [x] `go build ./...` — kompilasi bersih tanpa error
- [x] `go test -race ./internal/...` — semua unit tests lulus dengan race detector

> **Catatan Coverage**: Unit test coverage `internal/service` = ~55%. Fungsi `CreateTrip` dan `RespondToInvitation` menggunakan `pgxpool.Pool` langsung (untuk transaksi DB) sehingga tidak dapat di-unit test tanpa DB nyata. Target 70% dicapai dengan menjalankan integration tests (`make test-integration`) yang memerlukan `TEST_DATABASE_URL`.

---

## M5.1 — Backend: API Gaps & Privacy (Figma Parity) ✅ SELESAI

**AI Prompt**: *"Let's implement M5.1. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §4.3.1`, `docs/FIGMA.md § Kebutuhan API`."*

**Tujuan**: Menutup gap audit Figma sebelum mobile M6–M10.

**Referensi**: `docs/FIGMA.md`, `docs/PRD.md §3`, `docs/ACCEPTANCE_CRITERIA.md §3`

### Checklist

**Schema & migrations**
- [x] `trips.cover_image_url TEXT NULL` + default resolver di service layer
- [x] `trips.voting_deadline TIMESTAMPTZ NULL` + set on create (voting trips) + clear on lock
- [x] `trip_messages.deleted_at TIMESTAMPTZ NULL` (soft delete)
- [x] Tabel `notifications` + event writers (invite, destination update, voting reminders)

**Endpoints baru**
- [x] `GET /v1/users/check-username?username=`
- [x] `GET /v1/users/:username/trips?role=created` (privacy-aware)
- [x] `GET /v1/notifications`, `GET /v1/notifications/unread-count`, `PUT .../read`, `PUT .../read-all`
- [x] `DELETE /v1/trips/:tripId/messages/:messageId`
- [x] `GET /v1/trips?tab=upcoming|completed`

**Perubahan perilaku**
- [x] `GET /v1/users/:username/trips` — trip dengan `trips.is_public=true`

**Response enrichments**
- [x] Profile: `public_trip_count`
- [x] Trip list/detail: `cover_image_url`, `participants_preview[]`, `participant_count`
- [x] Invitations list: `trip` + `inviter` summary objects
- [x] Messages: embedded `sender`; candidates: `voters_preview[]`, `user_has_voted`

**Background jobs**
- [x] Voting reminder cron: H-7d, H-1d, H-1h sebelum `voting_deadline` (participant belum vote, trip masih `voting_pending`)

**Tests & Postman**
- [x] Postman folder `10 — Notifications & Gaps (M5.1)`

> **Post-MVP (deferred)**: Sistem follow/follower, akun privat berbasis follower, notifikasi tipe `follow`, mutual follow saat terima undangan. Kode backend terkait follow masih ada di repo tetapi **bukan bagian MVP** — akan diaktifkan kembali saat fase sosial media.

---

## M5.2 — Backend: Design Parity (Schema & API) 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M5.2. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.0.1`, `§3.5`, `§4.3.2`, `docs/WORKFLOW.md`, `docs/FIGMA.md § Kebutuhan API`. Close all design gaps before mobile M6."*

**Tujuan**: Menyelaraskan **database + endpoint** dengan **125 layar Figma** (`docs/WORKFLOW.md`). M5.1 menutup gap dasar; M5.2 menutup gap fitur penuh (itinerary enriched, media, polls, wishlist convert, kelola trip).

**Prasyarat**: M5.1 ✅

**Referensi desain**: `figma/src/app/components/trip/ActivityParts.tsx`, `WishlistParts.tsx`, `VotingParts.tsx`, `ChatParts.tsx`, `DocumentParts.tsx`

### Checklist Schema (migrasi 000016+)

- [ ] `trips`: +`is_all_day`, `start_time`, `end_time` (§6)
- [ ] `trip_destinations`: enrich aktivitas — times, kind, description, ref_links JSONB, cover_*, thumbnail (§7)
- [ ] `wishlists`: +`start_time`, `end_time`, `location_label`, `notes`, `thumbnail_url` (§12)
- [ ] `trip_documents` + `trips.cover_document_id` (§10)
- [ ] `trip_polls` + `trip_poll_options` + `trip_poll_votes` (§8 Aktivitas/Lainnya)
- [ ] `trip_messages`: +`message_kind`, `media_url`, `reply_to_id` (§9)
- [ ] `trip_message_reads` — unread badge chat (§9)
- [ ] `users`: +`website_url`, `location_label` (§5 edit profil)

### Checklist Endpoints

**P0 — blocking mobile M8–M10**
- [ ] `PUT /v1/trips/:tripId/destinations/:id` — edit aktivitas
- [ ] `GET /v1/trips/:tripId/members` — anggota + pending invites
- [ ] `DELETE /v1/trips/:tripId/invitations/:id` — batalkan undangan
- [ ] `POST /v1/wishlists/:id/convert-to-trip` — atomic konversi

**P1 — media & account**
- [ ] `POST/GET/DELETE /v1/trips/:tripId/documents` + `PUT …/cover`
- [ ] `POST /v1/trips/:tripId/messages` multipart (foto/video)
- [ ] `PUT /v1/trips/:tripId/messages/read`
- [ ] `DELETE /v1/users/me`

**P2 — voting & kelola**
- [ ] CRUD `/v1/trips/:tripId/polls` + vote + lock/end/delete
- [ ] `DELETE /v1/trips/:tripId/members/:userId`

**Integrasi**
- [ ] Google Places/Static API — resolve `thumbnail_url` dari `maps_link` (aktivitas)
- [ ] Object storage adapter untuk media upload (S3/GCS/local dev)

### Tests & Postman
- [ ] Integration tests per flow WORKFLOW §6–§12
- [ ] Postman folder `11 — Design Parity (M5.2)`

---

## M6 — Mobile: KMP Shared Module 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M6. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §5`. Implement the complete KMP shared module."*

**Referensi**: `docs/ARCHITECTURE.md §5`

**Prasyarat**: M0–M5 selesai; **M5.2 wajib** sebelum M6 agar DTO mobile mencakup field desain penuh (itinerary, media, polls, wishlist convert).

### Scope Pekerjaan
```
mobile/shared/src/commonMain/kotlin/com/aturperjalanan/
├── Config.kt
├── data/
│   ├── remote/
│   │   ├── ApiClient.kt           (Ktor HttpClient config)
│   │   ├── AuthApiService.kt
│   │   ├── TripApiService.kt
│   │   ├── UserApiService.kt
│   │   ├── WishlistApiService.kt
│   │   └── dto/                   (Kotlinx.Serialization DTOs)
│   ├── local/
│   │   └── AppDatabase.sq         (SQLDelight schema)
│   └── repository/
│       ├── AuthRepositoryImpl.kt
│       ├── TripRepositoryImpl.kt
│       ├── UserRepositoryImpl.kt
│       └── WishlistRepositoryImpl.kt
├── domain/
│   ├── model/                     (Trip.kt, User.kt, Wishlist.kt)
│   ├── repository/                (interface definitions)
│   └── usecase/                   (GetTripsUseCase, LockTripDateUseCase, dll.)
└── presentation/viewmodel/
    ├── BaseViewModel.kt
    ├── AuthViewModel.kt
    ├── TripListViewModel.kt
    ├── TripDetailViewModel.kt
    ├── UserProfileViewModel.kt
    └── WishlistViewModel.kt
```

### Checklist
- [ ] Semua API services (Ktor DSL) lengkap, returns `Result<T>`
- [ ] DTOs sesuai format JSON response backend
- [ ] SQLDelight schema untuk trips, users, wishlists (offline cache)
- [ ] Repository impls: cache-then-network untuk list; network-first untuk messages
- [ ] Token disimpan di platform-specific secure storage (**bukan** SQLDelight)
- [ ] Koin DI module `di/SharedModule.kt` mendaftarkan semua dependencies
- [ ] `build.gradle.kts` dikonfigurasi (Ktor, Serialization, SQLDelight, Koin)
- [ ] `./gradlew :shared:compileKotlinMetadata` sukses tanpa error

---

## M7 — Android: Auth & Onboarding 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M7. Read `docs/MILESTONES.md`, `docs/WORKFLOW.md §1, §2, §13`, `docs/ACCEPTANCE_CRITERIA.md §1`, `docs/FIGMA.md`. Build the Android Auth & Onboarding screens."*

**Referensi Figma**: `Screen1Splash`, `Screen2EduOnboarding`, `Screen3Auth`, `Screen4Username` (`figma/src/app/components/screens/`)

### Checklist
- [ ] `ui/theme/` — Color.kt, Typography.kt, Theme.kt (tokens dari `figma/src/app/components/colors.ts`)
- [ ] `SplashScreen` — logo coral + loading (`Screen1Splash`)
- [ ] `OnboardingScreen` — carousel **4 slide** (intro + 3 masalah/solusi); hanya saat first install (`Screen2EduOnboarding`)
- [ ] `SignInScreen` — logo + tombol "Lanjutkan dengan Google" (`Screen3Auth`)
- [ ] `UsernameSetupScreen` — validasi real-time, error duplikat (`Screen4Username`)
- [ ] Navigasi: Splash → (pertama) Onboarding → SignIn → (baru) UsernameSetup → Home; lama → SignIn → Home
- [ ] `./gradlew :androidApp:assembleDebug` sukses

---

## M8 — Android: Home & Trip UI 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M8. Read `docs/MILESTONES.md`, `docs/WORKFLOW.md §3, §6–§11, §13`, `docs/ACCEPTANCE_CRITERIA.md §2, §5`, `docs/FIGMA.md`. Build the Android Home and Trip screens."*

**Referensi Figma**: `Screen5Home`, `Screen22Create`, `Screen43Destinations`, `Screen45BottomSheetDestinasi`, `Screen6EmptyBeranda`, `Screen33FormValidation`, `Screen51DestinationDetail`, `Screen31MultiDatePicker`, `Screen9Notifikasi`, `Screen118SkeletonLoading`, `Screen119ToastComponents`, `Screen120Error`

### Checklist
- [ ] Bottom Navigation Bar — Beranda, Cari, [+], Wishlist, Profil (`BottomNav.tsx`)
- [ ] `HomeScreen` — lonceng notifikasi (badge) + tabs Mendatang/Selesai/Undangan
- [ ] `TripCard` — cover image, judul, tags, tanggal, stacked avatars
- [ ] `CreateTripSheet` — modal full-screen: nama, tags, kalender, tambah kandidat tanggal
- [ ] `TripDetailScreen` — tab **Itinerary · Voting · Chat · Media**
- [ ] `MediaScreen` — unggah foto/video, set cover dari media (`Screen93TripDocuments`)
- [ ] `ItineraryTab` + `ActivityCard` + `AddActivitySheet` + `ActivityDetailSheet`
- [ ] `NotificationScreen` — tipe invite / voting (multi-tipe) / aktivitas
- [ ] Empty, skeleton, toast, error states
- [ ] `./gradlew :androidApp:assembleDebug` sukses

---

## M9 — Android: Kolaborasi & Chat UI 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M9. Read `docs/MILESTONES.md`, `docs/WORKFLOW.md §8–§9, §11`, `docs/ACCEPTANCE_CRITERIA.md §6`, `docs/FIGMA.md`. Build the Android Collaboration and Chat screens."*

**Referensi Figma**: `Screen56Voting`, `Screen64CreateVoting`, `Screen76Chat`, `Screen35BottomSheetUndang`, `Screen86EmptyChat`, `Screen73StatusLocked`, `Screen87ChatLongPress`, `Screen88ChatLongPressOwn`, `Screen89`–`Screen92`, `Screen96CalendarSyncModal`

### Checklist
- [ ] `InviteSheet` — cari username atau input email (perlakuan sama)
- [ ] Tab Voting — **multi-poll hub** + sheet buat voting (`Screen64CreateVoting`)
- [ ] `VotingLockedModal` — konfirmasi voting selesai setelah lock (`Screen73StatusLocked`)
- [ ] `CalendarEventModal` — tambah ke Google Calendar via menu ⋮, kalender sendiri saja (`Screen96CalendarSyncModal`)
- [ ] `ChatScreen` — bubbles + input + empty state
- [ ] Long-press menu: Balas, Salin; Hapus hanya pesan sendiri (`Screen87`, `Screen88`)
- [ ] Reply quote di bubble — 4 skenario (`Screen89`–`Screen92`)
- [ ] Tombol "Kunci Tanggal Ini" hanya untuk creator
- [ ] `./gradlew :androidApp:assembleDebug` sukses

---

## M10 — Android: Profil & Wishlist UI 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M10. Read `docs/MILESTONES.md`, `docs/WORKFLOW.md §4, §5, §12`, `docs/ACCEPTANCE_CRITERIA.md §3–§4, §7`, `docs/FIGMA.md`. Build the Android Profile and Wishlist screens."*

**Referensi Figma**: `Screen15Profile`, `Screen105Wishlist`, `Screen104`–`Screen117`, `Screen11SearchUser`, `Screen108BottomSheetWishlist`, `Screen18EditProfil`, `Screen13PublicProfile`, `Screen17Settings`

### Checklist
- [ ] `ExploreScreen` — search bar + list (Avatar, Username, tap → profil)
- [ ] `ProfileScreen` — foto, username, bio, jumlah perjalanan, grid trip
- [ ] `PublicProfileScreen` — profil user lain (view-only)
- [ ] `EditProfileScreen` — bio + link sosial media
- [ ] `SettingsScreen` — akun, dukungan, logout
- [ ] `WishlistScreen` — grid-only + filter/sort prioritas & tag + search
- [ ] `AddWishlistSheet` — FAB "+" + form aktivitas (Mulai/Selesai, Nama, Prioritas, Maps, Link)
- [ ] Wishlist detail, edit, menu ⋮, hapus
- [ ] **Jadikan Perjalanan** flow — prefill trip → buat → undang → konversi ke itinerary
- [ ] Empty states: wishlist kosong (`Screen104`), filter kosong (`Screen106`)
- [ ] `./gradlew :androidApp:assembleDebug` sukses

---

## M11 — Google Calendar Integration 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M11. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §1.1, §3.4`, `docs/ACCEPTANCE_CRITERIA.md §5`. Implement calendar event creation after date lock (user-confirmed)."*

**Referensi**: `docs/ARCHITECTURE.md §1.1, §3.4`, `docs/ACCEPTANCE_CRITERIA.md §4`

### Scope Pekerjaan
```
backend/internal/platform/googleapi/
└── calendar.go    (BARU — Google Calendar API v3 client)

backend/internal/service/
└── trip_service.go  (UPDATE — panggil calendar sync setelah lock date commit)
```

### Checklist
- [ ] `calendar.go` — create calendar event for trip (all-day or timed per `trips.is_all_day`)
- [ ] Event creation triggered **only after user confirms** post-lock modal — not on invite
- [ ] Same event treatment for username invitees (Google account) and email-only invitees
- [ ] Lock date poll enqueues calendar job **after DB commit** (goroutine / queue)
- [ ] Error dari calendar provider di-log; tidak menggagalkan operasi DB
- [ ] `GOOGLE_CALENDAR_SA_KEY` terdokumentasi di `.env.example`

---

## M12 — Figma Design Alignment 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M12. Read `docs/MILESTONES.md`, `docs/FIGMA.md`. Run `figma/` preview locally, audit all 125 screens against Android Compose, create gap report, fix misalignments."*

**Referensi**: `docs/FIGMA.md`, `figma/src/app/`, `mobile/androidApp/src/main/com/aturperjalanan/android/ui/`

### Checklist
- [ ] Semua **125 layar** diaudit (`figma/src/app/App.tsx` workflow sections §1–§13)
- [ ] Color palette match `figma/src/app/components/colors.ts` → `Color.kt`
- [ ] Typography: Plus Jakarta Sans, scale H1–Caption
- [ ] Trip detail tabs = Itinerary · Voting · Chat · Media (counter; Chat unread only; Media always shows count)
- [ ] Bottom nav labels & FAB match `BottomNav.tsx`
- [ ] System states: empty, skeleton, toast, error, validation, dark mode
- [ ] Tidak ada magic number spacing/color

---

## M13 — Mobile Testing Suite 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M13. Read `docs/MILESTONES.md`, `docs/ACCEPTANCE_CRITERIA.md`, `mobile/shared/`. Implement unit tests for all shared ViewModels and UI tests for Android."*

**Referensi**: `docs/ACCEPTANCE_CRITERIA.md`, `mobile/shared/`

### Checklist
- [ ] Unit tests: AuthViewModel, TripListViewModel, TripDetailViewModel, WishlistViewModel
- [ ] Repository tests: cache-then-network strategy, error fallback
- [ ] Android Compose UI tests: Onboarding, Home, Create Trip, Wishlist
- [ ] `./gradlew :shared:allTests` lulus

---

## M14 — CI/CD Pipelines 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M14. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §2`. Create GitHub Actions CI/CD pipelines."*

**Referensi**: `docs/ARCHITECTURE.md §2` (`.github/workflows/`)

### Checklist
- [ ] `backend-ci.yml` — trigger pada push/PR ke `backend/**`: lint + test + build; PostgreSQL service container untuk integration tests
- [ ] `mobile-ci.yml` — trigger pada push/PR ke `mobile/**`: compile shared + unit tests + assembleDebug
- [ ] Secrets dikonfigurasi di GitHub repo settings (tidak hardcoded)
- [ ] CI badge ditambahkan di `README.md`

---

## M15 — Play Store Release 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M15. Read `docs/MILESTONES.md`. Create release build configuration and Play Store deployment pipeline."*

### Checklist
- [ ] `buildTypes { release { minifyEnabled = true } }` di `build.gradle.kts`
- [ ] Keystore dikonfigurasi via GitHub Secret (tidak di-commit)
- [ ] `android-release.yml` — trigger pada Git tag `v*.*.*`: build AAB + sign + upload ke Play Store Internal Testing
- [ ] App dibuat di Google Play Console (content rating, privacy policy, store listing)
- [ ] AAB terunggah ke Internal Testing track tanpa error

---

## 📋 Panduan untuk AI Agent

### Template Prompt

```
Let's implement [M-NUMBER].

Context: docs/MILESTONES.md, docs/ARCHITECTURE.md, docs/ACCEPTANCE_CRITERIA.md
[tambahan sesuai milestone]

Implement each checklist item in order.
Mark items complete (- [x]) as you finish them.
Do not deviate from the patterns in docs/ARCHITECTURE.md.
```

### Aturan

1. **Urutan milestone dipatuhi** — Jangan lewati milestone yang belum selesai.
2. **Architecture compliance** — Semua kode mengikuti `docs/ARCHITECTURE.md`. Penyimpangan harus dijustifikasi.
3. **Definition of Done** — Milestone selesai hanya jika **semua** checklist item ter-centang.
4. **Update status** — Perbarui tabel Progress Overview setelah milestone selesai.

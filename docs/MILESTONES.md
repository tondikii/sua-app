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
| M10 | Android – Sosial & Wishlist UI | 🔲 Belum |
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
- [x] 11 file migrasi SQL tersedia di `backend/migrations/`
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

**Tujuan**: CRUD trip, manajemen destinasi, pengundangan partisipan.

**Referensi**: `docs/ARCHITECTURE.md §4.3`, `docs/WORKFLOW.md §5, §6, §7`, `docs/ACCEPTANCE_CRITERIA.md §3`

### Checklist
- [x] `GET /v1/trips` — list trip user (cursor-paginated)
- [x] `POST /v1/trips` — buat trip; 1 tanggal → `status=fixed`; >1 → `status=voting_pending` + `trip_date_candidates`
- [x] `GET /v1/trips/:tripId` — detail trip (creator & participant visibility)
- [x] `PUT /v1/trips/:tripId` — update info trip (creator only)
- [x] `DELETE /v1/trips/:tripId` — soft delete (`deleted_at`, creator only)
- [x] `POST /v1/trips/:tripId/invitations` — undang via username atau email
- [x] `PUT /v1/trips/:tripId/invitations/:id` — terima / tolak undangan
- [x] `GET /v1/trips/invitations` — list undangan pending milik user yang sedang login (tab "Undangan")
- [x] `GET /v1/trips/:tripId/destinations` — list destinasi
- [x] `POST /v1/trips/:tripId/destinations` — tambah destinasi
- [x] `DELETE /v1/trips/:tripId/destinations/:id` — hapus destinasi
- [x] Semua query trips menyertakan `WHERE deleted_at IS NULL`
- [x] Pembuatan trip + kandidat tanggal dibungkus dalam satu transaksi pgx

---

## M3 — Backend: Kolaborasi & Chat ✅ SELESAI

**Tujuan**: Voting tanggal, penguncian tanggal, chat internal trip, dan mutual follow saat menerima undangan.

**Referensi**: `docs/ARCHITECTURE.md §4.3`, `docs/WORKFLOW.md §8, §9`, `docs/ACCEPTANCE_CRITERIA.md §4`

### Checklist
- [x] `GET /v1/trips/:tripId/candidates` — list kandidat tanggal + jumlah vote
- [x] `POST /v1/trips/:tripId/candidates/:id/vote` — berikan vote (participants only)
- [x] `DELETE /v1/trips/:tripId/candidates/:id/vote` — tarik vote
- [x] `POST /v1/trips/:tripId/candidates/:id/lock` — kunci tanggal (creator only): update `trips.start_date`, `trips.end_date`, set `status=fixed`
- [x] `GET /v1/trips/:tripId/messages` — list pesan (cursor-paginated, chronological)
- [x] `POST /v1/trips/:tripId/messages` — kirim pesan (participants only)
- [x] Menerima undangan via username **otomatis membuat mutual follow** di tabel `follows` (dalam transaksi yang sama dengan `trip_participants`)
- [x] Penguncian tanggal dan update `trips` dibungkus dalam transaksi DB
- [x] Google Calendar sync dipanggil **setelah** commit DB (M11 mengimplementasikan service-nya)

---

## M4 — Backend: Profil & Wishlist ✅ SELESAI

**Tujuan**: Profil pengguna, sistem follow, pencarian user, manajemen wishlist.

**Referensi**: `docs/ARCHITECTURE.md §4.3`, `docs/WORKFLOW.md §4, §10`, `docs/ACCEPTANCE_CRITERIA.md §2, §5`

### Checklist
- [x] `GET /v1/users/me` — profil user yang sedang login
- [x] `PUT /v1/users/me` — update bio dan `is_public`
- [x] `GET /v1/users/search` — pencarian username/nama (pg_trgm, cursor-paginated)
- [x] `GET /v1/users/:username` — profil user lain (M5: 404 jika privat; **M5.1**: limited profile Instagram-style)
- [x] `POST /v1/users/:username/follow` — follow user (blok self-follow)
- [x] `DELETE /v1/users/:username/follow` — unfollow
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
- [x] **Unit Tests – User Service** — UpsertFromGoogle, CompleteRegistration, GetProfile visibility, Follow/Unfollow, UpdateProfile, GetByID (coverage: >80%)
- [x] **Unit Tests – Trip Service** — GetTrip, UpdateTrip, DeleteTrip, CastVote/RetractVote, LockDate, InviteParticipant, AddDestination/RemoveDestination, SendMessage/GetMessages, ListPendingInvitations (coverage: ~55% unit-only; transactional methods covered by integration tests)
- [x] **Unit Tests – Wishlist Service** — Create (default priority), List (filter), Update, Delete (ownership) (coverage: >80%)
- [x] **Integration Tests scaffold** — `service/integration_test.go` (`//go:build integration`): CreateTrip fixed/voting, RespondToInvitation mutual follow; dijalankan dengan `make test-integration`
- [x] `go build ./...` — kompilasi bersih tanpa error
- [x] `go test -race ./internal/...` — semua unit tests lulus dengan race detector

> **Catatan Coverage**: Unit test coverage `internal/service` = ~55%. Fungsi `CreateTrip` dan `RespondToInvitation` menggunakan `pgxpool.Pool` langsung (untuk transaksi DB) sehingga tidak dapat di-unit test tanpa DB nyata. Target 70% dicapai dengan menjalankan integration tests (`make test-integration`) yang memerlukan `TEST_DATABASE_URL`.

---

## M5.1 — Backend: API Gaps & Privacy (Figma Parity) ✅ SELESAI

**AI Prompt**: *"Let's implement M5.1. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §4.3.1`, `docs/FIGMA.md § Kebutuhan API`."*

**Tujuan**: Menutup gap audit Figma + model privasi Instagram-style sebelum mobile M6–M10.

**Referensi**: `docs/FIGMA.md`, `docs/PRD.md §3`, `docs/ACCEPTANCE_CRITERIA.md §3`

### Checklist

**Schema & migrations**
- [x] `trips.cover_image_url TEXT NULL` + default resolver di service layer
- [x] `trips.voting_deadline TIMESTAMPTZ NULL` + set on create (voting trips) + clear on lock
- [x] `trip_messages.deleted_at TIMESTAMPTZ NULL` (soft delete)
- [x] Tabel `notifications` + event writers (invite, follow, destination update, voting reminders)

**Endpoints baru**
- [x] `GET /v1/users/check-username?username=`
- [x] `GET /v1/users/:username/trips?role=created` (privacy-aware)
- [x] `GET /v1/notifications`, `GET /v1/notifications/unread-count`, `PUT .../read`, `PUT .../read-all`
- [x] `DELETE /v1/trips/:tripId/messages/:messageId`
- [x] `GET /v1/trips?tab=upcoming|completed`

**Perubahan perilaku (breaking)**
- [x] `GET /v1/users/:username` — akun privat mengembalikan **limited profile** (bukan 404) + `can_view_content`, `is_following`
- [x] `GET /v1/users/:username/trips` — `403 PROFILE_PRIVATE` jika privat & bukan follower

**Response enrichments**
- [x] Profile: `followers_count`, `following_count`, `public_trip_count`, `can_view_content`, `is_following`
- [x] Trip list/detail: `cover_image_url`, `participants_preview[]`, `participant_count`
- [x] Invitations list: `trip` + `inviter` summary objects
- [x] Messages: embedded `sender`; candidates: `voters_preview[]`, `user_has_voted`
- [ ] Search results: `is_following`, `public_trip_count` *(deferred to M6 — requires viewerID thread-through in search)*

**Background jobs**
- [x] Voting reminder cron: H-7d, H-1d, H-1h sebelum `voting_deadline` (participant belum vote, trip masih `voting_pending`)

**Tests & Postman**
- [x] Integration tests: privacy matrix (public/private × follower/stranger)
- [x] Postman folder `10 — Notifications & Gaps (M5.1)`

---

## M6 — Mobile: KMP Shared Module 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M6. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §5`. Implement the complete KMP shared module."*

**Referensi**: `docs/ARCHITECTURE.md §5`

**Prasyarat**: M0–M5 selesai; **M5.1 direkomendasikan** sebelum M6 agar DTO mobile sudah mencakup enriched responses & privasi profil.

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
- [ ] `OnboardingScreen` — carousel 3 slide; hanya saat first install (DataStore flag) (`Screen2EduOnboarding`)
- [ ] `SignInScreen` — logo + tombol "Lanjutkan dengan Google" (`Screen3Auth`)
- [ ] `UsernameSetupScreen` — validasi real-time, error duplikat (`Screen4Username`)
- [ ] Navigasi: Splash → (pertama) Onboarding → SignIn → (baru) UsernameSetup → Home; lama → SignIn → Home
- [ ] `./gradlew :androidApp:assembleDebug` sukses

---

## M8 — Android: Home & Trip UI 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M8. Read `docs/MILESTONES.md`, `docs/WORKFLOW.md §3, §5, §6, §11, §13`, `docs/ACCEPTANCE_CRITERIA.md §2, §4`, `docs/FIGMA.md`. Build the Android Home and Trip screens."*

**Referensi Figma**: `Screen5Home`, `Screen12Create`, `Screen15Destinations`, `Screen18BottomSheetDestinasi`, `Screen6EmptyBeranda`, `Screen14FormValidation`, `Screen19DestinationDetail`, `Screen13MultiDatePicker`, `Screen27Notifikasi`, `Screen28SkeletonLoading`, `Screen29ToastComponents`, `Screen30Error`

### Checklist
- [ ] Bottom Navigation Bar — Beranda, Cari, [+], Wishlist, Profil (`BottomNav.tsx`)
- [ ] `HomeScreen` — lonceng notifikasi (badge) + tabs Mendatang/Selesai/Undangan
- [ ] `TripCard` — cover image, judul, tags, tanggal, stacked avatars
- [ ] `CreateTripSheet` — modal full-screen: nama, tags, kalender, tambah kandidat tanggal
- [ ] `TripDetailScreen` — tab **Destinasi · Voting · Chat** (bukan Info)
- [ ] `DestinationCard` + `AddDestinationSheet` + `DestinationDetailSheet`
- [ ] `NotificationScreen` — tipe invite/follow/voting/update
- [ ] Empty, skeleton, toast, error states
- [ ] `./gradlew :androidApp:assembleDebug` sukses

---

## M9 — Android: Kolaborasi & Chat UI 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M9. Read `docs/MILESTONES.md`, `docs/WORKFLOW.md §7, §8, §9`, `docs/ACCEPTANCE_CRITERIA.md §5`, `docs/FIGMA.md`. Build the Android Collaboration and Chat screens."*

**Referensi Figma**: `Screen16Voting`, `Screen17Chat`, `Screen20BottomSheetUndang`, `Screen23EmptyChat`, `Screen21StatusLocked`, `Screen24ChatLongPress`, `Screen22CalendarSyncModal`

### Checklist
- [ ] `InviteSheet` — cari username atau input email
- [ ] Tab Voting — card kandidat + vote count + tombol Vote
- [ ] `VotingLockedState` — banner teal saat `status=fixed` (`Screen21StatusLocked`)
- [ ] `CalendarSyncModal` — modal sukses setelah lock tanggal
- [ ] `ChatScreen` — bubbles + input + empty state
- [ ] Long-press menu: Balas, Salin, Hapus (`Screen24ChatLongPress`)
- [ ] Tombol "Kunci Tanggal Ini" hanya untuk creator
- [ ] `./gradlew :androidApp:assembleDebug` sukses

---

## M10 — Android: Sosial & Wishlist UI 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M10. Read `docs/MILESTONES.md`, `docs/WORKFLOW.md §4, §10, §12`, `docs/ACCEPTANCE_CRITERIA.md §3, §6`, `docs/FIGMA.md`. Build the Android Social and Wishlist screens."*

**Referensi Figma**: `Screen8Profile`, `Screen25Wishlist`, `Screen7SearchUser`, `Screen26BottomSheetWishlist`, `Screen9EditProfil`, `Screen10PublicProfile`, `Screen11Settings`

### Checklist
- [ ] `ExploreScreen` — search bar + list (Avatar, Username, Follow button)
- [ ] `ProfileScreen` — foto, username, bio, followers/following, grid trip
- [ ] `PublicProfileScreen` — profil user lain + follow
- [ ] `EditProfileScreen` — bio + toggle `is_public`
- [ ] `SettingsScreen` — akun, dukungan, logout
- [ ] `WishlistScreen` — grid/list + filter/sort
- [ ] `AddWishlistSheet` — FAB "+" + form
- [ ] Empty State Wishlist
- [ ] `./gradlew :androidApp:assembleDebug` sukses

---

## M11 — Google Calendar Integration 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M11. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §1.1, §3.4`, `docs/ACCEPTANCE_CRITERIA.md §4`. Implement Google Calendar sync."*

**Referensi**: `docs/ARCHITECTURE.md §1.1, §3.4`, `docs/ACCEPTANCE_CRITERIA.md §4`

### Scope Pekerjaan
```
backend/internal/platform/googleapi/
└── calendar.go    (BARU — Google Calendar API v3 client)

backend/internal/service/
└── trip_service.go  (UPDATE — panggil calendar sync setelah lock date commit)
```

### Checklist
- [ ] `calendar.go` — autentikasi via Service Account, `CreateEvent()`, `UpdateEvent()`
- [ ] Lock date memanggil calendar sync **di goroutine setelah DB commit** (tidak blok HTTP response)
- [ ] Undangan via email memicu Google Calendar event invite
- [ ] Error dari Google Calendar di-log tapi tidak menggagalkan operasi DB
- [ ] `GOOGLE_CALENDAR_SA_KEY` terdokumentasi di `.env.example`

---

## M12 — Figma Design Alignment 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M12. Read `docs/MILESTONES.md`, `docs/FIGMA.md`. Run `figma/` preview locally, audit all 32 screens against Android Compose, create gap report, fix misalignments."*

**Referensi**: `docs/FIGMA.md`, `figma/src/app/`, `mobile/androidApp/src/main/com/aturperjalanan/android/ui/`

### Checklist
- [ ] Semua 32 layar diaudit (Row 1–4 di `figma/src/app/App.tsx`)
- [ ] Color palette match `figma/src/app/components/colors.ts` → `Color.kt`
- [ ] Typography: Plus Jakarta Sans, scale H1–Caption
- [ ] Trip detail tabs = Destinasi · Voting · Chat
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

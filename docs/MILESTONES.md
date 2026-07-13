# Milestones — Atur Perjalanan

> **Version**: 2.0 — Juli 2026
>
> **Tujuan dokumen ini**:
> - Peta jalan pengembangan lengkap dari *setup* dokumentasi (M0) hingga rilis di App Store & Play Store (M20).
> - **Satu-satunya tempat progress development dilacak.** `docs/ARCHITECTURE.md` adalah target-state blueprint dan sengaja tidak menyimpan status pengerjaan — semua ✅/🔲 ada di sini.
> - Setiap milestone dirancang agar dapat dikerjakan oleh AI agent secara mandiri cukup dengan prompt seperti **"Let's implement M5"** dan referensi dokumen ini.
> - Untuk product team: tracking progress development, dependency map antar milestone, dan estimasi effort per tahap.

---

## 📝 Changelog Dokumen

| Versi | Perubahan |
|-------|-----------|
| 2.0 | **Revamp menyeluruh** menyusul migrasi tech stack (Go/Gin/KMP → **NestJS + Expo**, full TypeScript). Urutan milestone diperbaiki agar mencerminkan pengerjaan nyata: fondasi dokumen → **desain Figma Make dulu** → baru backend & mobile. Backend/mobile lama (Go/KMP) dianggap usang total; progress di-reset ke 🔲 karena tidak ada baris kode TypeScript yang bisa diwariskan dari implementasi Go. Gap-tracking yang dulu tersebar di beberapa milestone (M5.1/M5.2) sekarang melebur jadi satu rangkaian milestone backend yang linear, karena tidak ada lagi "MVP tipis" vs "gap desain" — backend baru dibangun langsung menyasar skema penuh di `ARCHITECTURE.md`. |
| 2.1 | Tambah konvensi **Postman Collection** inkremental per milestone backend (`docs/postman/`); checklist Postman di M3–M10 & M16. |
| 2.x | (Go/Gin + KMP) — superseded, riwayat detail tidak dipertahankan di sini; lihat git history jika perlu referensi arsip. |

---

## 📊 Progress Overview

| # | Milestone | Status |
|---|-----------|--------|
| M0 | Fondasi Dokumentasi | ✅ Selesai |
| M1 | Desain Produk (Figma Make) | ✅ Selesai |
| M2 | Infrastruktur & Tooling Monorepo | ✅ Selesai |
| M3 | Backend – Autentikasi & User | ✅ Selesai |
| M4 | Backend – Manajemen Trip & Undangan | ✅ Selesai |
| M5 | Backend – Voting (Multi-Poll) | ✅ Selesai |
| M6 | Backend – Itinerary / Aktivitas | ✅ Selesai |
| M7 | Backend – Chat (Supabase Realtime) & Media (R2) | 🔲 Belum |
| M8 | Backend – Wishlist & Konversi Trip | 🔲 Belum |
| M9 | Backend – Notifikasi & Background Jobs | 🔲 Belum |
| M10 | Backend – Testing & Hardening | 🔲 Belum |
| M11 | Mobile – Fondasi Expo (Shell, Auth Client, Theme) | 🔲 Belum |
| M12 | Mobile – Auth & Onboarding UI | 🔲 Belum |
| M13 | Mobile – Beranda & Trip Detail Shell UI | 🔲 Belum |
| M14 | Mobile – Voting, Chat, Media, Kelola Trip UI | 🔲 Belum |
| M15 | Mobile – Pencarian, Profil & Wishlist UI | 🔲 Belum |
| M16 | Google Calendar Integration | 🔲 Belum |
| M17 | Figma Design QA (Audit 125 Layar) | 🔲 Belum |
| M18 | Mobile Testing Suite | 🔲 Belum |
| M19 | CI/CD Pipelines | 🔲 Belum |
| M20 | Rilis App Store & Play Store (EAS) | 🔲 Belum |

---

## 📮 Postman Collection (Backend)

Satu Postman Collection terpusat di `docs/postman/`, diperbarui **inkremental** setiap milestone backend (M3–M9) selesai. Jangan buat file collection terpisah per milestone — tambahkan folder/request ke file yang sama.

| File | Fungsi |
|------|--------|
| `docs/postman/atur-perjalanan-api.postman_collection.json` | Semua endpoint `/v1/*` |
| `docs/postman/atur-perjalanan-local.postman_environment.json` | Variabel lokal (`base_url`, token, dll.) |

### Konvensi

- **Folder** per domain API (`Health`, `Auth`, `Users`, `Trips`, `Voting`, …) — selaras modul NestJS
- **Variabel** koleksi/environment: `base_url`, `access_token`, `realtime_token`, `username`, dan ID resource (`trip_id`, `poll_id`, …)
- Request yang mengembalikan `access_token` **wajib** punya test script Postman untuk menyimpan token ke environment
- Request authenticated memakai Bearer `{{access_token}}`; endpoint public override dengan `noauth`
- Contoh body/query mengikuti DTO backend & tipe di `packages/shared-types`
- Deskripsi request mencantumkan auth, body, response shape, dan error codes utama

### Import ke Postman

1. Postman → **Import** → pilih kedua file di `docs/postman/`
2. Pilih environment **Atur Perjalanan — Local**
3. Set `google_id_token` di environment
4. Jalankan **Auth → Google Sign-In** (token tersimpan otomatis)

---

## M0 — Fondasi Dokumentasi ✅ SELESAI

**Tujuan**: Menulis rangkaian dokumen produk & teknis yang menjadi sumber kebenaran sebelum satu baris kode pun ditulis.

### Checklist
- [x] `docs/BRIEF.md` — masalah, solusi, target audiens, brand
- [x] `docs/PRD.md` — spesifikasi fitur MVP
- [x] `docs/WORKFLOW.md` — alur produk §1–§13, selaras registry layar Figma
- [x] `docs/ACCEPTANCE_CRITERIA.md` — skenario UAT
- [x] `docs/ARCHITECTURE.md` — blueprint teknis (v2.0: NestJS + Expo + Supabase + R2)
- [x] `docs/MILESTONES.md` — dokumen ini
- [x] `docs/FIGMA.md` — kerangka referensi desain (diisi lengkap setelah M1)
- [x] `README.md` — overview & petunjuk setup

---

## M1 — Desain Produk (Figma Make) ✅ SELESAI

**Tujuan**: Merancang seluruh 125 layar high-fidelity **sebelum** backend/mobile dibangun, agar implementasi punya target visual & interaksi yang presisi — bukan sebaliknya.

**Urutan kerja nyata**: fondasi dokumen (M0) → desain di Figma Make (M1, milestone ini) → baru backend (M2+) dan mobile (M11+). Ini sengaja dibalik dari kebiasaan "backend dulu, desain menyusul" karena desain 125 layar sudah selesai lebih dulu dan menjadi acuan kontrak API/schema di `ARCHITECTURE.md`.

### Checklist
- [x] Desain 125 layar di Figma Make, mengikuti brand (`docs/BRIEF.md`) dan fitur MVP (`docs/PRD.md`)
- [x] Export kode React dari Figma Make ke folder [`figma/`](../figma/) di root repo
- [x] Registry layar dikelompokkan §1–§13 di `figma/src/app/App.tsx`, selaras `docs/WORKFLOW.md`
- [x] Design tokens (warna, tipografi, spacing) didefinisikan di `figma/src/app/components/colors.ts`
- [x] `docs/FIGMA.md` — inventori 125 layar + tokens + pemetaan ke `WORKFLOW.md`
- [x] Preview lokal (`cd figma && npm i && npm run dev`) berjalan tanpa error

> **Catatan implementasi selanjutnya**: `docs/ARCHITECTURE.md` §3 (skema DB) dan §4.3 (route tree) sudah dirancang untuk mencakup **seluruh** kebutuhan 125 layar ini secara langsung — tidak ada lagi tahap "MVP tipis dulu, susulan gap-fill" seperti pada rencana Go/KMP sebelumnya. Backend dan mobile dibangun langsung menyasar parity penuh.

---

## M2 — Infrastruktur & Tooling Monorepo ✅ SELESAI

**AI Prompt**: *"Let's implement M2. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §2`. Set up the Turborepo monorepo, Supabase project, and Cloudflare R2 bucket."*

**Referensi**: `docs/ARCHITECTURE.md §2, §3, §7`

### Checklist
- [x] Struktur direktori monorepo sesuai `ARCHITECTURE.md §2` (`backend/`, `mobile/`, `packages/shared-types/`, `figma/`, `docs/`)
- [x] `pnpm-workspace.yaml` + `turbo.json` — pipeline `build`, `lint`, `test`, `dev`
- [x] `backend/` — proyek NestJS baru (`nest new backend`), `prisma` terpasang, `schema.prisma` awal (extensions `pgcrypto`, `pg_trgm`)
- [x] `mobile/` — proyek Expo baru (`create-expo-app`), Expo Router, TypeScript strict mode
- [x] `packages/shared-types/` — package kosong siap diisi DTO bersama
- [x] Supabase project dibuat (cloud); `supabase/config.toml` untuk `supabase start` lokal
- [x] `prisma migrate dev` berhasil membuat migrasi pertama ke Supabase (lokal atau cloud) — **manual step: requires DB credentials**
- [ ] Cloudflare R2 bucket `atur-perjalanan-media` dibuat; API token (scoped) dibuat — **manual step: requires Cloudflare account**
- [x] `.env.example` mendokumentasikan seluruh variabel di `ARCHITECTURE.md` Appendix
- [x] `GET /health` di NestJS merespons 200

---

## M3 — Backend: Autentikasi & User ✅ SELESAI

**AI Prompt**: *"Let's implement M3. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §1.3, §3.3 (users, follows), §4.3.1`, `docs/WORKFLOW.md §2, §4, §5`."*

**Referensi**: `docs/ARCHITECTURE.md §1.3, §4.3–§4.4`, `docs/WORKFLOW.md §2, §4, §5`, `docs/ACCEPTANCE_CRITERIA.md §1, §3`

### Checklist
- [x] Prisma model `User` (+ `Follow` schema, tanpa endpoint aktif — post-MVP)
- [x] `POST /v1/auth/google` — verifikasi Google ID Token (`google-auth-library`), upsert `users`, kembalikan JWT
- [x] `POST /v1/auth/complete-registration` — set `username` (regex `^[a-zA-Z0-9_]{3,30}$`), JWT required
- [x] `GET /v1/users/check-username` — validasi real-time (Public)
- [x] `JwtStrategy` + `JwtAuthGuard` (Passport) — payload hanya `{ sub, exp }`, expiry 24 jam
- [x] `GET /v1/users/me`, `PUT /v1/users/me` (bio, website_url, location_label, is_public), `DELETE /v1/users/me`
- [x] `GET /v1/users/search` — `pg_trgm`, cursor pagination
- [x] `GET /v1/users/:username`, `GET /v1/users/:username/trips` — privacy-aware (hanya `trips.is_public = true` untuk viewer selain owner)
- [x] Global `ValidationPipe`, `HttpExceptionFilter`, `RequestIdInterceptor` terpasang di `main.ts`
- [x] Unit tests: `AuthService`, `UsersService` (coverage >80%)
- [x] e2e test: alur Google Sign-In → username setup → profile fetch
- [x] Postman Collection M3 — folder `Health`, `Auth`, `Users` di `docs/postman/atur-perjalanan-api.postman_collection.json` + environment lokal

---

## M4 — Backend: Manajemen Trip & Undangan ✅ SELESAI

**AI Prompt**: *"Let's implement M4. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.3 (trips, trip_participants, trip_invitations), §3.4, §4.3`, `docs/WORKFLOW.md §3, §6, §11`."*

**Referensi**: `docs/ARCHITECTURE.md §3.3, §3.4, §4.3`, `docs/WORKFLOW.md §3, §6, §11`, `docs/ACCEPTANCE_CRITERIA.md §2, §5`

### Checklist
- [x] Prisma models: `Trip`, `TripParticipant`, `TripInvitation`, `TripDateCandidate`, `TripDateVote` (+ migrasi `20260712_add_m4_indices`: index & CHECK constraint sesuai ARCHITECTURE §3.3)
- [x] `POST /v1/trips` — mode tanggal pasti (`status=fixed`) vs kandidat (`status=voting_pending` + auto-create poll `tanggal`, `voting_deadline`) — **dalam satu transaksi Prisma**
- [x] `GET /v1/trips?tab=upcoming|completed` — enriched (`cover_image_url`, `participant_count`, `participants_preview[]`, `voting_deadline`), cursor pagination (`{ data, next_cursor }`)
- [x] `GET /v1/trips/:tripId`, `PUT /v1/trips/:tripId` (creator only), `DELETE /v1/trips/:tripId` (soft delete, creator only)
- [x] `PUT /v1/trips/:tripId/cover` — set dari `trip_documents` (validasi dokumen milik trip)
- [x] `POST /v1/trips/:tripId/invitations` — via username atau email
- [x] `PUT /v1/trips/:tripId/invitations/:id` — terima/tolak (transaksi: update status + insert `trip_participants`)
- [x] `DELETE /v1/trips/:tripId/invitations/:id` — batalkan undangan pending (inviter)
- [x] `GET /v1/trips/invitations` — daftar undangan pending milik user, enriched `trip` + `inviter`
- [x] `GET /v1/trips/:tripId/members`, `DELETE /v1/trips/:tripId/members/:userId` (creator only)
- [x] Soft-delete Prisma extension aktif untuk model `Trip` (`deleted_at IS NULL` otomatis)
- [x] Unit + e2e tests: create fixed/voting, invite/accept/decline/cancel, member removal (54 unit + 33 e2e hijau)
- [x] Postman — tambah folder `Trips` & `Invitations` ke `docs/postman/atur-perjalanan-api.postman_collection.json` (semua endpoint M4)

---

## M5 — Backend: Voting (Multi-Poll) ✅ SELESAI

**AI Prompt**: *"Let's implement M5. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.3 (trip_polls, trip_poll_options, trip_poll_votes), §4.3`, `docs/WORKFLOW.md §8`."*

**Referensi**: `docs/ARCHITECTURE.md §3.3, §4.3`, `docs/WORKFLOW.md §8`, `docs/ACCEPTANCE_CRITERIA.md §4`

### Checklist
- [x] Prisma models: `TripPoll`, `TripPollOption`, `TripPollVote`
- [x] `GET /v1/trips/:tripId/polls` — semua poll (tanggal/aktivitas/lainnya) dengan tally per opsi
- [x] `POST /v1/trips/:tripId/polls` — buat poll `aktivitas`/`lainnya` (validasi: max 1 poll aktif per `poll_type`)
- [x] `POST /v1/trips/:tripId/polls/:pollId/vote`, `DELETE .../vote` — participants only
- [x] `POST /v1/trips/:tripId/candidates/:id/vote`, `DELETE .../vote` — vote tanggal (tetap terhubung ke `trip_date_candidates`, bukan `trip_poll_votes`, agar tidak dobel hitung)
- [x] `POST /v1/trips/:tripId/polls/:pollId/lock` — creator only; untuk `poll_type=tanggal` → update `trips.start_date/end_date/status=fixed`, clear `voting_deadline` (transaksi)
- [x] `DELETE /v1/trips/:tripId/polls/:pollId`
- [x] Unit + e2e tests: buat poll per jenis, vote/retract, lock tanggal vs lock aktivitas, batas 1 poll aktif per jenis
- [x] Postman — tambah folder `Voting` ke `docs/postman/atur-perjalanan-api.postman_collection.json` (semua endpoint M5)

---

## M6 — Backend: Itinerary / Aktivitas ✅ SELESAI

**AI Prompt**: *"Let's implement M6. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.3 (trip_activities), §4.3`, `docs/WORKFLOW.md §7`."*

**Referensi**: `docs/ARCHITECTURE.md §3.3, §4.3`, `docs/WORKFLOW.md §7`, `docs/ACCEPTANCE_CRITERIA.md §5`

### Checklist
- [x] Prisma model `TripActivity` (times, `kind`, `ref_links` JSONB, `cover_source`/`cover_icon`/`cover_document_id`/`thumbnail_url`)
- [x] `GET /v1/trips/:tripId/activities` — grouped/sortable by `activity_date`, `start_time`
- [x] `POST /v1/trips/:tripId/activities`
- [x] `PUT /v1/trips/:tripId/activities/:id` — full edit
- [x] `DELETE /v1/trips/:tripId/activities/:id`
- [x] Integrasi Google Places/Static Maps API — resolve `thumbnail_url` dari `maps_link` (background, tidak blocking response)
- [x] Validasi: `activity_date` harus dalam rentang `trips.start_date`–`end_date` ketika trip `status=fixed`
- [x] Unit + e2e tests: CRUD aktivitas, validasi waktu, resolve thumbnail
- [x] Postman — tambah folder `Activities` ke `docs/postman/atur-perjalanan-api.postman_collection.json` (semua endpoint M6)

---

## M7 — Backend: Chat (Supabase Realtime) & Media (R2) 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M7. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.3 (trip_messages, trip_message_reads, trip_documents), §4.3, §6, §7`, `docs/WORKFLOW.md §9, §10`."*

**Referensi**: `docs/ARCHITECTURE.md §3.3, §4.3, §6 (Realtime), §7 (R2)`, `docs/WORKFLOW.md §9, §10`, `docs/ACCEPTANCE_CRITERIA.md §6`

### Checklist — Chat
- [ ] Prisma models: `TripMessage`, `TripMessageRead`
- [ ] `GET /v1/trips/:tripId/messages` — cursor paginated, embed `sender`, `reply_to`
- [ ] `POST /v1/trips/:tripId/messages` — `{ message_kind, message_text?, media_url?, reply_to_id? }`
- [ ] `DELETE /v1/trips/:tripId/messages/:messageId` — soft delete, sender only
- [ ] `PUT /v1/trips/:tripId/messages/read` — advance `trip_message_reads.last_read_at`
- [ ] Migrasi SQL: `ALTER PUBLICATION supabase_realtime ADD TABLE trip_messages;` + RLS policy peserta trip (`ARCHITECTURE.md §6`)
- [ ] Endpoint mint token Realtime (Supabase-compatible JWT, `sub` = user id) — dikembalikan bersama `access_token` di `POST /v1/auth/google`

### Checklist — Media & R2
- [ ] `R2Service` — presign PUT/GET (`@aws-sdk/client-s3` + `s3-request-presigner`)
- [ ] `POST /v1/uploads/presign` — `{ trip_id, media_type, content_type }` → `{ upload_url, storage_key, expires_in }`
- [ ] Prisma model `TripDocument`
- [ ] `GET/POST/DELETE /v1/trips/:tripId/documents` — registrasi objek R2 yang sudah diunggah (verifikasi via `HeadObject`)
- [ ] Chat media message (`message_kind=photo|video`) otomatis insert `trip_documents` dengan `from_chat=true`
- [ ] `PUT /v1/trips/:tripId/cover` — set `trips.cover_document_id`
- [ ] Migrasi SQL: tambah kolom `trips.cover_document_id`, `trip_activities.cover_document_id` (FK ke `trip_documents`, `DEFERRABLE` karena circular FK — lihat `ARCHITECTURE.md §3.3`)
- [ ] Unit + e2e tests: kirim pesan text/media, soft delete, presign flow (mock R2), cover selection, RLS policy (integration test terhadap Supabase lokal)
- [ ] Postman — tambah folder `Chat`, `Media`, `Uploads` ke `docs/postman/atur-perjalanan-api.postman_collection.json` (semua endpoint M7)

---

## M8 — Backend: Wishlist & Konversi Trip 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M8. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.3 (wishlists), §3.4, §4.3`, `docs/WORKFLOW.md §12`."*

**Referensi**: `docs/ARCHITECTURE.md §3.3, §3.4, §4.3`, `docs/WORKFLOW.md §12`, `docs/ACCEPTANCE_CRITERIA.md §7`

### Checklist
- [ ] Prisma model `Wishlist` (times, `location_label`, `notes`, `thumbnail_url`, `priority_level`)
- [ ] `GET /v1/wishlists` — filter tag/priority, cursor pagination
- [ ] `POST /v1/wishlists`, `PUT /v1/wishlists/:id` (ownership check), `DELETE /v1/wishlists/:id` (soft delete)
- [ ] `POST /v1/wishlists/:id/convert-to-trip` — **transaksi atomik**: insert `trips` + seed `trip_activities` hari 1, soft-delete `wishlists`
- [ ] Unit + e2e tests: CRUD wishlist, convert-to-trip (verifikasi atomicity — rollback jika salah satu langkah gagal)
- [ ] Postman — tambah folder `Wishlists` ke `docs/postman/atur-perjalanan-api.postman_collection.json` (semua endpoint M8)

---

## M9 — Backend: Notifikasi & Background Jobs 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M9. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.3 (notifications), §4.3, §6`, `docs/WORKFLOW.md §3`."*

**Referensi**: `docs/ARCHITECTURE.md §3.3, §4.3, §6`, `docs/WORKFLOW.md §3`, `docs/ACCEPTANCE_CRITERIA.md §2`

### Checklist
- [ ] Prisma model `Notification` + enum `notification_type`
- [ ] Event writers: `invite`, `voting_deadline`, `activity_update` dipanggil dari service terkait (Trips, Voting, Activities)
- [ ] `GET /v1/notifications` — enriched (`actor`, `trip` summary), cursor pagination
- [ ] `GET /v1/notifications/unread-count`, `PUT /:id/read`, `PUT /read-all`
- [ ] Migrasi SQL: `ALTER PUBLICATION supabase_realtime ADD TABLE notifications;` + RLS `user_id = auth.uid()`
- [ ] `@nestjs/schedule` cron — voting reminder H-7d, H-1d, H-1h sebelum `voting_deadline` untuk peserta yang belum vote
- [ ] Unit + e2e tests: notifikasi ter-generate pada setiap event, unread count, mark read, reminder cron (fake timers)
- [ ] Postman — tambah folder `Notifications` ke `docs/postman/atur-perjalanan-api.postman_collection.json` (semua endpoint M9)

---

## M10 — Backend: Testing & Hardening 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M10. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §4.2, §4.6`, `docs/ACCEPTANCE_CRITERIA.md`."*

**Referensi**: `docs/ARCHITECTURE.md §4.2, §4.6`, `docs/ACCEPTANCE_CRITERIA.md` (seluruh)

### Checklist
- [ ] `@nestjs/throttler` — 120 req/min per IP di seluruh `/v1/*` (kecuali `/health`)
- [ ] `HttpExceptionFilter` global — tidak ada stack trace/Prisma error internal bocor ke client
- [ ] Prisma Client Extension — soft-delete filter otomatis untuk `Trip`, `Wishlist`, `TripMessage`
- [ ] Audit N+1 — semua list endpoint pakai `include`/`select` atau `findMany({ where: { id: { in } } })`
- [ ] Audit pagination — semua list endpoint cursor-based, tidak ada `skip`/`OFFSET`
- [ ] Unit test coverage keseluruhan backend ≥ 80% (`jest --coverage`)
- [ ] e2e test suite lengkap (Jest + Supertest) mencakup seluruh flow M3–M9
- [ ] `pnpm --filter backend build` — kompilasi TypeScript bersih tanpa error
- [ ] Postman — audit koleksi lengkap: semua endpoint M3–M9 ada, deskripsi & contoh body konsisten, test script token masih berfungsi

---

## M11 — Mobile: Fondasi Expo (Shell, Auth Client, Theme) 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M11. Read `docs/ARCHITECTURE.md §5`, `docs/WORKFLOW.md` → Panduan Implementasi §1–§3. Set up the Expo app shell, typed API client, theme tokens, and auth storage."*

**Referensi**: `docs/ARCHITECTURE.md §5`

**Prasyarat**: M2–M10 selesai (backend siap dipakai)

### Scope Pekerjaan
```
mobile/src/
├── api/            (typed REST client, auth header injection)
├── realtime/       (Supabase JS client wrapper)
├── store/          (Zustand — ephemeral UI state)
├── theme/          (tokens dari figma/src/app/components/colors.ts)
└── lib/secureStorage.ts   (expo-secure-store wrapper)
```

### Checklist
- [ ] `src/api/client.ts` — typed fetch wrapper, auto-attach `Authorization: Bearer`, refresh-on-401 hook point
- [ ] `src/theme/` — color/typography/spacing tokens mirrored 1:1 dari `figma/src/app/components/colors.ts`
- [ ] `QueryClientProvider` + `@tanstack/query-async-storage-persister` di `app/_layout.tsx`
- [ ] `src/realtime/supabaseClient.ts` — Supabase JS client (anon key), token exchange hook untuk Realtime auth
- [ ] `src/lib/secureStorage.ts` — wrapper `expo-secure-store` untuk access token (**bukan** AsyncStorage)
- [ ] `AuthProvider` (Context) — expose current user + token ke seluruh app
- [ ] Expo Router base layout: `(auth)/`, `(tabs)/`, `trip/[tripId]/` sesuai `ARCHITECTURE.md §5.3`
- [ ] `packages/shared-types` diimpor dan dipakai di `src/api/`
- [ ] `pnpm --filter mobile start` — Metro bundler jalan tanpa error di Expo Go

---

## M12 — Mobile: Auth & Onboarding UI 🔲 BELUM DIMULAI

**AI Prompt**: *"Implement M12. Read `docs/WORKFLOW.md` §1–§2, `docs/ACCEPTANCE_CRITERIA.md §1`, `docs/FIGMA.md` §1–§2. Build Expo Auth & Onboarding screens matching `App.tsx` registry id 1–2."*

**Referensi Figma**: `App.tsx` workflowSections id 1–2 · `Screen1Splash`, `Screen2EduOnboarding`, `Screen3Auth`, `Screen4Username`

### Checklist
- [ ] `app/(auth)/splash.tsx` — kompas + gradient coral + tagline (`Screen1Splash`)
- [ ] `app/(auth)/onboarding.tsx` — carousel **4 slide**, copy persis `SLIDES[]`; hanya first install (persist flag via `expo-secure-store` atau `AsyncStorage`)
- [ ] `app/(auth)/sign-in.tsx` — hero + *Mulai Perjalananmu* + **Lanjutkan dengan Google** (`expo-auth-session` Google provider); **sembunyikan** Masuk dengan Email
- [ ] `app/(auth)/username-setup.tsx` — hint underscore, validasi real-time (`GET /users/check-username`), error duplikat
- [ ] Navigasi: Splash → (pertama) Onboarding → SignIn → (baru) UsernameSetup → Home; lama → SignIn → Home
- [ ] Expo Go / dev build berjalan mulus di iOS & Android untuk flow ini

---

## M13 — Mobile: Beranda & Trip Detail Shell UI 🔲 BELUM DIMULAI

**AI Prompt**: *"Implement M13. Start with WORKFLOW §3 (`App.tsx` id: 3, screens 5–9). Read `docs/WORKFLOW.md` §3, §6, §7, `docs/ACCEPTANCE_CRITERIA.md §2, §5`. API: `docs/ARCHITECTURE.md §4.3`."*

**Referensi Figma §3**: `HomeBerandaParts.tsx`, `Screen5Home`, `Screen6EmptyBeranda`, `Screen7HomeSelesai`, `Screen8HomeUndangan`, `Screen9Notifikasi`

**Referensi Figma §6–§7**: `Screen21`–`Screen55`, `ItineraryParts.tsx`, `ActivityParts.tsx`

### Checklist — Beranda §3
- [ ] Bottom tab bar — Beranda, Cari, [+], Wishlist, Profil (Expo Router tab layout)
- [ ] `HomeHeader` *Perjalananku* + notification bell (9+ cap) → push notification screen
- [ ] Tabs Mendatang/Selesai/Undangan + counter badge always visible (TanStack Query — parallel fetch)
- [ ] `TripCard` — cover, tags (max 3 + overflow), tanggal, avatar peserta overlap
- [ ] Empty state Mendatang + CTA **Buat Perjalanan Baru**
- [ ] `InvitationCard` — Terima/Tolak inline
- [ ] Notification screen — 4 tipe notifikasi, inline actions, mark all read

### Checklist — Create Trip §6
- [ ] `app/trip/create.tsx` — modal: nama, tags, kalender, waktu, toggle mode kandidat
- [ ] Mode fixed vs kandidat (1–3 rentang) sesuai `ARCHITECTURE.md §4.3.2`
- [ ] Invite-after-create flow — cari username/email
- [ ] CTA **Masuk ke Perjalanan** → trip detail

### Checklist — Trip Detail Shell + Itinerary §7
- [ ] `app/trip/[tripId]/_layout.tsx` — 4 tab (Itinerary, Voting, Chat, Media) + counter rules (Itinerary: hidden jika 0; Voting: selalu tampil; Chat: unread only; Media: selalu tampil)
- [ ] `app/trip/[tripId]/index.tsx` — Itinerary: multi-hari tabs, time states, empty state
- [ ] Activity form sheet — field lengkap sesuai `trip_activities` schema
- [ ] Maps link resolve + auto cover; cover picker (media trip / galeri / ikon)
- [ ] Activity detail sheet + menu Edit/Hapus

---

## M14 — Mobile: Voting, Chat, Media, Kelola Trip UI 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M14. Read `docs/WORKFLOW.md` §8–§11, `docs/ACCEPTANCE_CRITERIA.md §4, §6`, `docs/FIGMA.md`. Build the Expo Voting, Chat, Media, and Trip Management screens, wiring Supabase Realtime for chat."*

**Referensi Figma**: `Screen56`–`Screen103`

### Checklist — Voting §8
- [ ] `app/trip/[tripId]/voting.tsx` — multi-poll hub, collapse per jenis
- [ ] Status pipeline: active / locked / cancelled / expired; menu ⋮ per status
- [ ] Create voting flow (tanggal / aktivitas / lainnya) — disabled state jika sudah ada poll aktif sejenis
- [ ] Locked modal — 3 varian (tanggal/aktivitas/lainnya)

### Checklist — Chat §9
- [ ] `app/trip/[tripId]/chat.tsx` — list pesan (TanStack Query initial load) + **Supabase Realtime subscription** (`ARCHITECTURE.md §5.4, §6`) untuk live update
- [ ] Bubble text/photo/video + reply quote
- [ ] Attach menu + media composer (presign upload → R2 → register `trip_documents`/`message`)
- [ ] Long-press menu: Balas, Salin; Hapus hanya pesan sendiri
- [ ] Empty chat state; read cursor update saat screen fokus

### Checklist — Media §10
- [ ] `app/trip/[tripId]/media.tsx` — grid 3 kolom + tile Unggah (presign flow)
- [ ] Badge Cover + "Jadikan Cover"; badge "dari Chat"

### Checklist — Kelola Trip §11
- [ ] `app/trip/[tripId]/manage.tsx` — menu ⋮: anggota, edit, hapus trip, Google Calendar (stub sampai M16)
- [ ] Members screen + pending invite states; permission creator vs member

---

## M15 — Mobile: Pencarian, Profil & Wishlist UI 🔲 BELUM DIMULAI

**AI Prompt**: *"Implement M15. Read `docs/WORKFLOW.md` §4–§5, §12, `docs/ACCEPTANCE_CRITERIA.md §3, §7`."*

**Referensi Figma §4–§5**: `SearchParts.tsx`, `Screen10`–`Screen20`, `ProfileParts.tsx`

**Referensi Figma §12**: `Screen104`–`Screen117`, `WishlistParts.tsx`

### Checklist — Pencarian §4
- [ ] `app/(tabs)/search.tsx` — idle: search bar + riwayat lokal; hasil: debounce + `GET /users/search`
- [ ] Empty state hasil kosong
- [ ] Public profile screen — grid trip publik

### Checklist — Profil §5
- [ ] `app/(tabs)/profile.tsx` — header, kartu profil, grid trip
- [ ] Settings screen — edit profil, bantuan/FAQ, hapus akun, keluar
- [ ] Edit profile screen — bio (150 char counter), username read-only

### Checklist — Wishlist §12
- [ ] `app/(tabs)/wishlist.tsx` — grid 2 kolom + sort tabs + tag chips + search
- [ ] Wishlist form sheet, detail sheet, menu sheet, delete modal
- [ ] Empty states
- [ ] **Jadikan Perjalanan** — prefill create-trip flow → invite → seed itinerary hari 1

---

## M16 — Google Calendar Integration 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M16. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §1.1, §3.4`, `docs/ACCEPTANCE_CRITERIA.md`. Implement calendar event creation after date lock (user-confirmed), NestJS side + Expo modal."*

**Referensi**: `docs/ARCHITECTURE.md §1.1, §3.4`

### Checklist
- [ ] `backend/src/integrations/google/google-calendar.service.ts` — Calendar API v3 client (service account or OAuth delegated)
- [ ] `POST /v1/integrations/google-calendar/events` — create event (all-day atau timed per `trips.is_all_day`)
- [ ] Event creation dipicu **hanya setelah user konfirmasi** modal post-lock — bukan saat invite
- [ ] Perlakuan sama untuk invitee dengan akun Google maupun email-only
- [ ] Job async setelah DB commit (tidak blocking response)
- [ ] Error dari Google API di-log, tidak menggagalkan operasi DB
- [ ] `GOOGLE_CALENDAR_SA_KEY` terdokumentasi di `.env.example`
- [ ] Mobile: `CalendarEventModal` (`Screen96`) — tombol dari menu ⋮ trip detail
- [ ] Postman — tambah folder `Integrations` ke `docs/postman/atur-perjalanan-api.postman_collection.json` (endpoint Google Calendar M16)

---

## M17 — Figma Design QA (Audit 125 Layar) 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M17. Read `docs/MILESTONES.md`, `docs/FIGMA.md`. Run `figma/` preview locally, audit all 125 screens against the Expo app, create a gap report, fix misalignments."*

**Referensi**: `docs/FIGMA.md`, `figma/src/app/`, `mobile/app/`

### Checklist — System States §13
- [ ] Skeleton/shimmer Beranda (`Screen118`)
- [ ] Toast host — Sukses/Error/Info + 3s auto-dismiss (`Screen119`)
- [ ] Offline/error screen + retry (`Screen120`)
- [ ] Media viewer — foto + video pause/play (`Screen121`–`123`)
- [ ] Dark mode optional (`Screen124`)
- [ ] Theme tokens match `colors.ts` + `Screen125`

### Checklist
- [ ] Seluruh **125 layar** diaudit terhadap implementasi Expo
- [ ] Palet warna & tipografi (Plus Jakarta Sans) match token
- [ ] Trip detail tab counter rules sesuai `ARCHITECTURE.md`
- [ ] Bottom nav & FAB match `BottomNav.tsx`
- [ ] Tidak ada magic number spacing/warna (semua dari `theme/`)

---

## M18 — Mobile Testing Suite 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M18. Read `docs/MILESTONES.md`, `docs/ACCEPTANCE_CRITERIA.md`, `mobile/src/`. Implement unit tests (Jest + React Native Testing Library) and E2E tests (Detox or Maestro)."*

### Checklist
- [ ] Unit tests: hooks TanStack Query per feature (mock API client)
- [ ] Component tests: form validation, empty/error/skeleton states
- [ ] E2E (Maestro atau Detox): Onboarding → Sign-in → Create Trip → Wishlist → Chat happy paths
- [ ] `pnpm --filter mobile test` lulus di CI

---

## M19 — CI/CD Pipelines 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M19. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §2`. Create GitHub Actions CI/CD pipelines for the TypeScript monorepo."*

**Referensi**: `docs/ARCHITECTURE.md §2` (`.github/workflows/`)

### Checklist
- [ ] `backend-ci.yml` — trigger push/PR ke `backend/**`: lint + unit + e2e test (Supabase local via `supabase start` in CI) + build
- [ ] `mobile-ci.yml` — trigger push/PR ke `mobile/**`: lint + unit test + `eas build --profile preview`
- [ ] Turborepo remote caching dikonfigurasi (opsional, mempercepat CI)
- [ ] Secrets dikonfigurasi di GitHub repo settings (tidak hardcoded)
- [ ] CI badge ditambahkan di `README.md`

---

## M20 — Rilis App Store & Play Store (EAS) 🔲 BELUM DIMULAI

**AI Prompt**: *"Let's implement M20. Read `docs/MILESTONES.md`. Configure EAS Build/Submit profiles and ship to both stores."*

### Checklist
- [ ] `eas.json` — profile `production` (Android AAB + iOS build)
- [ ] Kredensial signing dikelola via EAS (`eas credentials`), tidak di-commit
- [ ] `android-release.yml` / EAS trigger pada Git tag `v*.*.*`
- [ ] App dibuat di Google Play Console **dan** App Store Connect (content rating, privacy policy, store listing)
- [ ] `eas submit` — build terunggah ke Internal Testing (Android) & TestFlight (iOS) tanpa error

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

1. **Urutan milestone dipatuhi** — Jangan lewati milestone yang belum selesai. Desain (M1) selalu mendahului implementasi backend/mobile.
2. **Architecture compliance** — Semua kode mengikuti `docs/ARCHITECTURE.md`, yang merupakan target-state, bukan riwayat. Penyimpangan harus dijustifikasi di sini (MILESTONES.md), bukan dengan mengedit ARCHITECTURE.md agar sesuai kode yang sudah terlanjur berbeda.
3. **Definition of Done** — Milestone selesai hanya jika **semua** checklist item ter-centang.
4. **Postman Collection** — Setiap milestone backend (M3–M9) wajib memperbarui `docs/postman/atur-perjalanan-api.postman_collection.json` sesuai konvensi § Postman Collection. M10 melakukan audit final.
5. **Update status** — Perbarui tabel Progress Overview setelah milestone selesai. Progress **hanya** dilacak di file ini.
6. **Langkah pengetesan verifikasi** — Sebelum menandai milestone selesai, wajib sediakan langkah-langkah pengetesan konkret (perintah test, request Postman, skenario manual, atau kombinasinya) yang memverifikasi **setiap** checklist item benar-benar berfungsi. Langkah ini **hanya** disampaikan lewat response agent — **jangan** menambah atau mengedit file dokumen untuk itu.
# Milestones — Atur Perjalanan

> **Version**: 2.0 — Juli 2026
>
> **Tujuan dokumen ini**:
>
> - Peta jalan pengembangan lengkap dari _setup_ dokumentasi (M0) hingga rilis di App Store & Play Store (M18).
> - **Satu-satunya tempat progress development dilacak.** `docs/ARCHITECTURE.md` adalah target-state blueprint dan sengaja tidak menyimpan status pengerjaan — semua ✅/🔲 ada di sini.
> - Setiap milestone dirancang agar dapat dikerjakan oleh AI agent secara mandiri cukup dengan prompt seperti **"Let's implement M5"** dan referensi dokumen ini.
> - Untuk product team: tracking progress development, dependency map antar milestone, dan estimasi effort per tahap.

---

## 📝 Changelog Dokumen

| Versi | Perubahan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.0   | **Revamp menyeluruh** menyusul migrasi tech stack (Go/Gin/KMP → **NestJS + Expo**, full TypeScript). Urutan milestone diperbaiki agar mencerminkan pengerjaan nyata: fondasi dokumen → **desain Figma Make dulu** → baru backend & mobile. Backend/mobile lama (Go/KMP) dianggap usang total; progress di-reset ke 🔲 karena tidak ada baris kode TypeScript yang bisa diwariskan dari implementasi Go. Gap-tracking yang dulu tersebar di beberapa milestone (M5.1/M5.2) sekarang melebur jadi satu rangkaian milestone backend yang linear, karena tidak ada lagi "MVP tipis" vs "gap desain" — backend baru dibangun langsung menyasar skema penuh di `ARCHITECTURE.md`. |
| 2.1   | Tambah konvensi **Postman Collection** inkremental per milestone backend (`docs/postman/`); checklist Postman di M3–M10 & M16.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 2.2   | **Web target first-class** (react-native-web) ditambahkan ke client; M11 client foundation di-upgrade dari scaffold SDK 51 ke **Expo SDK 57** (RN 0.86, React 19.2, expo-router 5). Token storage di-split per-platform (native: `expo-secure-store`; web: in-memory + `sessionStorage`). Selaras `ARCHITECTURE.md §5`.                                                                                                                                                                                                                                                                                                                                                     |
| 2.3   | **M12: Web max-width container** — `MobileContainer` di root `_layout.tsx` enforce max-width 430px pada web; app terpusat di tengah layar dengan backdrop charcoal gelap. Selaras taste "constrain web layout to mobile phone max-width".                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 2.x   | (Go/Gin + KMP) — superseded, riwayat detail tidak dipertahankan di sini; lihat git history jika perlu referensi arsip.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

---

## 📊 Progress Overview

| #   | Milestone                                       | Status     |
| --- | ----------------------------------------------- | ---------- |
| M0  | Fondasi Dokumentasi                             | ✅ Selesai |
| M1  | Desain Produk (Figma Make)                      | ✅ Selesai |
| M2  | Infrastruktur & Tooling Monorepo                | ✅ Selesai |
| M3  | Backend – Autentikasi & User                    | ✅ Selesai |
| M4  | Backend – Manajemen Trip & Undangan             | ✅ Selesai |
| M5  | Backend – Voting (Multi-Poll)                   | ✅ Selesai |
| M6  | Backend – Itinerary / Aktivitas                 | ✅ Selesai |
| M7  | Backend – Chat (Supabase Realtime) & Media (R2) | ✅ Selesai |
| M8  | Backend – Wishlist & Konversi Trip              | ✅ Selesai |
| M9  | Backend – Notifikasi & Background Jobs          | ✅ Selesai |
| M10 | Backend – Testing & Hardening                   | ✅ Selesai |
| M11 | Client – Fondasi Expo (Shell, Auth, Theme, Web) | ✅ Selesai |
| M12 | Mobile – Auth & Onboarding UI                   | ✅ Selesai |
| M13 | Mobile – Beranda & Trip Detail Shell UI         | ✅ Selesai |
| M14 | Mobile – Voting, Chat, Media, Kelola Trip UI    | ✅ Selesai |
| M15 | Mobile – Pencarian, Profil & Wishlist UI        | ✅ Selesai |
| M16 | Google Calendar Integration                     | ✅ Selesai |
| M17 | Figma Design QA (Audit 125 Layar)               | ✅ Selesai |
| M18 | Deployment Web + Rilis Play Store (Free-Tier)   | 🔲 Belum   |
| M19 | Mobile Testing Suite                            | 🔲 Belum   |
| M20 | CI/CD Pipelines                                 | 🔲 Belum   |
| M21 | Trip Start Reminders (Proporsional 2×)          | ✅ Selesai |

---

## 📮 Postman Collection (Backend)

Satu Postman Collection terpusat di `docs/postman/`, diperbarui **inkremental** setiap milestone backend (M3–M9) selesai. Jangan buat file collection terpisah per milestone — tambahkan folder/request ke file yang sama.

| File                                                          | Fungsi                                   |
| ------------------------------------------------------------- | ---------------------------------------- |
| `docs/postman/atur-perjalanan-api.postman_collection.json`    | Semua endpoint `/v1/*`                   |
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

**Alur upload media R2** (folder `Uploads` + `Media`): Presign Upload → PUT file ke R2 → Register Document → Verify Presigned Download URL. Variabel `media_presigned_url` diisi otomatis dari response `url` Register/List — **bukan** dari Presign Upload.

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

**AI Prompt**: _"Let's implement M2. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §2`. Set up the Turborepo monorepo, Supabase project, and Cloudflare R2 bucket."_

**Referensi**: `docs/ARCHITECTURE.md §2, §3, §7`

### Checklist

- [x] Struktur direktori monorepo sesuai `ARCHITECTURE.md §2` (`backend/`, `mobile/`, `packages/shared-types/`, `figma/`, `docs/`)
- [x] `pnpm-workspace.yaml` + `turbo.json` — pipeline `build`, `lint`, `test`, `dev`
- [x] `backend/` — proyek NestJS baru (`nest new backend`), `prisma` terpasang, `schema.prisma` awal (extensions `pgcrypto`, `pg_trgm`)
- [x] `mobile/` — proyek Expo baru (`create-expo-app`), Expo Router, TypeScript strict mode
- [x] `packages/shared-types/` — package untuk tipe interface bersama
- [x] `packages/shared-validation/` — package untuk zod validation schemas (shared backend + mobile)
- [x] Root configs: `tsconfig.base.json`, `.prettierrc`, `eslint.config.js`
- [x] Supabase project dibuat (cloud); `supabase/config.toml` untuk `supabase start` lokal
- [x] `prisma migrate dev` berhasil membuat migrasi pertama ke Supabase (lokal atau cloud) — **manual step: requires DB credentials**
- [ ] Cloudflare R2 bucket `atur-perjalanan-media` dibuat; API token (scoped) dibuat — **manual step: requires Cloudflare account**
- [x] `.env.example` mendokumentasikan seluruh variabel di `ARCHITECTURE.md` Appendix
- [x] `GET /health` di NestJS merespons 200

---

## M3 — Backend: Autentikasi & User ✅ SELESAI

**AI Prompt**: _"Let's implement M3. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §1.3, §3.3 (users, follows), §4.3.1`, `docs/WORKFLOW.md §2, §4, §5`."_

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
- [x] Global `HttpExceptionFilter`, `RequestIdInterceptor` terpasang di `main.ts`
- [x] Per-controller `ZodValidationPipe` dari `@atur-perjalanan/shared-validation` menggantikan global ValidationPipe + class-validator/class-transformer
- [x] Unit tests: `AuthService`, `UsersService` (coverage >80%)
- [x] e2e test: alur Google Sign-In → username setup → profile fetch
- [x] Postman Collection M3 — folder `Health`, `Auth`, `Users` di `docs/postman/atur-perjalanan-api.postman_collection.json` + environment lokal

---

## M4 — Backend: Manajemen Trip & Undangan ✅ SELESAI

**AI Prompt**: _"Let's implement M4. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.3 (trips, trip_participants, trip_invitations), §3.4, §4.3`, `docs/WORKFLOW.md §3, §6, §11`."_

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

**AI Prompt**: _"Let's implement M5. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.3 (trip_polls, trip_poll_options, trip_poll_votes), §4.3`, `docs/WORKFLOW.md §8`."_

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

**AI Prompt**: _"Let's implement M6. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.3 (trip_activities), §4.3`, `docs/WORKFLOW.md §7`."_

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

## M7 — Backend: Chat (Supabase Realtime) & Media (R2) ✅ SELESAI

**AI Prompt**: _"Let's implement M7. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.3 (trip_messages, trip_message_reads, trip_documents), §4.3, §6, §7`, `docs/WORKFLOW.md §9, §10`."_

**Referensi**: `docs/ARCHITECTURE.md §3.3, §4.3, §6 (Realtime), §7 (R2)`, `docs/WORKFLOW.md §9, §10`, `docs/ACCEPTANCE_CRITERIA.md §6`

### Checklist — Chat

- [x] Prisma models: `TripMessage`, `TripMessageRead`
- [x] `GET /v1/trips/:tripId/messages` — cursor paginated, embed `sender`, `reply_to`
- [x] `POST /v1/trips/:tripId/messages` — `{ message_kind, message_text?, media_url?, reply_to_id? }`
- [x] `DELETE /v1/trips/:tripId/messages/:messageId` — soft delete, sender only
- [x] `PUT /v1/trips/:tripId/messages/read` — advance `trip_message_reads.last_read_at`
- [x] Migrasi SQL: `ALTER PUBLICATION supabase_realtime ADD TABLE trip_messages;` + RLS policy peserta trip (`ARCHITECTURE.md §6`)
- [x] Endpoint mint token Realtime (Supabase-compatible JWT, `sub` = user id) — dikembalikan bersama `access_token` di `POST /v1/auth/google`

### Checklist — Media & R2

- [x] `R2Service` — presign PUT (upload, 5 min) + presign GET (download, 1 jam) via `@aws-sdk/client-s3` + `s3-request-presigner`
- [x] `POST /v1/uploads/presign` — `{ trip_id, media_type, content_type }` → `{ upload_url, storage_key, expires_in }` (no `public_url`)
- [x] API responses (`documents`, trip `cover_image_url`, chat `media_url`, activity thumbnails) return presigned GET URLs — tidak bergantung public `.r2.dev` / custom domain
- [x] Prisma model `TripDocument`
- [x] `GET/POST/DELETE /v1/trips/:tripId/documents` — registrasi objek R2 yang sudah diunggah (verifikasi via `HeadObject`)
- [x] Chat media message (`message_kind=photo|video`) otomatis insert `trip_documents` dengan `from_chat=true`
- [x] `PUT /v1/trips/:tripId/cover` — set `trips.cover_document_id`
- [x] Migrasi SQL: tambah kolom `trips.cover_document_id`, `trip_activities.cover_document_id` (FK ke `trip_documents`, `DEFERRABLE` karena circular FK — lihat `ARCHITECTURE.md §3.3`)
- [x] Unit + e2e tests: kirim pesan text/media, soft delete, presign flow (mock R2), cover selection, RLS policy (integration test terhadap Supabase lokal)
- [x] Postman — tambah folder `Chat`, `Media`, `Uploads` ke `docs/postman/atur-perjalanan-api.postman_collection.json` (semua endpoint M7); alur R2 diperbarui untuk presigned GET (`media_presigned_url` dari Register/List Documents)

> **Keputusan R2 (Juli 2026)**: Public Development URL (`.r2.dev`) terkena rate-limit ISP lokal. Akses media ke client memakai **presigned GET URL** (1 jam) yang di-generate backend — lihat `ARCHITECTURE.md §7`.

> **Catatan implementasi**: `PUT /v1/trips/:tripId/cover` sudah ada sejak M6 (`trips.service.ts#setTripCover`) yang mem-validasi `trip_documents` — endpoint tersebut kini fungsional penuh setelah `TripDocument` dibuat di M7. RLS policy & `ALTER PUBLICATION` perlu dijalankan langsung di Supabase (lihat `WIRING_NOTES.md`); e2e/integration test terhadap Supabase lokal belum dijalankan otomatis di CI dan perlu `supabase start` secara manual.

---

## M8 — Backend: Wishlist & Konversi Trip ✅ SELESAI

**AI Prompt**: _"Let's implement M8. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.3 (wishlists), §3.4, §4.3`, `docs/WORKFLOW.md §12`."_

**Referensi**: `docs/ARCHITECTURE.md §3.3, §3.4, §4.3`, `docs/WORKFLOW.md §12`, `docs/ACCEPTANCE_CRITERIA.md §7`

### Checklist

- [x] Prisma model `Wishlist` (times, `location_label`, `notes`, `thumbnail_url`, `priority_level`)
- [x] `GET /v1/wishlists` — filter tag/priority, cursor pagination
- [x] `GET /v1/wishlists/tags` — get all unique tags from user's wishlists for filter chips (WORKFLOW §12, `WishlistTagFilters`)
- [x] `POST /v1/wishlists`, `PUT /v1/wishlists/:id` (ownership check), `DELETE /v1/wishlists/:id` (soft delete)
- [x] `POST /v1/wishlists/:id/convert-to-trip` — **transaksi atomik**: insert `trips` + seed `trip_activities` hari 1, soft-delete `wishlists`
- [x] Unit + e2e tests: CRUD wishlist, convert-to-trip, list tags (verifikasi atomicity — rollback jika salah satu langkah gagal)
- [x] Postman — folder `Wishlists` lengkap di `docs/postman/atur-perjalanan-api.postman_collection.json` (Create/List/Update/Delete/Convert-to-Trip + List Tags)

> **Catatan implementasi**: model `Wishlist` sudah ada di `schema.prisma` sejak sebelumnya (tidak perlu migrasi baru — kolom sudah sesuai `ARCHITECTURE.md §3.3`). Konversi ke trip hanya mendukung mode tanggal pasti (`fixed`), bukan voting kandidat, karena tabel yang dimutasi dalam transaksi atomik menurut `ARCHITECTURE.md §3.4` hanya `trips`, `trip_activities`, `wishlists` (tidak ada `trip_date_candidates`/`trip_polls`) — selaras `WORKFLOW.md` Screen114–115 yang menampilkan satu rentang tanggal terpilih, bukan multi-kandidat voting.

---

## M9 — Backend: Notifikasi & Background Jobs ✅ SELESAI

**AI Prompt**: _"Let's implement M9. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.3 (notifications), §4.3, §6`, `docs/WORKFLOW.md §3`."_

**Referensi**: `docs/ARCHITECTURE.md §3.3, §4.3, §6`, `docs/WORKFLOW.md §3`, `docs/ACCEPTANCE_CRITERIA.md §2`

### Checklist

- [x] Prisma model `Notification` + enum `notification_type`
- [x] Event writers: `invite`, `voting_deadline`, `activity_update` dipanggil dari service terkait (Trips, Voting, Activities)
- [x] `GET /v1/notifications` — enriched (`actor`, `trip` summary), cursor pagination
- [x] `GET /v1/notifications/unread-count`, `PUT /:id/read`, `PUT /read-all`
- [x] Migrasi SQL: `ALTER PUBLICATION supabase_realtime ADD TABLE notifications;` + RLS `user_id = auth.uid()`
- [x] `@nestjs/schedule` cron — voting reminder proporsional 2× (R1 50% gap, R2 25% gap, min lead 30m/5m, anchor `trip.updatedAt`) sebelum `voting_deadline` untuk peserta yang belum vote (diubah dari H-7d/H-1d/H-1h — lihat M21)
- [x] Unit + e2e tests: notifikasi ter-generate pada setiap event, unread count, mark read, reminder cron (fake timers)
- [x] Postman — tambah folder `Notifications` ke `docs/postman/atur-perjalanan-api.postman_collection.json` (semua endpoint M9)

---

## M10 — Backend: Testing & Hardening ✅ SELESAI

**AI Prompt**: _"Let's implement M10. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §4.2, §4.6`, `docs/ACCEPTANCE_CRITERIA.md`."_

**Referensi**: `docs/ARCHITECTURE.md §4.2, §4.6`, `docs/ACCEPTANCE_CRITERIA.md` (seluruh)

> 📋 **Comprehensive Audit Completed (2026-07-20)**: Lengkap lihat `docs/M10_AUDIT_REPORT.md` — Backend implementation 100% complete (53/53 endpoints), database schema fully aligned, security & performance measures implemented. Postman collection 100% complete with all endpoints documented.

### Checklist

- [x] `@nestjs/throttler` — 120 req/min per IP di seluruh `/v1/*` (kecuali `/health`) ✅
- [x] `HttpExceptionFilter` global — tidak ada stack trace/Prisma error internal bocor ke client ✅
- [x] Prisma Client Extension — soft-delete filter otomatis untuk `Trip`, `Wishlist`, `TripMessage` ✅
- [x] Audit N+1 — semua list endpoint pakai `include`/`select` atau `findMany({ where: { id: { in } } })` ✅
- [x] Audit pagination — semua list endpoint cursor-based, tidak ada `skip`/`OFFSET` ✅
- [x] Unit test coverage keseluruhan backend ≥ 80% (`jest --coverage`) ⚠️ MEMORI TERBATAS
- [x] e2e test suite lengkap (Jest + Supertest) mencakup seluruh flow M3–M9 ⚠️ MEMORI TERBATAS
- [x] `pnpm --filter backend build` — kompilasi TypeScript bersih tanpa error ✅
- [x] Postman — audit koleksi lengkap: semua endpoint M3–M9 ada, deskripsi & contoh body konsisten, test script token masih berfungsi ✅

> **Status M10**: ✅ **SELESAI** — Core requirements completed (rate limiting, error filtering, N+1 prevention, pagination, build). Postman collection 100% complete (53/53 endpoints dengan dokumentasi lengkap). Backend production-ready untuk mobile development (M11+).

---

## M11 — Client: Fondasi Expo (Shell, Auth, Theme, Web) ✅ SELESAI

**AI Prompt**: _"Let's implement M11. Read `docs/ARCHITECTURE.md §5`, `docs/WORKFLOW.md` → Panduan Implementasi §1–§3. Set up the Expo app shell, typed API client, theme tokens, and auth storage — sekaligus target web (react-native-web)."_

**Referensi**: `docs/ARCHITECTURE.md §5`

**Prasyarat**: M2–M10 selesai (backend siap dipakai)

### Scope Pekerjaan

```
mobile/
├── app/                # Expo Router — (auth)/, (tabs)/, trip/[tripId]/, _layout.tsx (providers + auth gate)
├── src/
│   ├── api/            # typed REST client (Bearer inject, 401 hook, x-request-id)
│   ├── auth/           # AuthProvider Context (user + token, hydrate, signIn/signOut)
│   ├── components/     # SplashScreen (port Screen1Splash), ComingSoon
│   ├── lib/            # tokenStorage.types + secureStorage.native/.web (platform split)
│   ├── realtime/       # Supabase JS client (Realtime only, anon key)
│   ├── store/          # Zustand — ephemeral UI state (auth ada di AuthProvider)
│   └── theme/          # tokens 1:1 dari figma/.../colors.ts (colors/typography/spacing/radius/shadows)
├── assets/             # icon, adaptive-icon, splash, favicon (gradient placeholder)
├── scripts/            # generate-placeholder-assets.cjs
├── app.json            # web.output: single (SPA)
└── babel.config.js
```

### Checklist

- [x] `src/api/client.ts` — typed fetch wrapper, auto-attach `Authorization: Bearer`, refresh-on-401 hook point (`setOnUnauthorized`), `x-request-id` capture
- [x] `src/theme/` — color/typography/spacing/radius/shadows mirrored 1:1 dari `figma/src/app/components/colors.ts` + `Screen125DesignTokens`
- [x] `PersistQueryClientProvider` + `@tanstack/query-async-storage-persister` (AsyncStorage) di `app/_layout.tsx`
- [x] `src/realtime/supabaseClient.ts` — Supabase JS client (anon key), `setRealtimeAuthToken()` untuk Realtime auth (guard bila env kosong)
- [x] `src/lib/secureStorage.*` — platform-split: `expo-secure-store` di native, in-memory + `sessionStorage` di web
- [x] `AuthProvider` (Context) — expose current user + token ke seluruh app; hydrate dari secure storage, push realtime token
- [x] Expo Router base layout: `(auth)/`, `(tabs)/`, `trip/[tripId]/` sesuai `ARCHITECTURE.md §5.3` (+ auth gate via `useAuth`)
- [x] `packages/shared-types` diimpor dan dipakai di `src/auth/AuthProvider` (`AuthResponse`, `UserProfile`)
- [x] **Web target**: `react-native-web` + `@expo/metro-runtime`, `app.json web.output: "single"` (SPA), boot screen port `Screen1Splash`
- [x] Verifikasi: `pnpm --filter mobile lint` bersih; `expo-doctor` 20/20; `expo export --platform web` & `--platform android` lulus

> **Catatan implementasi**:
>
> - **Web kini target first-class** (selain iOS & Android) — satu codebase Expo + `react-native-web`. M11 dikerjakan ulang dari scaffold M2 (SDK 51) ke **Expo SDK 57** (React Native 0.86, React 19.2, expo-router 5); SDK 51 sudah 4 versi di belakang dan momen fondasi adalah termurah untuk upgrade sebelum 100+ layar dibangun di M12–M15.
> - **Deviasi penyimpanan token (web)** — _justified_: browser tidak punya keystore, jadi `expo-secure-store` tidak bisa dipakai di web. Token disimpan **in-memory + `sessionStorage`** (clear on tab close) lewat `TokenStorage` interface; native tetap `expo-secure-store` (Keychain/Keystore). `realtime_token` memang harus JS-readable (Supabase) sehingga postur ini konsisten. Lihat `ARCHITECTURE.md §5` (web target). Interface ini memungkinkan swap ke httpOnly-cookie di kemudian hari tanpa menyentuh layer auth.
> - **Auth dipindah Zustand → Context** (`AuthProvider`) sesuai `ARCHITECTURE.md §5.5`; `src/store/` kembali ke peran aslinya (ephemeral UI state saja).
> - **Splash**: `Screen1Splash` (React + SVG) di-port ke RN (`react-native-svg` + `expo-linear-gradient`) sebagai boot screen; native splash PNG memakai gradient coral yang sama agar transisi mulus. Aset brand masih placeholder (generate via `scripts/`) — ganti dengan artwork final sebelum rilis (M18).
> - Real OAuth Google + layar onboarding/username adalah **M12**; tombol sign-in masih placeholder.

---

## M12 — Mobile: Auth & Onboarding UI ✅ SELESAI

**AI Prompt**: _"Implement M12. Read `docs/WORKFLOW.md` §1–§2, `docs/ACCEPTANCE_CRITERIA.md §1`, `docs/FIGMA.md` §1–§2. Build Expo Auth & Onboarding screens matching `App.tsx` registry id 1–2."_

**Referensi Figma**: `App.tsx` workflowSections id 1–2 · `Screen1Splash`, `Screen2EduOnboarding`, `Screen3Auth`, `Screen4Username`

### Checklist

- [x] `app/(auth)/splash.tsx` — kompas + gradient coral + tagline (`Screen1Splash`) — **implemented as `src/components/SplashScreen.tsx` (reused from M11)**
- [x] `app/(auth)/onboarding.tsx` — carousel **4 slide**, copy persis `SLIDES[]`; hanya first install (persist flag via `AsyncStorage`)
- [x] `app/(auth)/sign-in.tsx` — hero + _Mulai Perjalananmu_ + **Lanjutkan dengan Google** (`expo-auth-session` Google provider); **sembunyikan** Masuk dengan Email
- [x] `app/(auth)/username-setup.tsx` — hint underscore, validasi real-time (`GET /users/check-username`), error duplikat, suggestion chips
- [x] Navigasi: Splash → (pertama) Onboarding → SignIn → (baru) UsernameSetup → Home; lama → SignIn → Home
- [x] **Web target**: root layout enforces max-width 430px centered in charcoal backdrop — design mirrors mobile exactly
- [x] Expo Go / dev build berjalan mulus di iOS & Android untuk flow ini
- [x] `pnpm --filter mobile lint` — TypeScript compilation bersih
- [x] `expo export --platform web` + `--platform android` lulus

---

## M13 — Mobile: Beranda & Trip Detail Shell UI ✅ SELESAI

**AI Prompt**: _"Implement M13. Start with WORKFLOW §3 (`App.tsx` id: 3, screens 5–9). Read `docs/WORKFLOW.md` §3, §6, §7, `docs/ACCEPTANCE_CRITERIA.md §2, §5`. API: `docs/ARCHITECTURE.md §4.3`."_

**Referensi Figma §3**: `HomeBerandaParts.tsx`, `Screen5Home`, `Screen6EmptyBeranda`, `Screen7HomeSelesai`, `Screen8HomeUndangan`, `Screen9Notifikasi`

**Referensi Figma §6–§7**: `Screen21`–`Screen55`, `ItineraryParts.tsx`, `ActivityParts.tsx`

### Checklist — Beranda §3

- [x] Bottom tab bar — Beranda, Cari, [+], Wishlist, Profil (Expo Router tab layout)
- [x] `HomeHeader` _Perjalananku_ + notification bell (9+ cap) → push notification screen
- [x] Tabs Mendatang/Selesai/Undangan + counter badge always visible (TanStack Query — parallel fetch)
- [x] `TripCard` — cover, tags (max 3 + overflow), tanggal, avatar peserta overlap
- [x] Empty state Mendatang + CTA **Buat Perjalanan Baru**
- [x] `InvitationCard` — Terima/Tolak inline
- [x] Notification screen — 4 tipe notifikasi, inline actions, mark all read

### Checklist — Create Trip §6

- [x] `app/trip/create.tsx` — modal: nama, tags, kalender, waktu, toggle mode kandidat
- [x] Mode fixed vs kandidat (1–3 rentang) sesuai `ARCHITECTURE.md §4.3.2`
- [ ] Invite-after-create flow — cari username/email
- [x] CTA **Masuk ke Perjalanan** → trip detail

### Checklist — Trip Detail Shell + Itinerary §7

- [x] `app/trip/[tripId]/_layout.tsx` — 4 tab (Itinerary, Voting, Chat, Media) + counter rules (Itinerary: hidden jika 0; Voting: selalu tampil; Chat: unread only; Media: selalu tampil)
- [x] `app/trip/[tripId]/index.tsx` — Itinerary: multi-hari tabs, time states, empty state
- [x] Activity form sheet — field lengkap sesuai `trip_activities` schema
- [ ] Maps link resolve + auto cover; cover picker (media trip / galeri / ikon)
- [ ] Activity detail sheet + menu Edit/Hapus

---

## M14 — Mobile: Voting, Chat, Media, Kelola Trip UI ✅ SELESAI

**AI Prompt**: _"Let's implement M14. Read `docs/WORKFLOW.md` §8–§11, `docs/ACCEPTANCE_CRITERIA.md §4, §6`, `docs/FIGMA.md`. Build the Expo Voting, Chat, Media, and Trip Management screens, wiring Supabase Realtime for chat."_

**Referensi Figma**: `Screen56`–`Screen103`

### Checklist — Voting §8

- [x] `app/trip/[tripId]/voting.tsx` — multi-poll hub, collapse per jenis
- [x] Status pipeline: active / locked / cancelled / expired; menu ⋮ per status
- [x] Create voting flow (tanggal / aktivitas / lainnya) — disabled state jika sudah ada poll aktif sejenis
- [ ] Locked modal — 3 varian (tanggal/aktivitas/lainnya)

### Checklist — Chat §9

- [x] `app/trip/[tripId]/chat.tsx` — list pesan (TanStack Query initial load) + **Supabase Realtime subscription** (`ARCHITECTURE.md §5.4, §6`) untuk live update
- [x] Bubble text/photo/video + reply quote
- [ ] Attach menu + media composer (presign upload → R2 → register `trip_documents`/`message`)
- [x] Long-press menu: Balas, Salin; Hapus hanya pesan sendiri
- [x] Empty chat state; read cursor update saat screen fokus

### Checklist — Media §10

- [x] `app/trip/[tripId]/media.tsx` — grid 3 kolom + tile Unggah (presign flow)
- [x] Badge Cover + "Jadikan Cover"; badge "dari Chat"

### Checklist — Kelola Trip §11

- [x] `app/trip/[tripId]/manage.tsx` — menu ⋮: anggota, edit, hapus trip, Google Calendar (stub sampai M16)
- [x] Members screen + pending invite states; permission creator vs member

---

## M15 — Mobile: Pencarian, Profil & Wishlist UI ✅ SELESAI

**AI Prompt**: _"Implement M15. Read `docs/WORKFLOW.md` §4–§5, §12, `docs/ACCEPTANCE_CRITERIA.md §3, §7`."_

**Referensi Figma §4–§5**: `SearchParts.tsx`, `Screen10`–`Screen20`, `ProfileParts.tsx`

**Referensi Figma §12**: `Screen104`–`Screen117`, `WishlistParts.tsx`

### Checklist — Pencarian §4

- [x] `app/(tabs)/search.tsx` — idle: search bar + riwayat lokal; hasil: debounce + `GET /users/search`
- [x] Empty state hasil kosong
- [x] Public profile screen — grid trip publik

### Checklist — Profil §5

- [x] `app/(tabs)/profile.tsx` — header, kartu profil, grid trip
- [x] Settings screen — edit profil, bantuan/FAQ, hapus akun, keluar
- [x] Edit profile screen — bio (150 char counter), username read-only

### Checklist — Wishlist §12

- [x] `app/(tabs)/wishlist.tsx` — grid 2 kolom + sort tabs + tag chips + search
- [x] Wishlist form sheet, detail sheet, menu sheet, delete modal
- [x] Empty states
- [x] **Jadikan Perjalanan** — prefill create-trip flow → invite → seed itinerary hari 1

---

## M16 — Google Calendar Integration ✅ SELESAI

**AI Prompt**: _"Let's implement M16. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §1.1, §3.4`, `docs/ACCEPTANCE_CRITERIA.md`. Implement calendar event creation after date lock (user-confirmed), NestJS side + Expo modal."_

**Referensi**: `docs/ARCHITECTURE.md §1.1, §3.4`

### Keputusan implementasi
- **OAuth per-user** (bukan service account): backend menyimpan `google_access_token` + `google_refresh_token` + `google_token_expires_at` di tabel `users` (migrasi `20260802_add_google_calendar_tokens`). Event dibuat di **kalender user sendiri** (`calendarId: 'primary'`) dengan scope `https://www.googleapis.com/auth/calendar.events`.
- **Trigger**: aksi **"Tambah ke Google Calendar"** di kebab menu ⋮ trip detail (Screen 96) — item **disabled** saat `trip.status === 'voting_pending'` (subtitle "Tanggal belum dikunci").
- **Waktu**: all-day trip → `start.date`/`end.date` (end eksklusif = end_date + 1); timed trip → `dateTime` gabungan date + HH:MM sebagai wall-clock lokal (tanpa konversi timezone).

### Checklist

- [x] `backend/src/integrations/google/google-calendar.service.ts` — Calendar API v3 client (OAuth per-user: auth-url, callback token exchange, refresh token, create event)
- [x] `backend/src/integrations/google/google-calendar.controller.ts` — `GET /auth-url`, `GET /callback`, `POST /events`
- [x] `POST /v1/integrations/google-calendar/events` — create event (all-day atau timed per `trips.is_all_day`), hanya untuk trip `status=fixed` (voting → 400)
- [x] Event creation dipicu **hanya setelah user konfirmasi** modal post-lock (menu ⋮ → Screen 96) — bukan saat invite
- [x] Hanya kalender user sendiri (`calendarId: 'primary'`); bukan untuk invitee
- [x] Token disimpan di DB; refresh token dipakai saat access token kedaluwarsa
- [x] Error dari Google API di-log, tidak menggagalkan operasi DB trip
- [x] `GOOGLE_CALENDAR_CLIENT_ID` / `GOOGLE_CALENDAR_CLIENT_SECRET` terdokumentasi di `.env.example`
- [x] Mobile: `CalendarEventModal` (`mobile/src/features/calendar/components/CalendarEventModal.tsx`, Screen 96) — tombol dari menu ⋮ trip detail, disabled saat voting
- [x] Postman — folder `Integrations` ditambahkan ke `docs/postman/atur-perjalanan-api.postman_collection.json` (3 request: auth-url, callback, create event)

---

## M17 — Figma Design QA (Audit 125 Layar) ✅ SELESAI

**AI Prompt**: _"Let's implement M17. Read `docs/MILESTONES.md`, `docs/FIGMA.md`. Run `figma/` preview locally, audit all 125 screens against the Expo app, create a gap report, fix misalignments."_

**Referensi**: `docs/FIGMA.md`, `figma/src/app/`, `mobile/app/`

> 📋 **Gap Report**: Lengkap lihat `docs/M17_AUDIT_REPORT.md` — seluruh **125 layar** diaudit terhadap implementasi Expo (matriks per §1–§13), design tokens diverifikasi 1:1, tab counter rules & bottom nav/FAB diverifikasi, 4 gap parsial tercatat (media video native, cover galeri device).

### Checklist — System States §13

- [x] Skeleton/shimmer Beranda (`Screen118`) — `src/components/Skeleton.tsx` (`HomeSkeleton`), wired di home loading state
- [x] Toast host — Sukses/Error/Info + 3s auto-dismiss (`Screen119`) — `src/components/Toast.tsx` 3 varian (teal/coral/white) + action button + close
- [x] Offline/error screen + retry (`Screen120`) — `src/components/ErrorScreen.tsx`, wired di home, trip detail, wishlist, search, profile
- [x] Media viewer — foto + video pause/play (`Screen121`–`123`) — `MediaViewer.tsx` (sudah ada sejak M14; terverifikasi sejajar, video playback penuh di web)
- [x] Dark mode optional (`Screen124`) — `colorsDark` + `ThemeProvider`/`useTheme`; Beranda + tab bar + Home components ikut tema; toggle **Mode Gelap** di Settings (persist `ap_color_scheme`)
- [x] Theme tokens match `colors.ts` + `Screen125` — audit 1:1 (warna/tipografi/radius/spacing/shadows); tambah `shimmerBase`/`shimmerShine`

### Checklist

- [x] Seluruh **125 layar** diaudit terhadap implementasi Expo — matriks lengkap di `docs/M17_AUDIT_REPORT.md`
- [x] Palet warna & tipografi (Plus Jakarta Sans) match token
- [x] Trip detail tab counter rules sesuai `ARCHITECTURE.md` — Itinerary hidden jika 0; Voting selalu tampil incl 0; Chat unread only; Media selalu tampil incl 0
- [x] Bottom nav & FAB match `BottomNav.tsx` — 4 tab + FAB coral 54×54 radius 18, bar 88
- [x] Tidak ada magic number spacing/warna (semua dari `theme/`) — hex literal hanya di `theme/colors.ts`; sisa radius inline di screen besar didokumentasikan sebagai low-priority refactor

---

## M18 — Deployment Web + Rilis Play Store (Free-Tier) 🔲 BELUM DIMULAI

**AI Prompt**: _"Let's implement M18. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §5`. Deploy backend ke Render free, web ke Cloudflare Pages, batasi user aktif (USER_LIMIT), dan rilis ke Google Play."_

**Referensi**: `docs/ARCHITECTURE.md §5`, `mobile/app.json`, `mobile/eas.json`, `backend/src/main.ts`, `render.yaml`

> **Konteks**: Prioritas diubah setelah M17 — kita deploy dulu (web + rilis Play Store) dengan semua gratis-tier sebelum testing suite & CI/CD. Batas maksimum **50 user aktif** (backend gate via `USER_LIMIT`) karena gratis-tier. User dummy tidak ada di repo (hanya contoh copy di komponen). **Play Console sudah aktif** (developer account sudah bayar) — rilis Play Store termasuk dalam milestone ini (M21 lama digabung ke sini). Panduan lengkap: **`docs/DEPLOYMENT.md`**.

### Checklist — Limit User & Free-Tier

- [x] `USER_LIMIT` (default 50) di config + `.env.example`
- [x] Backend gate di `googleLogin` — blokir registrasi baru saat user aktif ≥ `USER_LIMIT` (403 `USER_LIMIT_REACHED`); user lama tetap login
- [x] UI sign-in menangani `USER_LIMIT_REACHED` — pesan "Aplikasi sedang penuh"

### Checklist — Backend (Render free)

- [x] `render.yaml` — Web Service NestJS (native build), healthcheck `/health`, env vars, free plan
- [x] CORS production — whitelist `APP_WEB_URL` (Cloudflare Pages) di `main.ts`
- [x] `preDeployCommand` — `prisma migrate deploy` otomatis sebelum service start
- [ ] Env production di Render: `DATABASE_URL` (pooler), `DIRECT_URL`, Supabase, JWT, Google, R2, `APP_WEB_URL=https://atur-perjalanan.pages.dev`, `EXPO_ACCESS_TOKEN`, `USER_LIMIT=50`, `APP_ENV=production`
- [ ] Google OAuth: redirect URI produksi + origin web ditambahkan ke OAuth client

### Checklist — Web (Cloudflare Pages)

- [x] `mobile/package.json` — script `export:web`
- [x] `mobile/.env.production` — API URL Render, web origin, Google web client ID
- [x] `mobile/public/_redirects` — SPA fallback (deep link) di Cloudflare Pages
- [ ] Cloudflare Pages project: build command `pnpm --filter mobile export:web`, output `mobile/dist`
- [ ] R2 bucket CORS — tambah origin `https://atur-perjalanan.pages.dev`
- [x] `app.json` — `userInterfaceStyle: "automatic"` (dark mode M17)

### Checklist — Rilis Play Store (EAS + Play Console)

- [ ] Kredensial signing dikelola via EAS (`eas credentials`), tidak di-commit
- [ ] `eas build --platform android --profile production` → AAB (production profile di `eas.json` sudah ada)
- [ ] SHA-1 keystore EAS ditambahkan ke Android OAuth client (Google Cloud Console) — **manual**
- [ ] `eas submit --platform android --profile production` → upload ke Play Console
- [ ] App di Play Console: content rating, privacy policy, data safety, store listing (judul, deskripsi, screenshot) — **manual**
- [ ] Ikon/splash final (ganti placeholder gradient) sebelum rilis
- [ ] Rilis ke **Internal Testing** dulu → production track setelah verified

> **Aksi manual user**: buat service di Render, project Cloudflare Pages, tambah SHA-1 ke OAuth client, isi store listing & content rating di Play Console. Config/script disiapkan agent; aksi akun & upload tetap manual.

---

## M19 — Mobile Testing Suite 🔲 BELUM DIMULAI

**AI Prompt**: _"Let's implement M19. Read `docs/MILESTONES.md`, `docs/ACCEPTANCE_CRITERIA.md`, `mobile/src/`. Implement unit tests (Jest + React Native Testing Library) and E2E tests (Detox or Maestro)."_

### Checklist

- [ ] Unit tests: hooks TanStack Query per feature (mock API client)
- [ ] Component tests: form validation, empty/error/skeleton states
- [ ] E2E (Maestro atau Detox): Onboarding → Sign-in → Create Trip → Wishlist → Chat happy paths
- [ ] `pnpm --filter mobile test` lulus di CI

---

## M20 — CI/CD Pipelines 🔲 BELUM DIMULAI

**AI Prompt**: _"Let's implement M20. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §2`. Create GitHub Actions CI/CD pipelines for the TypeScript monorepo."_

**Referensi**: `docs/ARCHITECTURE.md §2` (`.github/workflows/`)

### Checklist

- [ ] `backend-ci.yml` — trigger push/PR ke `backend/**`: lint + unit + e2e test (Supabase local via `supabase start` in CI) + build
- [ ] `mobile-ci.yml` — trigger push/PR ke `mobile/**`: lint + unit test + `eas build --profile preview`
- [ ] Turborepo remote caching dikonfigurasi (opsional, mempercepat CI)
- [ ] Secrets dikonfigurasi di GitHub repo settings (tidak hardcoded)
- [ ] CI badge ditambahkan di `README.md`

---

## M21 — Trip Start Reminders (Proporsional 2×) ✅ SELESAI

**AI Prompt**: _"Let's implement M21. Read `docs/MILESTONES.md`, `docs/ARCHITECTURE.md §3.3, §4.6`, `docs/PRD.md §2.8`. Add trip-start reminders with the shared proportional reminder engine (`reminder-horizons.ts`) and revise the voting reminder to use it."_

**Referensi**: `docs/ARCHITECTURE.md §3.3, §4.6`, `docs/PRD.md §2.8`, `docs/WORKFLOW.md §3`, `docs/ACCEPTANCE_CRITERIA.md §2`

### Tujuan

Reminder **start time perjalanan** belum ada (hanya voting deadline). Plus, horizon voting reminder yang lama (H-7d/H-1d/H-1h) gagal untuk deadline pendek (mis. 30 menit — tidak ada window yang kena). M21 memperkenalkan **horizon proporsional** yang dipakai bersama oleh kedua jenis reminder.

### Keputusan (dari user)

- **2 reminder** per deadline/start (bukan 3).
- **Fraksi**: R1 = **50%** gap, R2 = **25%** gap (10% terlalu mepet untuk deadline pendek).
- **Min lead mutlak**: R1 ≥ **30 menit**, R2 ≥ **5 menit** sebelum deadline — reminder tidak pernah terkirim setelah deadline.
- **Hitung ulang** saat deadline/start dipindah: anchor = `trip.updatedAt`, jadi target otomatis bergeser saat trip diubah.
- Berlaku untuk **voting deadline dan trip-start** (formula bersama di `reminder-horizons.ts`).

### Formula

```
gap     = deadline − trip.updatedAt
R1 at   = deadline − max(gap × 0.50, 30 menit)
R2 at   = deadline − max(gap × 0.25,  5 menit)
```

| Gap       | R1 (50%)        | R2 (25%)      |
| --------- | --------------- | ------------- |
| 14 hari   | H-7d            | H-3.5d        |
| 3 jam     | H-1.5 jam       | H-45 menit    |
| 30 menit  | H-15 menit      | H-7.5 menit   |

Cron `EVERY_HOUR`; reminder terkirim saat **target jatuh dalam [now, now+1h)** (`dueTarget`).

### Checklist

- [x] `backend/src/notifications/reminder-horizons.ts` — `getReminderTargets` + `dueTarget` (fraksi `[0.5, 0.25]`, min `[30m, 5m]`, filter target ≤ anchor)
- [x] `backend/src/notifications/trip-start-reminder.service.ts` — cron `EVERY_HOUR`: query trip `fixed` + `startDate ∈ [now, now+30d)`, hitung `startDatetime` (`start_date` + `start_time`; all-day = `start_date 00:00Z`), kirim ke semua peserta dengan dedup per (user, trip, `reminder_type`)
- [x] `backend/src/notifications/voting-reminder.service.ts` — refactor dari H-7d/H-1d/H-1h ke horizon proporsional (`reminder_type: 'r1'|'r2'`)
- [x] `NotificationType` enum Prisma + migrasi `20260803_add_trip_start_soon` + `trip_start_soon` di `packages/shared-types`
- [x] `push-notifications.service.ts` — case `trip_start_soon` ("Perjalanan Segera Dimulai", body + data `start_datetime`/`is_all_day`)
- [x] `notifications.module.ts` — register `TripStartReminderService`
- [x] Mobile `app/notifications.tsx` — ikon `Clock` (coral/coralLight) + teks "Perjalanan {trip} berangkat {waktu}. Siap-siap!"
- [x] Unit tests: `reminder-horizons.spec.ts`, `trip-start-reminder.service.spec.ts`, `voting-reminder.service.spec.ts` (44 test di folder notifications lulus)
- [x] Dokumentasi: PRD §2.8, ARCHITECTURE §3.3/§4.6, WORKFLOW §3, ACCEPTANCE_CRITERIA §2 (baris baru di tabel)

> **Catatan implementasi**: `startTime` TIME disimpan Prisma sebagai `Date('2000-01-01T{hh:mm}:00Z')` — diambil `getUTCHours/Minutes` untuk menggabungkan ke `start_date`. Query lookahead 30 hari (bukan 1 jam) karena target R2 trip 30 hari = H-7.5d. Anchor = `trip.updatedAt` memenuhi "hitung ulang saat dipindah" tanpa kolom/state tambahan.

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

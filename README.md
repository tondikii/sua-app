# Atur Perjalanan ✈️

> **Version**: 2.0 (Juli 2026) — Migrasi tech stack ke Full TypeScript. Lihat [Changelog](#-changelog-dokumen).

> Mengubah wacana perjalanan menjadi kenyataan.

Atur Perjalanan adalah aplikasi *trip planner* yang memudahkan kamu dan teman-temanmu untuk merencanakan perjalanan, menyusun *itinerary*, dan berkolaborasi dalam satu platform terpusat.

## ✨ Fitur Utama (MVP)

* **Manajemen Perjalanan:** Hub terpusat perjalanan grup · beranda · buat trip · voting jadwal · itinerary · chat & media · undang teman.
* **Wishlist Aktivitas:** Tabung ide aktivitas impian · filter & prioritas · **Jadikan Perjalanan** jadi trip siap dijalankan.

*(Detail lengkap mengenai MVP dan cara kerja fitur dapat dilihat pada dokumen [PRD](docs/PRD.md) dan [BRIEF](docs/BRIEF.md).)*

## ⚙️ Tech Stack

* **Arsitektur**: Monorepo (Turborepo) — Full TypeScript end-to-end
* **Backend**: NestJS (Node.js) + Prisma ORM
* **Mobile**: Expo (React Native) — satu codebase iOS & Android
* **Database**: PostgreSQL terkelola oleh **Supabase**
* **Realtime**: Supabase Realtime (chat trip live tanpa WebSocket gateway custom)
* **File Storage**: Cloudflare R2 (S3-compatible) — upload via presigned PUT; akses media via presigned GET (1 jam) yang di-generate backend. Tidak memerlukan public `.r2.dev` URL atau custom domain.
* **Integrasi**: Google Sign-In, Google Calendar API (tambah event ke kalender sendiri via menu ⋮ — opsional)

> Riwayat keputusan stack ada di [docs/MILESTONES.md](docs/MILESTONES.md) dan detail arsitektur lengkap di [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 🎨 Desain UI (Figma)

Desain high-fidelity (**125 layar** — termasuk state variants per pipeline) dibuat dengan **Figma Make** dan diekspor ke folder [`figma/`](figma/) di root repo. Jalankan preview lokal:

```bash
cd figma && npm i && npm run dev
```

Registry layar dikelompokkan **§1–§13** di `figma/src/app/App.tsx` (selaras `docs/WORKFLOW.md`). Referensi lengkap: [docs/FIGMA.md](docs/FIGMA.md).

## 📚 Direktori Dokumentasi
Seluruh informasi mendalam terkait produk dan teknis ada di folder `/docs`:

1. [Project Brief](docs/BRIEF.md) - Latar belakang, masalah, dan target audiens.
2. [Product Requirements Document (PRD)](docs/PRD.md).
3. [Workflow](docs/WORKFLOW.md).
4. [Acceptance Criteria](docs/ACCEPTANCE_CRITERIA.md) - Skenario pengujian fitur.
5. [Architecture Blueprint](docs/ARCHITECTURE.md) - Arsitektur DB, Backend, dan Mobile (target state — tidak melacak progress).
6. [Milestones & Roadmap](docs/MILESTONES.md) - Progress development ada di sini.
7. [Figma Design Reference](docs/FIGMA.md) - Design tokens, screen inventory, penghubung ke workflow.

## 🚀 Memulai Pengerjaan

### Prasyarat

| Tools | Versi Minimum |
|-------|---------------|
| [Node.js](https://nodejs.org/) | 20 LTS+ |
| [pnpm](https://pnpm.io/installation) | 9+ |
| [Supabase CLI](https://supabase.com/docs/guides/cli) | latest |
| [Expo CLI](https://docs.expo.dev/more/expo-cli/) | latest (`npx expo`) |
| [EAS CLI](https://docs.expo.dev/eas/) | latest (build/submit — M20) |
| Xcode (untuk build iOS) | 15+ (opsional, jika tidak pakai EAS Build cloud) |
| Android Studio (untuk emulator Android) | Hedgehog (2023.1.1)+ |

### 1. Setup Environment

```bash
# Clone repo
git clone <repo-url>
cd atur-perjalanan

# Install semua dependency (root + backend + mobile) via workspace
pnpm install

# Generate Prisma client (wajib setelah install atau perubahan schema)
pnpm --filter backend prisma:generate

# Buat dua file .env (wajib dua file terpisah)
cp .env.example .env               # Digunakan tooling root (Supabase CLI, dsb.)
cp .env.example backend/.env       # Digunakan NestJS server

# Edit kedua file: isi JWT_SECRET, GOOGLE_CLIENT_ID, SUPABASE_URL,
# SUPABASE_SERVICE_ROLE_KEY, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID,
# R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, dll.
# R2_PUBLIC_URL opsional (hanya referensi internal di DB); akses media ke client
# memakai presigned GET URL — lihat docs/ARCHITECTURE.md §7.
# Generate JWT secret: openssl rand -hex 32
#
# Catatan: Database berjalan di Supabase (cloud), bukan Docker lokal.
# Untuk pengembangan offline, gunakan `supabase start` (Supabase CLI)
# yang menjalankan Postgres lokal di port 54322 — lihat docs/ARCHITECTURE.md §3.
```

### 2. Jalankan Backend

```bash
# Terapkan migrasi Prisma ke database Supabase (cloud atau lokal via `supabase start`)
cd backend
pnpm prisma migrate deploy

# Jalankan NestJS server (port 8080) dalam mode watch
pnpm start:dev
```

Server berjalan di `http://localhost:8080`. Health check: `GET /health`.

### 3. Jalankan Mobile (Expo)

```bash
cd mobile
pnpm install
pnpm start          # membuka Expo Dev Tools (Metro bundler)
```

Scan QR code dengan aplikasi **Expo Go** di HP, atau tekan `i` (iOS Simulator) / `a` (Android Emulator) di terminal.

### 4. Uji API dengan Postman (opsional)

Koleksi Postman ada di `docs/postman/`:

1. Import `atur-perjalanan-api.postman_collection.json` + `atur-perjalanan-local.postman_environment.json`
2. Set `google_id_token`, jalankan **Auth → Google Sign-In**
3. Untuk alur upload media R2: **Uploads** (Presign → PUT) → **Media → Register Document** → **Verify Presigned Download URL**

Detail alur presigned URL: `docs/ARCHITECTURE.md` §7.

### Perintah Berguna

```bash
pnpm -w lint           # Lint seluruh workspace (backend + mobile)
pnpm -w test           # Unit tests seluruh workspace
pnpm --filter backend prisma:studio    # Buka Prisma Studio (GUI DB)
pnpm --filter backend test:e2e         # Integration tests backend
pnpm --filter mobile build:android     # EAS Build Android (M20)
pnpm --filter mobile build:ios         # EAS Build iOS (M20)
```

## 📝 Changelog Dokumen

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 2.1 | Juli 2026 | Media R2: akses download via presigned GET URL (1 jam) dari backend; tidak bergantung public `.r2.dev` / custom domain. |
| 2.0 | Juli 2026 | Migrasi tech stack: Go/Gin/KMP → **NestJS + Expo (React Native)** full TypeScript; DB tetap PostgreSQL namun dikelola **Supabase**; chat pakai **Supabase Realtime**; file upload pakai **Cloudflare R2**. |
| 1.0 | — | Rilis awal dokumentasi (Go/Gin backend, Kotlin Multiplatform mobile). |
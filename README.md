# Atur Perjalanan ✈️

> **Version**: 2.0 (Juli 2026) — Migrasi tech stack ke Full TypeScript. Lihat [Changelog](#-changelog-dokumen).

> Mengubah wacana perjalanan menjadi kenyataan.

Atur Perjalanan adalah aplikasi _trip planner_ yang memudahkan kamu dan teman-temanmu untuk merencanakan perjalanan, menyusun _itinerary_, dan berkolaborasi dalam satu platform terpusat.

## ✨ Fitur Utama (MVP)

- **Manajemen Perjalanan:** Hub terpusat perjalanan grup · beranda · buat trip · voting jadwal · itinerary · chat & media · undang teman.
- **Wishlist Aktivitas:** Tabung ide aktivitas impian · filter & prioritas · **Jadikan Perjalanan** jadi trip siap dijalankan.

_(Detail lengkap mengenai MVP dan cara kerja fitur dapat dilihat pada dokumen [PRD](docs/PRD.md) dan [BRIEF](docs/BRIEF.md).)_

## ⚙️ Tech Stack

- **Arsitektur**: Monorepo (Turborepo) — Full TypeScript end-to-end
- **Backend**: NestJS (Node.js) + Prisma ORM
- **Client**: Expo (React Native + react-native-web) — satu codebase untuk iOS, Android & Web
- **Database**: PostgreSQL terkelola oleh **Supabase**
- **Realtime**: Supabase Realtime (chat trip live tanpa WebSocket gateway custom)
- **File Storage**: Cloudflare R2 (S3-compatible) — upload via presigned PUT; akses media via presigned GET (1 jam) yang di-generate backend. Tidak memerlukan public `.r2.dev` URL atau custom domain.
- **Integrasi**: Google Sign-In, Google Calendar API (tambah event ke kalender sendiri via menu ⋮ — opsional)

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
8. [Deployment Guide](docs/DEPLOYMENT.md) - Langkah deploy backend (Vercel), web (Cloudflare Pages), dan Play Store (EAS).

## 🚀 Memulai Pengerjaan

### Prasyarat

| Tools                                                | Versi Minimum                                    |
| ---------------------------------------------------- | ------------------------------------------------ |
| [Node.js](https://nodejs.org/)                       | 20 LTS+                                          |
| [pnpm](https://pnpm.io/installation)                 | 9+                                               |
| [Supabase CLI](https://supabase.com/docs/guides/cli) | latest                                           |
| [Expo CLI](https://docs.expo.dev/more/expo-cli/)     | latest (`npx expo`)                              |
| [EAS CLI](https://docs.expo.dev/eas/)                | latest (build/submit — M18)                      |
| Xcode (untuk build iOS)                              | 15+ (opsional, jika tidak pakai EAS Build cloud) |
| Android Studio (untuk emulator Android)              | Hedgehog (2023.1.1)+                             |

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
pnpm web            # jalankan target web (http://localhost:8081)
```

Scan QR code dengan aplikasi **Expo Go** di HP, atau tekan `i` (iOS Simulator) / `a` (Android Emulator) / `w` (Web) di terminal. Token autentikasi: native di `expo-secure-store`, web di in-memory + `sessionStorage` (lihat `docs/ARCHITECTURE.md` §5).

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
pnpm --filter mobile build:development:android    # EAS dev build (APK)
pnpm --filter mobile build:development:ios        # EAS dev build (IPA — simulator)
pnpm --filter mobile build:preview:android         # EAS preview build (APK — internal)
pnpm --filter mobile build:preview:ios             # EAS preview build (IPA — internal)
pnpm --filter mobile build:production:android      # EAS production build (AAB — Play Store)
pnpm --filter mobile build:production:ios          # EAS production build (IPA — App Store)
```

## 🚀 Deployment (Free-Tier)

> **Prioritas M18**: deploy backend + web + Play Store dengan semua gratis-tier, batasi **50 user aktif**.

### Arsitektur Production

| Layer | Host | Alamat |
| --- | --- | --- |
| Backend (NestJS) | **Vercel** (serverless) | `https://atur-perjalanan-backend.vercel.app` |
| Web (Expo export) | **Cloudflare Pages** | `https://atur-perjalanan.pages.dev` |
| Database | Supabase (cloud) | project `vclvoovqneuiorpiidqz` |
| Storage | Cloudflare R2 | bucket `atur-perjalanan-media` |

### 1. Backend — Vercel Serverless

```bash
# 1. Push repo ke GitHub
# 2. vercel.com → Add New → Project → import repo
#    Framework: Other | Root: / 
#    Build: corepack enable && pnpm install --frozen-lockfile &&
#           pnpm --filter backend exec prisma migrate deploy &&
#           pnpm --filter backend exec prisma generate &&
#           pnpm --filter backend build
# 3. Isi env vars (Production):
#    DATABASE_URL (pooler :6543, connection_limit=1), DIRECT_URL (:5432),
#    SUPABASE_*, JWT_SECRET, GOOGLE_CLIENT_ID, R2_*, APP_WEB_URL,
#    EXPO_ACCESS_TOKEN, USER_LIMIT=50, APP_ENV=production, CRON_SECRET
# 4. Cron reminder (pengganti @nestjs/schedule): set GitHub Secret CRON_SECRET +
#    Variable VERCEL_BACKEND_URL → workflow cron-reminders.yml POST tiap jam
```

### 2. Web — Cloudflare Pages

```bash
# Local: build production web bundle
cd mobile
cp .env.production .env   # atau set env vars di dashboard Pages
pnpm export:web           # output: mobile/dist

# Cloudflare Pages project:
#   Build command: pnpm --filter mobile export:web
#   Output dir:    mobile/dist
#   Env vars:      EXPO_PUBLIC_API_URL (Vercel), EXPO_PUBLIC_WEB_ORIGIN,
#                  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, EXPO_PUBLIC_SUPABASE_*
```

> **R2 CORS**: tambahkan origin `https://atur-perjalanan.pages.dev` ke bucket CORS (lihat `.env.example`).

### 3. Google OAuth (manual)

- Web client ID → **Authorized redirect origin** `https://atur-perjalanan.pages.dev`
- Android client ID → tambahkan **SHA-1** keystore (dari EAS/Play Console)
- Backend `GOOGLE_CLIENT_ID` + Calendar redirect URI produksi

### 4. Play Store (EAS)

```bash
cd mobile
eas build --platform android --profile production   # → .aab
eas submit --platform android --profile production  # → Play Internal Testing
```

Aksi manual: tambah SHA-1 ke OAuth client, isi store listing & content rating di Play Console (akun developer sudah aktif), privacy policy.

### Limit User Aktif

`USER_LIMIT` (default 50) di env backend. Setelah tercapai, registrasi Google baru ditolak (`USER_LIMIT_REACHED`, pesan "Aplikasi sedang penuh"); user lama tetap login. Ubah tanpa deploy ulang — cukup restart service.

## 📝 Changelog Dokumen

| Versi | Tanggal   | Perubahan                                                                                                                                                                                                  |
| ----- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.1   | Juli 2026 | Media R2: akses download via presigned GET URL (1 jam) dari backend; tidak bergantung public `.r2.dev` / custom domain.                                                                                    |
| 2.0   | Juli 2026 | Migrasi tech stack: Go/Gin/KMP → **NestJS + Expo (React Native)** full TypeScript; DB tetap PostgreSQL namun dikelola **Supabase**; chat pakai **Supabase Realtime**; file upload pakai **Cloudflare R2**. |
| 1.0   | —         | Rilis awal dokumentasi (Go/Gin backend, Kotlin Multiplatform mobile).                                                                                                                                      |

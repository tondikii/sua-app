# 🚀 Panduan Deployment — Atur Perjalanan (M18)

> **Versi**: 2.0 — Agustus 2026
>
> **Tujuan**: Langkah-langkah lengkap deploy **backend (Vercel serverless)** + **web (Cloudflare Pages)** + **rilis Play Store** (EAS). Semua gratis-tier, batas **50 user aktif** (`USER_LIMIT`).

---

## 🧭 Arsitektur Production

| Layer | Host | Alamat |
| --- | --- | --- |
| Backend (NestJS) | **Vercel** (serverless) | `https://atur-perjalanan-backend.vercel.app` |
| Web (Expo export) | **Cloudflare Pages** | `https://atur-perjalanan.pages.dev` |
| Database | Supabase (cloud) | project `vclvoovqneuiorpiidqz` |
| Storage | Cloudflare R2 | bucket `atur-perjalanan-media` |
| Native Android | Google Play (EAS Build) | `id.sudutkode.aturperjalanan` |
| Cron reminders | GitHub Actions / cron-job.org | POST `/v1/cron/reminders` tiap jam |

```
Browser / Android app
        │
        ▼
  ┌─────────────┐   REST /v1/*   ┌──────────────┐   Prisma   ┌───────────┐
  │ Web/Android │ ─────────────► │ Backend Nest │ ──────────► │ Supabase  │
  └─────────────┘                │ (Vercel Fn)  │             │ Postgres  │
        │  ▲                     └──────────────┘             └───────────┘
        │  │ Realtime (WS)               │ presign R2
        │  └──────────────┐              ▼
        │                 │        ┌───────────┐
        ▼                 │        │ Cloudflare│
  Cloudflare Pages        │        │ R2 bucket │
  (web static)            └────────┴───────────┘

  Cron eksternal (GitHub Actions) ──► POST /v1/cron/reminders (tiap jam)
```

---

## 📋 Prasyarat Akun

| Layanan | Status | Catatan |
| --- | --- | --- |
| GitHub | ✅ | Repo `sudutkode/atur-perjalanan` |
| Expo (EAS) | ✅ | projectId `bcdb1df4-20e2-4d40-ad6b-2b62d733c5fd` terdaftar |
| Google Play Console | ✅ | Developer account **sudah aktif (sudah bayar)** |
| Vercel | 🔲 | Daftar gratis di https://vercel.com (Hobby plan) |
| Cloudflare | 🔲 | Daftar gratis di https://dash.cloudflare.com (akun yang sama dengan R2) |
| Google Cloud Console | 🔲 | Sudah punya OAuth client (web + android) — tinggal tambah origin/SHA-1 |

---

# Bagian 1 — Deploy Backend (Vercel Serverless)

## 1.1 Push Repo ke GitHub

```bash
git add -A
git commit -m "m18: migrate backend to vercel serverless + external cron"
git push origin m17   # atau branch kerja kamu
```

> `vercel.json` di root sudah berisi konfigurasi function serverless (`backend/dist/serverless.js`). Tidak ada Docker/Render lagi.

## 1.2 Buat Project di Vercel

1. Buka **vercel.com** → **Add New** → **Project**.
2. Import repo `atur-perjalanan`.
3. **Framework Preset**: `Other` (bukan Next.js).
4. **Root Directory**: `/` (workspace root).
5. **Build Command**:
   ```bash
   corepack enable &&
   pnpm install --frozen-lockfile &&
   pnpm --filter backend exec prisma migrate deploy &&
   pnpm --filter backend exec prisma generate &&
   pnpm --filter backend build
   ```
   > Migrasi Prisma (`prisma migrate deploy`) dijalankan saat **build**, jadi tidak ada pre-deploy command terpisah.
6. **Output Directory**: kosong (function di `backend/dist/serverless.js`).
7. Deploy → dapatkan URL `https://atur-perjalanan-backend.vercel.app` (atau `<project>.vercel.app`).

## 1.3 Environment Variables (Production)

Di Vercel dashboard → Project → **Settings → Environment Variables**, set untuk environment **Production** (+ Preview jika perlu):

| Key | Nilai |
| --- | --- |
| `DATABASE_URL` | Pooler Supabase `postgres://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | Direct `postgres://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:5432/postgres` |
| `SUPABASE_URL` | `https://vclvoovqneuiorpiidqz.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (Supabase dashboard → Settings → API) |
| `SUPABASE_JWT_SECRET` | JWT secret Supabase |
| `SUPABASE_ANON_KEY` | Anon key (untuk Realtime token) |
| `JWT_SECRET` | `openssl rand -hex 32` (App JWT) |
| `GOOGLE_CLIENT_ID` | **Server** OAuth client (verifikasi ID token sign-in) |
| `GOOGLE_MAPS_API_KEY` | Maps key (thumbnail aktivitas) |
| `GOOGLE_CALENDAR_CLIENT_ID` / `GOOGLE_CALENDAR_CLIENT_SECRET` | Calendar OAuth (M16) — tambah redirect URI produksi |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | Cloudflare R2 API token |
| `R2_BUCKET_NAME` | `atur-perjalanan-media` |
| `R2_PUBLIC_URL` | Kosongkan (tidak dipakai client) |
| `SMTP_HOST/PORT/SECURE/USER/PASS/MAIL_FROM` | (Opsional) kirim email undangan |
| `EXPO_ACCESS_TOKEN` | Expo access token (push notif) — kosongkan dulu jika belum |
| `APP_WEB_URL` | `https://atur-perjalanan.pages.dev` |
| `BACKEND_URL` | `https://atur-perjalanan-backend.vercel.app` (redirect URI Google Calendar) |
| `USER_LIMIT` | `50` |
| `APP_ENV` / `NODE_ENV` | `production` |
| `CRON_SECRET` | `openssl rand -hex 32` — **wajib**, dipakai endpoint cron |

> ⚠️ **Serverless best practice**: `DATABASE_URL` memakai `pgbouncer=true&connection_limit=1` (pooler Supabase) — menghindari kebocoran koneksi pada serverless scale-to-zero.

## 1.4 Cron Reminders (pengganti @nestjs/schedule)

Vercel serverless **tidak punya scheduler in-process**. Backend kini mengekspos:

```
POST https://atur-perjalanan-backend.vercel.app/v1/cron/reminders
Header: x-cron-secret: <CRON_SECRET>
```

Endpoint ini menjalankan kedua reminder pass (voting deadline + trip start, proporsional R1/R2).

**Pemicu otomatis** (pilih salah satu, gratis):
1. **GitHub Actions** (sudah disiapkan di repo): `.github/workflows/cron-reminders.yml` — POST tiap jam. Set GitHub Secret `CRON_SECRET` dan Variable `VERCEL_BACKEND_URL`.
2. **cron-job.org** (alternatif): buat job tiap 1 jam, method POST, URL di atas, header `x-cron-secret`.

## 1.5 Verifikasi Backend

```bash
# Health check
curl https://atur-perjalanan-backend.vercel.app/v1/health
# → {"status":"ok"}

# Cron (pastikan CRON_SECRET benar)
curl -X POST -H "x-cron-secret: $CRON_SECRET" \
  https://atur-perjalanan-backend.vercel.app/v1/cron/reminders
# → {"ok":true,...}

# CORS web
curl -i -H "Origin: https://atur-perjalanan.pages.dev" \
  https://atur-perjalanan-backend.vercel.app/v1/health | grep -i access-control
# → Access-Control-Allow-Origin: https://atur-perjalanan.pages.dev
```

> ✅ Serverless scale-to-zero: **tidak ada cold start 50s** seperti Render free — function menyala dalam hitungan detik saat ada request.

---

# Bagian 2 — Deploy Web (Cloudflare Pages)

## 2.1 Build Lokal (opsional, untuk cek)

```bash
cd mobile
pnpm install
pnpm export:web        # output: mobile/dist (termasuk _redirects)
```

## 2.2 Buat Project di Cloudflare Pages

1. Buka **dash.cloudflare.com** → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pilih repo `atur-perjalanan`, branch `m17` (atau production branch).
3. **Build settings**:
   - **Framework preset**: None
   - **Build command**: `pnpm --filter mobile export:web`
   - **Build output directory**: `mobile/dist`
   - **Root directory**: `/` (workspace root)
4. **Environment variables (production)**:

| Key | Nilai |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | `https://atur-perjalanan-backend.vercel.app/v1` |
| `EXPO_PUBLIC_WEB_ORIGIN` | `https://atur-perjalanan.pages.dev` |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | `463752801012-glj7j2ng20md0s52bp1luc3neen1jvdd.apps.googleusercontent.com` |
| `EXPO_PUBLIC_SUPABASE_URL` | `https://vclvoovqneuiorpiidqz.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | anon key (sama dengan dev) |

5. **Deploy** → tunggu build selesai → buka `https://atur-perjalanan.pages.dev`.

> `_redirects` sudah otomatis di `dist/` — deep link (mis. `/trip/xxx`) akan fallback ke `index.html`.

## 2.3 R2 CORS (upload media dari web)

Di **Cloudflare dashboard → R2 → bucket `atur-perjalanan-media` → Settings → CORS**:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:8081",
      "https://atur-perjalanan.pages.dev"
    ],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["Content-Type", "Content-Length", "x-amz-*"],
    "ExposeHeaders": ["ETag", "x-amz-checksum-*", "x-amz-request-id"],
    "MaxAgeSeconds": 3600
  }
]
```

## 2.4 Google OAuth (Web)

Di **Google Cloud Console → Credentials → Web client** (`463752801012-glj7j2ng20md0s52bp1luc3neen1jvdd`):
- **Authorized JavaScript origins**: tambah `https://atur-perjalanan.pages.dev`
- **Authorized redirect URIs**: tambah `https://atur-perjalanan.pages.dev` (expo-auth-session web)

## 2.5 Google Calendar OAuth (Backend production)

Di **Google Cloud Console → Credentials → OAuth client** (yang dipakai `GOOGLE_CALENDAR_CLIENT_ID`):
- **Authorized redirect URIs**: tambah `https://atur-perjalanan-backend.vercel.app/v1/integrations/google-calendar/callback`

## 2.6 Verifikasi Web

1. Buka `https://atur-perjalanan.pages.dev`
2. Sign-in dengan Google → create trip → upload media (cek R2 CORS)
3. Coba deep link: `/trip/<id>` → tetap tampil (SPA fallback)

---

# Bagian 3 — Rilis Play Store (EAS + Play Console)

## 3.1 Prasyarat

- Play Console aktif ✅
- `eas.json` production profile sudah ada (AAB + autoIncrement) ✅
- Login EAS: `npx eas-cli login` (sekali)

## 3.2 Build AAB Production

```bash
cd mobile
cp .env.production .env   # pastikan API URL → Vercel production

# Build AAB (EAS cloud)
npx eas-cli build --platform android --profile production
```

- EAS akan **generate keystore** (pertama kali) — **simpan baik-baik**.
- Output: `*.aab` + URL download.

## 3.3 Ambil SHA-1 & Tambah ke Google OAuth (manual)

```bash
# Setelah build selesai, ambil SHA-1 dari keystore:
keytool -list -v -keystore <keystore>.jks -alias <alias> -storepass <pass> | grep SHA1
```

Di **Google Cloud Console → Credentials → Android client** (`463752801012-d0f7hsgg7f23ft4bacgeki81o5rnr2vf`):
- **Package name**: `id.sudutkode.aturperjalanan` (sudah)
- **SHA-1 certificate fingerprints**: **tambah SHA-1 dari keystore EAS**

> ⚠️ Tanpa SHA-1 ini, Google Sign-In di app native **gagal** (SIGN_IN_FAILED).

## 3.4 Submit ke Play Console

```bash
npx eas-cli submit --platform android --profile production
# → upload AAB ke Play Console (Internal Testing track)
```

## 3.5 Set Up App di Play Console (manual)

1. **Dashboard → buat app**: nama "Atur Perjalanan", package `id.sudutkode.aturperjalanan`.
2. **Testers → Internal testing**: buat grup tester → upload AAB → **Promote**.
3. **Store listing** (wajib sebelum production):
   - Judul: **Atur Perjalanan**
   - Deskripsi pendek: "Rencanakan. Jelajahi. Kenang."
   - Deskripsi lengkap (bahasa Indonesia + Inggris)
   - Screenshot (min 2): ambil dari web/mobile
   - Icon 512×512 (dari `assets/icon.png` final)
   - Feature graphic 1024×500
4. **Content rating**: isi kuesioner → selesai.
5. **Data safety**: deklarasi data yang dikumpulkan (email, nama, foto, lokasi).
6. **Privacy policy URL**: buat halaman sederhana (mis. GitHub Pages / Notion) → isi URL.

## 3.6 Rilis Production

1. **Production track** → **Create new release** → pilih AAB → tunggu review Google (beberapa jam–hari).
2. Setelah approved → app live di Play Store.

> ⚠️ **Sebelum rilis production**, pastikan ikon/splash bukan placeholder gradient (lihat §4).

---

# Bagian 4 — Checklist Sebelum Live

- [ ] Ikon `assets/icon.png`, `adaptive-icon.png`, `splash.png` diganti artwork final (bukan gradient placeholder)
- [ ] `EXPO_ACCESS_TOKEN` di Vercel diisi (push notif jalan)
- [ ] `GOOGLE_CALENDAR_CLIENT_*` redirect URI produksi ditambahkan (fitur M16 di production)
- [ ] `CRON_SECRET` di Vercel env **sama** dengan GitHub Secret `CRON_SECRET`
- [ ] GitHub Variable `VERCEL_BACKEND_URL` di-set (untuk workflow cron)
- [ ] Privacy policy URL valid
- [ ] Store listing lengkap (screenshot, deskripsi, content rating, data safety)
- [ ] Test di device fisik Android: sign-in Google, create trip, upload media, chat realtime
- [ ] Test di browser: sign-in, create trip, upload media (CORS)

---

# 📌 Operasional

## Limit User Aktif (USER_LIMIT)

- Default **50** (env `USER_LIMIT` di Vercel).
- Setelah tercapai: registrasi Google baru ditolak → `USER_LIMIT_REACHED` (pesan "Aplikasi sedang penuh").
- User lama tetap login.
- Ubah batas: edit env di Vercel → redeploy.

## Cron Reminders

- Backend tidak lagi punya scheduler internal (`@nestjs/schedule` dihapus — tidak kompatibel serverless).
- `.github/workflows/cron-reminders.yml` memanggil `POST /v1/cron/reminders` **setiap jam** dengan header `x-cron-secret`.
- Pastikan secret sama di **Vercel env** dan **GitHub Secret**. Jika gagal 401, cek `CRON_SECRET`.

## Update App (native)

```bash
cd mobile
npx eas-cli build --platform android --profile production   # build baru
npx eas-cli submit --platform android --profile production  # upload
```
Versi otomatis naik (`autoIncrement: true` di eas.json).

## Update Web

Push ke branch → Cloudflare Pages auto-rebuild → `https://atur-perjalanan.pages.dev` ter-update.

## Update Backend

Push ke branch → Vercel auto-deploy (build + `prisma migrate deploy`).

## Rollback / Troubleshoot

| Masalah | Solusi |
| --- | --- |
| `prisma migrate deploy` gagal saat build | Cek `DATABASE_URL`/`DIRECT_URL` di Vercel env; pastikan `DIRECT_URL` port 5432 |
| Endpoint cron 401 | `CRON_SECRET` beda antara Vercel & GitHub — samakan |
| Migrasi perlu manual | Jalankan `pnpm --filter backend exec prisma migrate deploy` lokal dengan `DIRECT_URL` production, atau via Vercel CLI |
| Sign-in Google gagal di Android | Cek SHA-1 sudah masuk ke Android OAuth client |
| Upload media gagal di web | Cek R2 CORS (origin pages.dev) |
| CORS API ditolak | Cek `APP_WEB_URL` di Vercel = `https://atur-perjalanan.pages.dev` |
| Reminder tidak terkirim | Cek GitHub Actions cron-reminders (Run history), lalu cek `CRON_SECRET` & `VERCEL_BACKEND_URL` |

---

## 🔗 Referensi

- `vercel.json` — config function serverless (root repo)
- `backend/src/serverless.ts` — entry handler Vercel
- `backend/src/notifications/reminders.controller.ts` — endpoint cron
- `mobile/eas.json` — profile build/submit EAS
- `mobile/.env.production` — env production mobile
- `mobile/public/_redirects` — SPA fallback Cloudflare Pages
- `.github/workflows/cron-reminders.yml` — pemicu cron tiap jam
- `docs/MILESTONES.md` §M18 — checklist milestone

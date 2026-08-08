# Panduan Implementasi M18 — Deployment Web + Rilis Play Store (Free-Tier)

> **Status**: BELUM MULAI — panduan step-by-step paling detail untuk menyelesaikan milestone M18.
>
> **Sumber utama**: `docs/DEPLOYMENT.md` (sudah ada, ringkas), `docs/MILESTONES.md` §M18, `render.yaml`, `mobile/eas.json`, `backend/src/main.ts`.
>
> **Catatan deploy target**: backend default **Render free** (sesuai milestone). Lihat **§5** untuk analisa mendalam "Render vs Vercel" sebelum memutuskan.

---

## 📌 Ringkasan Target M18

| Layer | Host | Alamat |
| --- | --- | --- |
| Backend (NestJS) | **Render.com** (free) | `https://atur-perjalanan-backend.onrender.com` |
| Web (Expo export) | **Cloudflare Pages** | `https://atur-perjalanan.pages.dev` |
| Database | Supabase (cloud) | project `vclvoovqneuiorpiidqz` |
| Storage | Cloudflare R2 | bucket `atur-perjalanan-media` |
| Native Android | Google Play (EAS Build) | `id.sudutkode.aturperjalanan` |

**Arsitektur**:
```
Browser / Android app
        │
        ▼
  ┌─────────────┐   REST /v1/*   ┌──────────────┐   Prisma   ┌───────────┐
  │ Web/Android │ ─────────────► │ Backend Nest │ ──────────► │ Supabase  │
  └─────────────┘                │ (Render free)│             │ Postgres  │
        │  ▲                     └──────────────┘             └───────────┘
        │  │ Realtime (WS)               │ presign R2
        │  └──────────────┐              ▼
        │                 │        ┌───────────┐
        ▼                 │        │ Cloudflare│
  Cloudflare Pages        │        │ R2 bucket │
  (web static)            └────────┴───────────┘
```

---

## 🧰 Prasyarat Akun

| Layanan | Status | Catatan |
| --- | --- | --- |
| GitHub | ✅ | Repo `sudutkode/atur-perjalanan` |
| Expo (EAS) | ✅ | projectId `bcdb1df4-20e2-4d40-ad6b-2b62d733c5fd` |
| Google Play Console | ✅ | Developer account sudah aktif (sudah bayar) |
| Render.com | 🔲 | Daftar gratis di https://render.com |
| Cloudflare | 🔲 | Akun yang sama dengan R2 (dash.cloudflare.com) |
| Google Cloud Console | 🔲 | OAuth client (web + android) sudah ada, tinggal tambah origin/SHA-1 |

---

# Bagian 1 — Deploy Backend ke Render (Free)

## 1.1 Persiapan & Push Repo

```bash
# Dari root repo
git status                    # pastikan working tree bersih / hanya perubahan deploy
git add -A
git commit -m "m18: deployment config (render, pages, user limit)"
git push origin m17           # atau branch kerja kamu
```

> `render.yaml` di root repo sudah berisi Web Service + env vars + release command. Pastikan file ini ter-push.

## 1.2 Buat Web Service via Blueprint (paling mudah)

1. Buka **render.com** → **New** → **Blueprint**.
2. Pilih repo **atur-perjalanan**.
3. Render membaca `render.yaml` → muncul service **atur-perjalanan-backend** dengan plan **free**.
4. Klik **Apply** → build dimulai otomatis.

> **Alternatif manual (tanpa Blueprint)**: Render → **New** → **Web Service** → pilih repo → pilih **Node** runtime, root directory `/`, build command dari `render.yaml`, start command `node backend/dist/main`, healthcheck `/health`.

## 1.3 Isi Environment Variables (manual — Render tidak meng-copy nilai rahasia)

Di dashboard service → **Environment**, set nilai-nilai ini (semua `sync: false` di blueprint = harus diisi manual):

### Wajib (Database & Auth)
| Key | Nilai | Catatan |
| --- | --- | --- |
| `DATABASE_URL` | Pooler Supabase `postgres://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10` | Ambil di Supabase → Settings → Database |
| `DIRECT_URL` | Direct `postgres://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:5432/postgres` | Untuk Prisma migrate |
| `SUPABASE_URL` | `https://vclvoovqneuiorpiidqz.supabase.co` | |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | Supabase → Settings → API |
| `SUPABASE_JWT_SECRET` | JWT secret Supabase | Supabase → Settings → API |
| `SUPABASE_ANON_KEY` | Anon key | Untuk Realtime token |
| `JWT_SECRET` | `openssl rand -hex 32` | App JWT (jangan pakai nilai lama dari .env) |
| `GOOGLE_CLIENT_ID` | **Server** OAuth client ID | Verifikasi ID token sign-in |

### Opsional tapi disarankan
| Key | Nilai | Catatan |
| --- | --- | --- |
| `GOOGLE_MAPS_API_KEY` | Maps key | Thumbnail aktivitas/wishlist |
| `GOOGLE_CALENDAR_CLIENT_ID` / `GOOGLE_CALENDAR_CLIENT_SECRET` | Calendar OAuth (M16) | Tambah redirect URI produksi |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | R2 API token | Cloudflare |
| `R2_BUCKET_NAME` | `atur-perjalanan-media` | |
| `R2_PUBLIC_URL` | *(kosongkan)* | Tidak dipakai client — semua via presign |
| `SMTP_HOST` / `PORT` / `SECURE` / `USER` / `PASS` / `MAIL_FROM` | *(opsional)* | Kirim email undangan |
| `EXPO_ACCESS_TOKEN` | Expo token | Push notification (isi nanti sebelum live) |

### Sudah di-set default di render.yaml (tidak perlu diubah)
- `NODE_ENV=production`
- `APP_ENV=production`
- `PORT=8080`
- `APP_WEB_URL=https://atur-perjalanan.pages.dev`
- `USER_LIMIT=50`

> ⚠️ **Penting**: `render.yaml` sudah menyertakan `releaseCommand` → `prisma migrate deploy` berjalan otomatis sebelum service start. Verifikasi di dashboard → **Settings → Lifecycle**.

## 1.4 Verifikasi Backend

```bash
# Health check — pertama kali bisa lambat (~50s) karena free tier spin-up
curl https://atur-perjalanan-backend.onrender.com/health
# → {"status":"ok"} (atau respons 200)

# CORS web
curl -i -H "Origin: https://atur-perjalanan.pages.dev" \
  https://atur-perjalanan-backend.onrender.com/health | grep -i access-control
# → Access-Control-Allow-Origin: https://atur-perjalanan.pages.dev
```

> ⚠️ **Render free**: service tidur setelah ~15 menit idle → request pertama lambat (~50s boot). Acceptable untuk ≤50 user.

---

# Bagian 2 — Deploy Web ke Cloudflare Pages

## 2.1 Build Lokal (opsional, untuk cek dulu)

```bash
cd mobile
pnpm install
pnpm export:web        # output: mobile/dist (termasuk _redirects)
```

## 2.2 Buat Project di Cloudflare Pages

1. Buka **dash.cloudflare.com** → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pilih repo **atur-perjalanan**, branch `m17` (atau production branch).
3. **Build settings**:
   - **Framework preset**: None
   - **Build command**: `pnpm --filter mobile export:web`
   - **Build output directory**: `mobile/dist`
   - **Root directory**: `/` (workspace root)
4. **Environment variables (production)**:

| Key | Nilai |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | `https://atur-perjalanan-backend.onrender.com/v1` |
| `EXPO_PUBLIC_WEB_ORIGIN` | `https://atur-perjalanan.pages.dev` |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | `463752801012-glj7j2ng20md0s52bp1luc3neen1jvdd.apps.googleusercontent.com` |
| `EXPO_PUBLIC_SUPABASE_URL` | `https://vclvoovqneuiorpiidqz.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | anon key (sama dengan dev) |

5. **Deploy** → tunggu build selesai → buka `https://atur-perjalanan.pages.dev`.

> `_redirects` (SPA fallback) otomatis masuk ke `dist/` — deep link `/trip/xxx` akan fallback ke `index.html`.

## 2.3 Konfigurasi R2 CORS (untuk upload media dari web)

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
- **Authorized redirect URIs**: tambah `https://atur-perjalanan.pages.dev`

## 2.5 Verifikasi Web

1. Buka `https://atur-perjalanan.pages.dev`.
2. Sign-in dengan Google → create trip → upload media (cek R2 CORS).
3. Coba deep link: `/trip/<id>` → tetap tampil (SPA fallback).

---

# Bagian 3 — Rilis Play Store (EAS + Play Console)

## 3.1 Prasyarat

- Play Console aktif ✅
- `eas.json` production profile sudah ada (AAB + autoIncrement) ✅
- Login EAS: `npx eas-cli login` (sekali)

## 3.2 Build AAB Production

```bash
cd mobile
cp .env.production .env   # pastikan API URL → Render production

# Build AAB (EAS cloud) — EAS akan generate keystore pertama kali
npx eas-cli build --platform android --profile production
```

- EAS akan **generate keystore** (pertama kali) — **simpan baik-baik** (download & backup).
- Output: `*.aab` + URL download.

## 3.3 Ambil SHA-1 & Tambah ke Google OAuth (manual)

```bash
# Setelah build selesai, ambil SHA-1 dari keystore:
# (di dashboard EAS build, atau dari keystore lokal yang di-download)
keytool -list -v -keystore <keystore>.jks -alias <alias> -storepass <pass> | grep SHA1
```

Di **Google Cloud Console → Credentials → Android client** (`463752801012-d0f7hsgg7f23ft4bacgeki81o5rnr2vf`):
- **Package name**: `id.sudutkode.aturperjalanan` (sudah)
- **SHA-1 certificate fingerprints**: **tambah SHA-1 dari keystore EAS**

> ⚠️ Tanpa SHA-1 ini, Google Sign-In di app native **gagal** (`SIGN_IN_FAILED`).

## 3.4 Submit ke Play Console

```bash
npx eas-cli submit --platform android --profile production
# → upload AAB ke Play Console (Internal Testing track)
```

## 3.5 Set Up App di Play Console (manual)

1. **Dashboard → buat app**: nama "Atur Perjalanan", package `id.sudutkode.aturperjalanan`.
2. **Testers → Internal testing**: buat grup tester (email Google kamu + teman) → upload AAB → **Promote**.
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
- [ ] `EXPO_ACCESS_TOKEN` di Render diisi (push notif jalan)
- [ ] `GOOGLE_CALENDAR_CLIENT_*` redirect URI produksi ditambahkan (fitur M16 di production)
- [ ] Privacy policy URL valid
- [ ] Store listing lengkap (screenshot, deskripsi, content rating, data safety)
- [ ] Test di device fisik Android: sign-in Google, create trip, upload media, chat realtime
- [ ] Test di browser: sign-in, create trip, upload media (CORS)

---

# Bagian 5 — Analisa: Render vs Vercel untuk Backend NestJS

## 5.1 Ringkasan perbandingan

| Kriteria | **Render (free)** | **Vercel (Hobby)** |
| --- | --- | --- |
| **Model runtime** | Web Service — **long-running Node.js** | Serverless Functions (AWS Lambda) |
| **Harga** | $0 (free instance) | $0 (Hobby, non-komersial) |
| **Cold start** | ~50–60s (free spin-down 15 menit) | ~0.5–5s per cold function |
| **Idle behavior** | Spin-down setelah 15 menit idle | Functions di-scale-to-zero saat idle |
| **Cron / background job** | ✅ Jalan saat service awake (spin-up dulu) | ❌ **Hobby: max 1 cron/hari** (butuh Pro untuk hourly) |
| **WebSocket server** | ✅ Bisa (long-running) | ❌ Sulit (serverless, perlu adapter/solusi) |
| **Ephemeral filesystem** | ✅ (hilang saat redeploy, seperti semua) | ✅ (read-only) |
| **Build monorepo (pnpm workspaces)** | ✅ `pnpm install --frozen-lockfile` | ⚠️ Butuh config khusus (root + output dir) |
| **Prisma migrate deploy** | ✅ `releaseCommand` (render.yaml) | ⚠️ Via build/`vercel.json` + Lambda (tidak ada release command) |
| **Upload file / streaming** | ✅ Long-running | ⚠️ Batas payload Lambda (biasanya 4.5MB, perlu tuning) |
| **Rate limit / throttling** | ✅ In-process | ⚠️ Per-instance, tidak global |
| **Uptime garantir** | Rendah (free, bisa suspend) | Tinggi (edge network) |

## 5.2 Analisa spesifik untuk project ini

**Yang mendukung Render:**
1. **Cron `EVERY_HOUR` di `notifications/`** (`trip-start-reminder.service.ts`, `voting-reminder.service.ts`). Ini **hard requirement** — Vercel Hobby hanya mengizinkan **1 cron per hari**, jadi reminder M9/M21 **tidak akan jalan** di Vercel tanpa upgrade Pro ($20/bln). Ini blokir utama.
2. **Backend ini long-running Node.js** (NestJS + Prisma + `@nestjs/schedule`) — desain asli `render.yaml` + `Dockerfile` sudah matang untuk web service.
3. **`releaseCommand` untuk `prisma migrate deploy`** — Vercel tidak punya konsep release command; harus trik build script, rawan race condition.
4. **Backend ini TIDAK memakai WebSocket server sendiri** (realtime via Supabase client-side), jadi bukan masalah — tapi ini hanya **mengurangi minus** Vercel, tidak menghilangkan masalah cron.

**Yang mendukung Vercel:**
1. **Cold start jauh lebih cepat** (~detik vs ~50s) — UX web lebih responsif.
2. **Uptime & scaling lebih baik** — tidak ada spin-down 15 menit.
3. **Satu ekosistem** — kalau web juga di Vercel, bisa satu platform.

**Yang menghalangi Vercel (konkret):**
- Cron hourly **ditolak deploy** di Hobby (`Hobby accounts are limited to daily cron jobs`).
- Butuh refactor `ScheduleModule` → Vercel Cron + secret header + pemanggilan HTTP endpoint — pekerjaan ekstra, dan tetap tidak menyelesaikan kebutuhan hourly tanpa Pro.
- Vercel Hobby = **non-komersial**; project ini dirilis ke Play Store (komersial) — melanggar ToS Hobby.

## 5.3 Kesimpulan

> **✅ Tetap pakai Render (free)** sebagai host backend untuk M18 — sesuai rencana milestone.
>
> Alasan utama: (1) **cron hourly reminder** tidak bisa jalan di Vercel Hobby, (2) `render.yaml` + `releaseCommand` sudah siap tanpa refactor, (3) Vercel Hobby ToS melarang project komersial seperti rilis Play Store.
>
> **Kapan pindah ke Vercel?** Jika suatu saat naik ke **Vercel Pro** ($20/bln) — maka cron hourly bisa, cold start lebih baik, dan bisa migrate. Tapi untuk free-tier saat ini, **Render adalah pilihan yang benar**.
>
> **Rekomendasi mitigasi Render free**: untuk menekan cold start 50s, tambahkan **uptime pinger** (mis. cron dari Cloudflare Workers atau GitHub Actions setiap 10 menit) yang menembak `/health` — gratis dan membuat service jarang tidur.

---

# 📌 Operasional

## Limit User Aktif (USER_LIMIT)

- Default **50** (env `USER_LIMIT` di Render).
- Setelah tercapai: registrasi Google baru ditolak → `USER_LIMIT_REACHED` (pesan "Aplikasi sedang penuh").
- User lama tetap login.
- Ubah batas: edit env di Render → **Deploy** (restart service) — tanpa ubah code.

## Update App (native)

```bash
cd mobile
npx eas-cli build --platform android --profile production   # build baru
npx eas-cli submit --platform android --profile production  # upload
```
Versi otomatis naik (`autoIncrement: true` di eas.json).

## Update Web

Push ke branch → Cloudflare Pages auto-rebuild → `https://atur-perjalanan.pages.dev` ter-update.

## Rollback / Troubleshoot

| Masalah | Solusi |
| --- | --- |
| Backend lambat pertama kali | Render free sleep — buka dashboard → Manual Deploy → Clear build cache & redeploy, atau tunggu |
| Sign-in Google gagal di Android | Cek SHA-1 sudah masuk ke Android OAuth client |
| Upload media gagal di web | Cek R2 CORS (origin pages.dev) |
| CORS API ditolak | Cek `APP_WEB_URL` di Render = `https://atur-perjalanan.pages.dev` |
| Migrasi gagal | Cek `DATABASE_URL`/`DIRECT_URL` benar; `prisma migrate deploy` di Release Command |
| Push notification tidak jalan | Isi `EXPO_ACCESS_TOKEN` di Render env |
| Reminder tidak terkirim | Cek cron jalan (service harus awake) — pakai uptime pinger |

---

## 🔗 Referensi

- `render.yaml` — blueprint Render (root repo)
- `backend/Dockerfile` — opsi container alternatif
- `mobile/eas.json` — profile build/submit EAS
- `mobile/.env.production` — env production mobile
- `mobile/public/_redirects` — SPA fallback Cloudflare Pages
- `docs/MILESTONES.md` §M18 — checklist milestone
- [Render — Deploy for Free (docs resmi)](https://render.com/docs/free)
- [Vercel — Cron Jobs usage & pricing (docs resmi)](https://vercel.com/docs/cron-jobs/usage-and-pricing)

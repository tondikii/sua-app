# Atur Perjalanan ✈️

> Mengubah wacana perjalanan menjadi kenyataan.

Atur Perjalanan adalah aplikasi *trip planner* yang memudahkan kamu dan teman-temanmu untuk merencanakan perjalanan, menyusun *itinerary*, dan berkolaborasi dalam satu platform terpusat.

## ✨ Fitur Utama (MVP)
* **Manajemen Perjalanan:** Susun itinerary (aktivitas berjadwal + waktu), voting multi-tipe, media/cover perjalanan, dan kolaborasi grup.
* **Kolaborasi & Chat:** Undang teman (username/email — perlakuan sama) dan diskusi di grup chat internal perjalanan.
* **Profil & Pencarian:** Profil pengguna dengan grid perjalanan publik; cari user untuk undangan trip.
* **Wishlist Aktivitas:** Simpan aktivitas impian (waktu, Maps, prioritas) — filter/sort, lalu **Jadikan Perjalanan** untuk konversi ke trip + itinerary.

*(Detail lengkap mengenai MVP dan cara kerja fitur dapat dilihat pada dokumen [PRD](docs/PRD.md)).*

## ⚙️ Tech Stack
* **Arsitektur**: Monorepo
* **Backend**: Go (Gin Framework)
* **Mobile**: Kotlin Multiplatform (KMP)
* **Database**: PostgreSQL
* **Integrasi**: Google Sign-In, Google Calendar API (tambah event ke kalender sendiri via menu ⋮ — opsional)

## 🎨 Desain UI (Figma)

Desain high-fidelity (**125 layar** — termasuk state variants per pipeline) diekspor ke folder [`figma/`](figma/). Jalankan preview lokal:

```bash
cd figma && npm i && npm run dev
```

Registry layar dikelompokkan **§1–§13** di `figma/src/app/App.tsx` (selaras `docs/WORKFLOW.md`). Referensi lengkap: [docs/FIGMA.md](docs/FIGMA.md).

## 📚 Direktori Dokumentasi
Seluruh informasi mendalam terkait produk dan teknis ada di folder `/docs`:

1. [Project Brief](docs/BRIEF.md) - Latar belakang, masalah, dan target audiens.
2. [Product Requirements Document (PRD)](docs/PRD.md) - Spesifikasi lengkap MVP.
3. [Workflow](docs/WORKFLOW.md) - Alur kerja aplikasi selaras dengan 125 layar Figma (§1–§13).
4. [Acceptance Criteria](docs/ACCEPTANCE_CRITERIA.md) - Skenario pengujian fitur (Checklist UAT).
5. [Architecture Blueprint](docs/ARCHITECTURE.md) - Skema DB (§3), **35 endpoint implemented** + gap M5.2 (§4.3), pola Go/KMP.
6. [Milestones & Roadmap](docs/MILESTONES.md) - M0–M5.1 ✅ · **M5.2 design parity BE** 🔜 · M6+ mobile.
7. [Figma Design Reference](docs/FIGMA.md) - Design tokens, screen inventory (125 layar), gap API, panduan AI agent, dan mapping ke workflow.

## 🚀 Memulai Pengerjaan

### Prasyarat

| Tools | Versi Minimum |
|-------|---------------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | 4.x |
| [Go](https://go.dev/dl/) | 1.23+ |
| [golang-migrate CLI](https://github.com/golang-migrate/migrate/tree/master/cmd/migrate) | latest |
| [Android Studio](https://developer.android.com/studio) | Hedgehog (2023.1.1)+ |
| JDK | 17+ |

### 1. Setup Environment

```bash
# Clone repo
git clone <repo-url>
cd atur-perjalanan

# Buat dua file .env (wajib dua file terpisah)
cp .env.example .env            # Digunakan Docker Compose
cp .env.example backend/.env    # Digunakan Go server

# Edit kedua file: isi JWT_SECRET, GOOGLE_CLIENT_ID, dll.
# Generate JWT secret: openssl rand -hex 32
#
# Catatan: Docker Postgres memakai port host 5433 (bukan 5432) agar tidak
# bentrok dengan PostgreSQL lokal di Mac. DBeaver: localhost:5433.
```

### 2. Jalankan Backend

```bash
# Start PostgreSQL (Docker)
make up

# Tunggu ~5 detik, lalu jalankan migrasi
make migrate-up

# Jalankan Go server (port 8080)
make run
```

Server berjalan di `http://localhost:8080`. Health check: `GET /health`.

### 3. Jalankan Mobile (Android)

```bash
# Buka project mobile di Android Studio
# File > Open > pilih folder mobile/
```

Di Android Studio: sync Gradle → pilih device/emulator → Run.

### Perintah Berguna (Makefile)

```bash
make help           # Lihat semua perintah
make up             # Start Docker (PostgreSQL)
make down           # Stop Docker
make migrate-up     # Terapkan semua migrasi
make migrate-down   # Rollback 1 migrasi terakhir
make run             # Jalankan backend
make test            # Jalankan unit tests (race + coverage)
make test-integration # Jalankan integration tests (butuh TEST_DATABASE_URL)
make lint            # Jalankan go vet
make build           # Compile binary ke backend/bin/api
```

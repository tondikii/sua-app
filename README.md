# Atur Perjalanan ✈️

> Mengubah wacana perjalanan menjadi kenyataan.

Atur Perjalanan adalah aplikasi *trip planner* yang memudahkan kamu dan teman-temanmu untuk merencanakan perjalanan, menyusun *itinerary*, dan berkolaborasi dalam satu platform terpusat.

## ✨ Fitur Utama (MVP)
* **Manajemen Perjalanan:** Susun jadwal, destinasi, dan *tagging* perjalanan (termasuk voting tanggal).
* **Kolaborasi & Chat:** Undang teman (via *username*/email) dan diskusi langsung di grup chat internal perjalanan.
* **Sosial:** Sistem saling *follow*, profil privat/publik (Instagram-style), dan grid perjalanan di profil.
* **Wishlist:** Simpan dan urutkan destinasi impian berdasarkan prioritas.

*(Detail lengkap mengenai MVP dan cara kerja fitur dapat dilihat pada dokumen [PRD](docs/PRD.md)).*

## ⚙️ Tech Stack
* **Arsitektur**: Monorepo
* **Backend**: Go (Gin Framework)
* **Mobile**: Kotlin Multiplatform (KMP)
* **Database**: PostgreSQL
* **Integrasi**: Google Sign-In, Google Calendar API

## 🎨 Desain UI (Figma)

Desain high-fidelity (32 layar) diekspor ke folder [`figma/`](figma/). Jalankan preview lokal:

```bash
cd figma && npm i && npm run dev
```

Referensi lengkap: [docs/FIGMA.md](docs/FIGMA.md) — design tokens, inventori layar, dan mapping ke workflow/API.

## 📚 Direktori Dokumentasi
Seluruh informasi mendalam terkait produk dan teknis ada di folder `/docs`:

1. [Project Brief](docs/BRIEF.md) - Latar belakang, masalah, dan target audiens.
2. [Product Requirements Document (PRD)](docs/PRD.md) - Spesifikasi lengkap MVP.
3. [Workflow](docs/WORKFLOW.md) - Alur kerja aplikasi selaras dengan 32 layar Figma.
4. [Acceptance Criteria](docs/ACCEPTANCE_CRITERIA.md) - Skenario pengujian fitur (Checklist UAT).
5. [Architecture Blueprint](docs/ARCHITECTURE.md) - Struktur monorepo, pola arsitektur kode (Go & KMP), serta skema database lengkap.
6. [Milestones & Roadmap](docs/MILESTONES.md) - Peta jalan pengembangan dari setup (M0) hingga Play Store release (M15), dengan checklist aksi per milestone. Setiap milestone dapat dikerjakan oleh AI agent secara mandiri.
7. [Figma Design Reference](docs/FIGMA.md) - Design tokens, screen inventory (32 layar), gap API, panduan AI agent, dan mapping ke workflow.

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
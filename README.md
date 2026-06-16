# Atur Perjalanan ✈️

> Mengubah wacana perjalanan menjadi kenyataan.

Atur Perjalanan adalah aplikasi *trip planner* yang memudahkan kamu dan teman-temanmu untuk merencanakan perjalanan, menyusun *itinerary*, dan berkolaborasi dalam satu platform terpusat.

## ✨ Fitur Utama (MVP)
* **Manajemen Perjalanan:** Susun jadwal, destinasi, dan *tagging* perjalanan (termasuk voting tanggal).
* **Kolaborasi & Chat:** Undang teman (via *username*/email) dan diskusi langsung di grup chat internal perjalanan.
* **Sosial:** Sistem saling *follow* dan intip riwayat perjalanan pengguna lain.
* **Wishlist:** Simpan dan urutkan destinasi impian berdasarkan prioritas.

*(Detail lengkap mengenai MVP dan cara kerja fitur dapat dilihat pada dokumen [PRD](docs/PRD.md)).*

## ⚙️ Tech Stack
* **Arsitektur**: Monorepo
* **Backend**: Go (Gin Framework)
* **Mobile**: Kotlin Multiplatform (KMP)
* **Database**: PostgreSQL
* **Integrasi**: Google Sign-In, Google Calendar API

## 📚 Direktori Dokumentasi
Seluruh informasi mendalam terkait produk dan teknis ada di folder `/docs`:

1. [Project Brief](docs/BRIEF.md) - Latar belakang, masalah, dan target audiens.
2. [Product Requirements Document (PRD)](docs/PRD.md) - Spesifikasi lengkap MVP.
3. [Workflow](docs/WORKFLOW.md) - Alur kerja aplikasi dan UI/UX guidelines untuk Figma.
4. [Acceptance Criteria](docs/ACCEPTANCE_CRITERIA.md) - Skenario pengujian fitur (Checklist UAT).
5. [Architecture Blueprint](docs/ARCHITECTURE.md) - Struktur monorepo, pola arsitektur kode (Go & KMP), serta skema database lengkap.

## Desain
https://capri-spring-88160657.figma.site

## 🚀 Memulai Pengerjaan
*(Instruksi setup environment lokal, CI/CD, dan Docker akan ditambahkan di sini).*
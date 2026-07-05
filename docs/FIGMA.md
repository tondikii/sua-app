# Figma Design Reference — Atur Perjalanan

> **Tujuan dokumen ini**: 
> - Untuk AI agents: Menjadi sumber kebenaran utama screen inventory, design tokens, dan mapping ke workflow/API sebelum mengimplementasikan atau mengaudit layar UI (M7–M12).
> - Untuk product team: Dokumentasi lengkap palet warna, spacing, tipografi, dan **112 layar** high-fidelity — referensi saat design review atau perubahan brand.

---

## 📦 Sumber Desain Lokal

Desain diekspor dari Figma Make dan disimpan di folder **`figma/`** di root monorepo.

| Sumber | Path / URL | Keterangan |
|--------|------------|------------|
| **Code bundle (lokal)** | `figma/` | **112 layar** high-fidelity sebagai React preview (state variants per pipeline). **Sumber kebenaran utama** untuk screen inventory & design tokens. |
| **Design tokens (kode)** | `figma/src/app/components/colors.ts` | Palet warna, font, avatar colors (`C`, `AVATAR_COLORS`, `FONT`). |
| **Screen registry** | `figma/src/app/App.tsx` | **112 layar** dikelompokkan **§1–§13** selaras `docs/WORKFLOW.md`. Counter header otomatis dari registry. |
| **Shared trip UI** | `figma/src/app/components/trip/` | `TripDetailParts`, `ItineraryParts`, `ActivityParts`, `VotingParts`, `ChatParts`, `InviteParts`, `WishlistParts`, dll. |
| **Figma Editor** | https://www.figma.com/design/tFarpj9aEUL64GrDd1jGU5/Atur-Perjalanan | File desain asli (memerlukan akses Figma). |
| **Figma Preview (live)** | https://capri-spring-88160657.figma.site | Preview browser — alternatif jika bundle lokal belum dijalankan. |

### Menjalankan Preview Lokal

```bash
cd figma
npm i
npm run dev
```

Buka URL Vite (biasanya `http://localhost:5173`) untuk melihat seluruh **112 layar** dalam phone frame, dikelompokkan per §1–§13.

> **Untuk AI Agent**: Prioritaskan inspeksi `figma/src/app/App.tsx`, `figma/src/app/components/screens/`, dan `colors.ts`.

---

## 🎨 Design Tokens

Nilai di bawah ini diambil dari `figma/src/app/components/colors.ts` dan `Screen32DesignTokens.tsx`. Implementasikan di `mobile/androidApp/.../ui/theme/`.

### Color Palette

| Token Name | HEX | Penggunaan |
|------------|-----|------------|
| `ColorCoral` (Primary) | `#FF6B6B` | Active tab, primary button, CTA, bubble chat sendiri |
| `ColorCoralLight` | `#FFF0F0` | Background highlight, badge unread |
| `ColorCoralDark` | `#E85555` | Pressed state primary button |
| `ColorTeal` (Secondary) | `#4ECDC4` | Secondary accent, tag chips, banner sukses |
| `ColorTealLight` | `#EDF9F8` | Background tag chip, ikon secondary |
| `ColorCharcoal` | `#1A1A2E` | Teks utama, judul |
| `ColorMuted` | `#9091A0` | Placeholder, label sekunder, tab inactive |
| `ColorMutedLight` | `#B8B9C6` | Hint text, timestamp |
| `ColorBorder` | `#EBEBF2` | Divider, stroke card/input |
| `ColorLight` | `#F7F7FB` | Background layar sekunder |
| `BackgroundPrimary` | `#FFFFFF` | Background layar utama |
| `ColorDanger` | `#F94141` | Validasi gagal, aksi destruktif |
| `ShadowColor` | `rgba(26,26,46,0.08)` | Elevation shadow default |

**Avatar palette** (`AVATAR_COLORS`): `#FF6B6B`, `#4ECDC4`, `#FFB347`, `#8B7CF6`, `#60A5FA`, `#F472B6`

**Brand philosophy**: Palette *Sunset & Beach* — Pure white canvas, charcoal text, Warm Coral primary, Soft Teal secondary.

### Typography

Font: **Plus Jakarta Sans** (`figma/src/styles/fonts.css`)

| Style | Weight | Size | Penggunaan |
|-------|--------|------|------------|
| `H1` | Bold 800 | 24sp | Judul halaman |
| `H2` | SemiBold 700 | 18sp | Judul section, card title |
| `H3` | Medium 600 | 15sp | Sub-judul, label form |
| `Body` | Regular 400 | 14sp | Teks isi utama |
| `Caption` | Medium 500 | 12sp | Timestamp, metadata, badge |

### Komponen Navigasi

Bottom Navigation Bar (`figma/src/app/components/BottomNav.tsx`):

| Posisi | Label | Ikon |
|--------|-------|------|
| Kiri-1 | Beranda | Home |
| Kiri-2 | Cari | Search |
| Tengah | — | FAB `+` (Warm Coral, elevated) |
| Kanan-1 | Wishlist | Heart |
| Kanan-2 | Profil | User |

Tab aktif: coral. Tab inactive: muted.

---

## 📱 Inventori Layar (112 Screen Inventory)

**Nomor layar** = indeks `Screen{N}` di registry (bisa non-sequential). **Sumber kebenaran**: `figma/src/app/App.tsx` → `workflowSections`. Jika ada selisih dengan dokumen ini, prioritaskan `App.tsx`.

### §1 Onboarding · §2 Autentikasi

| # | Label | File |
|---|-------|------|
| 1 | Splash Screen | `Screen1Splash.tsx` |
| 2 | Edu Onboarding (4 slide) | `Screen2EduOnboarding.tsx` |
| 3 | Auth & Onboarding | `Screen3Auth.tsx` |
| 4 | Buat Username | `Screen4Username.tsx` |

### §3 Beranda

| # | Label | File |
|---|-------|------|
| 5 | Beranda — Mendatang | `Screen5Home.tsx` |
| 6 | Empty — Beranda | `Screen6EmptyBeranda.tsx` |
| 33 | Beranda — Selesai | `Screen33HomeSelesai.tsx` |
| 34 | Beranda — Undangan | `Screen34HomeUndangan.tsx` |
| 27 | Notifikasi | `Screen27Notifikasi.tsx` |

### §4 Pencarian (Tab Cari)

| # | Label | File |
|---|-------|------|
| 35 | Cari — Idle | `Screen35SearchIdle.tsx` |
| 7 | Cari — Hasil | `Screen7SearchUser.tsx` |
| 40 | Cari — Tidak Ada Hasil | `Screen40SearchNoResults.tsx` |
| 10 | Profil Publik | `Screen10PublicProfile.tsx` |
| 37 | Profil Publik — Empty Trip | `Screen37PublicProfileEmptyTrip.tsx` |

### §5 Profil (Tab Profil + Pengaturan)

| # | Label | File |
|---|-------|------|
| 8 | Profil & Eksplorasi | `Screen8Profile.tsx` |
| 36 | Profil — Empty Trip | `Screen36ProfileEmptyTrip.tsx` |
| 9 | Edit Profil | `Screen9EditProfil.tsx` |
| 11 | Pengaturan | `Screen11Settings.tsx` |
| 39 | Bantuan & FAQ | `Screen39SettingsHelpFaq.tsx` |
| 38 | Hapus Akun | `Screen38SettingsDeleteAccount.tsx` |

### §6 Pembuatan Perjalanan

| # | Label | File |
|---|-------|------|
| 78 | Form kosong | `Screen78CreateTripEmpty.tsx` |
| 12 | Default terisi | `Screen12Create.tsx` |
| 67–68 | Tanggal pasti / validasi | `Screen67`–`Screen68` |
| 70–71 | Mode kandidat / tooltip | `Screen70`–`Screen71` |
| 57–59, 80–81, 13 | Kandidat tanggal 1–3 | `Screen57`–`Screen59`, `Screen80`–`Screen81`, `Screen13` |
| 14 | Validasi error | `Screen14FormValidation.tsx` |
| 82 | Submit loading | `Screen82CreateTripSubmitting.tsx` |
| 20, 43–45, 84 | Undang (search only) | `Screen20`, `Screen43`–`Screen45`, `Screen84` |

> **Removed**: `Screen83InviteSuggestions` — tidak ada fitur saran teman; undang hanya via pencarian.

### §7 Itinerary · §8 Voting · §9 Chat · §10 Media · §11 Kelola Trip

| Pipeline | # (contoh) | Catatan |
|----------|------------|---------|
| **Itinerary** | 77, 15, 72, 18, 85–93 | Timeline, add/edit/cover/detail/menu ⋮ |
| **Voting** | 16, 107, 42, 53–56, 60–66, 21, 48–49, 73–75 | Multi-voting; empty badge 0 |
| **Chat** | 17, 97–106, 23–24 | Lampiran, kirim media, empty, long press |
| **Media** | 41, 98 | Grid + cover + dari chat |
| **Kelola ⋮** | 50–52, 22 | Anggota, edit, hapus, kalender |

### §12 Wishlist

| # | Label | File |
|---|-------|------|
| 108 | Empty | `Screen108WishlistEmpty.tsx` |
| 25 | Grid terisi | `Screen25Wishlist.tsx` |
| 110–120 | Filter, form, detail, konversi | `Screen110`–`Screen120` |

### §13 System States (unik — tidak diduplikasi)

| # | Label | File |
|---|-------|------|
| 28 | Skeleton Loading | `Screen28SkeletonLoading.tsx` |
| 29 | Toast & Snackbar | `Screen29ToastComponents.tsx` |
| 30 | Error — Offline | `Screen30Error.tsx` |
| 94–96 | Media Viewer | `Screen94`–`Screen96` |
| 31 | Dark Mode — Beranda | `Screen31DarkBeranda.tsx` |
| 32 | Design Tokens | `Screen32DesignTokens.tsx` |

---

## 🔌 Kebutuhan API dari Desain (Gap vs Backend)

**Sumber kebenaran teknis**: `docs/ARCHITECTURE.md §3.0.1` (matrix schema) · `§4.3.0` (35 endpoint ✅) · `§4.3.2` (gap M5.2) · `docs/WORKFLOW.md` (kontrak per §).

### Ringkasan Status (Juli 2026)

| Kategori | ✅ M5.1 | 🔜 M5.2 | M11 / Post-MVP |
|----------|---------|---------|----------------|
| Auth + username | 3 endpoint | — | logout opsional |
| Beranda + notif | 8 endpoint | — | — |
| Pencarian + profil | 4 endpoint | delete account | follow |
| Create trip + undang | 3 endpoint | times, cancel invite | — |
| Itinerary | 3 endpoint (thin) | PUT edit, enriched fields, Maps thumb | — |
| Voting | date vote/lock | multi-poll Aktivitas/Lainnya | — |
| Chat | text + delete | media, reply, read cursor | — |
| Media tab | — | documents + cover | — |
| Kelola trip | edit/delete trip | members list, remove | Calendar |
| Wishlist | CRUD basic | enriched fields, convert atomic | — |

### Detail Gap Table

| Fitur UI | Layar | Endpoint / Schema | Status |
|----------|-------|-------------------|--------|
| Notifikasi in-app | 27 | `GET /v1/notifications`, unread-count, mark read | ✅ M5.1 |
| Hapus pesan chat | 24 | `DELETE /v1/trips/:id/messages/:messageId` | ✅ M5.1 |
| Username check real-time | 4 | `GET /v1/users/check-username` | ✅ M5.1 |
| Tab Beranda Mendatang/Selesai | 5, 33 | `GET /v1/trips?tab=upcoming\|completed` | ✅ M5.1 |
| Grid trip profil publik | 10, 8 | `GET /v1/users/:username/trips` | ✅ M5.1 |
| Voting deadline & reminder | 16 | cron H-7d/H-1d/H-1h + `voting_deadline` | ✅ M5.1 |
| Cover image trip card | 5, 41 | `cover_image_url` default resolver | ✅ M5.1 (URL); 🔜 `cover_document_id` M5.2 |
| Edit aktivitas itinerary | 88 | `PUT /v1/trips/:id/destinations/:id` | 🔜 M5.2 |
| Aktivitas times/kind/cover | 15, 18–93 | enrich `trip_destinations` columns | 🔜 M5.2 |
| Trip waktu (non-all-day) | 12, 13 | `is_all_day`, `start_time`, `end_time` on trips | 🔜 M5.2 |
| Daftar anggota + batalkan undang | 45, 50 | `GET …/members`, `DELETE …/invitations/:id` | 🔜 M5.2 |
| Wishlist enriched + convert | 111–120 | wishlist columns + `POST …/convert-to-trip` | 🔜 M5.2 |
| Chat foto/video + unread badge | 97–106 | multipart messages + `trip_message_reads` | 🔜 M5.2 |
| Tab Media + set cover | 41, 98 | `trip_documents` CRUD + `PUT …/cover` | 🔜 M5.2 |
| Multi-voting Aktivitas/Lainnya | 16, 42–56 | `trip_polls` schema + CRUD | 🔜 M5.2c |
| Hapus akun | 38 | `DELETE /v1/users/me` | 🔜 M5.2 |
| Event kalender Google | 22 | Calendar API integration | M11 |
| Logout revoke session | 11 | `POST /v1/auth/logout` | Opsional (local OK) |
| Follow/follower | — | `POST/DELETE …/follow` | Post-MVP (kode ada) |

---

## 🔒 Visibilitas Profil & Trip

MVP fokus *trip planner*, bukan fitur sosial. Tidak ada sistem follow/follower aktif di MVP.

| Layer | Field | Perilaku |
|-------|-------|----------|
| **Trip di profil** | `trips.is_public` | Hanya trip creator dengan flag ini yang masuk grid profil publik |
| **Partisipasi trip** | `trip_participants` | Partisipan akses detail trip via Beranda |

---

## 🗂️ Detail Layar Penting

### Trip Detail — Tab Structure

```
Itinerary  ·  Voting  ·  Chat  ·  Media
```

| Tab | Counter | Catatan |
|-----|---------|---------|
| Itinerary | Jumlah aktivitas | Timeline multi-hari |
| Voting | Voting aktif | **Tab disembunyikan jika 0**; empty state badge **0** |
| Chat | Unread saja | Badge coral hanya jika > 0 |
| Media | Jumlah file | **Selalu tampil, termasuk `0`** |

### Onboarding (`Screen2EduOnboarding`)

| Slide | Masalah | Solusi | Preview |
|-------|---------|--------|---------|
| 1 Intro | — | Realisasikan Wacana Liburanmu | Hero + badge app |
| 2 | Sepakat Jadwal Susah Banget | Vote Bareng, Hasil Jelas | Mini voting (3 kandidat) |
| 3 | Rencana Berserakan | Timeline Harian yang Jelas | Mini itinerary (21 aktivitas, 4 hari) |
| 4 | Chat Trip Kecampur | Ruang Diskusi Khusus Trip | Mini chat |

Layout: scroll konten penuh; dots sticky di atas CTA.

### Undangan — Tanpa Saran Teman

Flow: `Screen20` (search kosong) → `Screen43`/`Screen84`/`Screen44` → `Screen45`. Tidak ada `Screen83`.

### Naming: UI vs Backend

| UI (Figma) | Backend (saat ini) |
|------------|-------------------|
| Itinerary / aktivitas | `trip_destinations`, `/destinations` endpoints |
| Voting type "Aktivitas" | Internal code `destinasi` di `VotingType` |

---

## 🤖 Panduan untuk AI Agent

### Cara Mengaudit Alignment (M12)

1. Jalankan `figma/` preview lokal
2. Verifikasi **112 layar** di `App.tsx` vs Composable Android
3. **Color Check**: `Color.kt` ↔ `colors.ts`
4. **Layout Check**: padding 20dp, bottom nav 88dp
5. **State Check**: empty, skeleton, error, validation, wishlist→trip
6. **Tab Check**: Itinerary · Voting · Chat · Media

### Rekomendasi Penempatan Aset

```
mobile/androidApp/src/main/res/
├── drawable/          # Vektor XML (ikon, ilustrasi empty state)
└── font/              # Plus Jakarta Sans
```

Ekspor dari Figma Editor: SVG → Vector Drawable (Android Studio).

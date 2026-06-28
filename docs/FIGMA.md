# Figma Design Reference — Atur Perjalanan

> **Tujuan dokumen ini**: 
> - Untuk AI agents: Menjadi sumber kebenaran utama screen inventory, design tokens, dan mapping ke workflow/API sebelum mengimplementasikan atau mengaudit layar UI (M7–M12).
> - Untuk product team: Dokumentasi lengkap palet warna, spacing, tipografi, dan 32 layar high-fidelity — referensi saat design review atau perubahan brand.

---

## 📦 Sumber Desain Lokal

Desain diekspor dari Figma Make dan disimpan di folder **`figma/`** di root monorepo.

| Sumber | Path / URL | Keterangan |
|--------|------------|------------|
| **Code bundle (lokal)** | `figma/` | 32 layar high-fidelity sebagai React preview. **Sumber kebenaran utama** untuk screen inventory & design tokens. |
| **Design tokens (kode)** | `figma/src/app/components/colors.ts` | Palet warna, font, avatar colors. |
| **Screen registry** | `figma/src/app/App.tsx` | Daftar lengkap 32 layar beserta label dan pengelompokan baris. |
| **Figma Editor** | https://www.figma.com/design/tFarpj9aEUL64GrDd1jGU5/Atur-Perjalanan | File desain asli (memerlukan akses Figma). |
| **Figma Preview (live)** | https://capri-spring-88160657.figma.site | Preview browser — alternatif jika bundle lokal belum dijalankan. |

### Menjalankan Preview Lokal

```bash
cd figma
npm i
npm run dev
```

Buka URL yang ditampilkan Vite (biasanya `http://localhost:5173`) untuk melihat seluruh 32 layar dalam phone frame.

> **Untuk AI Agent**: Prioritaskan inspeksi file di `figma/src/app/components/screens/` dan `colors.ts`. Gunakan `WebFetch` pada Figma Preview hanya sebagai pelengkap visual.

---

## 🎨 Design Tokens

Nilai di bawah ini diambil langsung dari `figma/src/app/components/colors.ts` dan `Screen32DesignTokens.tsx` (v2.4.1). Implementasikan di `mobile/androidApp/src/main/com/aturperjalanan/android/ui/theme/`.

### Color Palette

| Token Name | HEX | Penggunaan |
|------------|-----|------------|
| `ColorCoral` (Primary) | `#FF6B6B` | Active tab, primary button, CTA, bubble chat sendiri |
| `ColorCoralLight` | `#FFF0F0` | Background highlight rentang tanggal, badge unread |
| `ColorCoralDark` | `#E85555` | Pressed state primary button |
| `ColorTeal` (Secondary) | `#4ECDC4` | Secondary accent, tag chips, banner sukses |
| `ColorTealLight` | `#EDF9F8` | Background tag chip, ikon secondary |
| `ColorCharcoal` | `#1A1A2E` | Teks utama, judul |
| `ColorMuted` | `#9091A0` | Placeholder, label sekunder, tab inactive |
| `ColorMutedLight` | `#B8B9C6` | Hint text, timestamp |
| `ColorBorder` | `#EBEBF2` | Divider, stroke card/input |
| `ColorLight` | `#F7F7FB` | Background layar sekunder (notifikasi, profil) |
| `BackgroundPrimary` | `#FFFFFF` | Background layar utama |
| `ColorError` | `#E53935` | Validasi gagal, aksi destruktif (Hapus pesan) |
| `ShadowColor` | `rgba(26,26,46,0.08)` | Elevation shadow default |

**Avatar palette** (stacked avatars): `#FF6B6B`, `#4ECDC4`, `#FFB347`, `#8B7CF6`, `#60A5FA`, `#F472B6`

**Brand philosophy**: Palette *Sunset & Beach* — Pure white canvas, charcoal text, Warm Coral untuk aksi utama, Soft Teal untuk aksen sekunder.

### Typography

Font: **Plus Jakarta Sans** (`figma/src/styles/fonts.css`)

| Style | Weight | Size | Penggunaan |
|-------|--------|------|------------|
| `H1` | Bold 800 | 24sp | Judul halaman |
| `H2` | SemiBold 700 | 18sp | Judul section, card title |
| `H3` | Medium 600 | 15sp | Sub-judul, label form |
| `Body` | Regular 400 | 14sp | Teks isi utama |
| `Caption` | Medium 500 | 12sp | Timestamp, metadata, badge |

### Spacing & Radius

| Token | Value | Penggunaan |
|-------|-------|------------|
| `SpacingXS` | 4dp | Gap antar elemen kecil |
| `SpacingS` | 8dp | Padding dalam chip/badge |
| `SpacingM` | 16–20dp | Padding layar standar |
| `SpacingL` | 24dp | Section padding |
| `RadiusS` | 8dp | Input kecil |
| `RadiusM` | 12–14dp | Card, input field, icon button |
| `RadiusL` | 16–18dp | Bottom sheet, modal, CTA button |
| `RadiusXL` | 20–22dp | Profile card, toast |
| `Radius2XL` | 28dp | Hero card |
| `RadiusFull` | 50% | Avatar |

### Komponen Navigasi

Bottom Navigation Bar (`figma/src/app/components/BottomNav.tsx`):

| Posisi | Label | Ikon |
|--------|-------|------|
| Kiri-1 | Beranda | Home |
| Kiri-2 | Cari | Search |
| Tengah | — | FAB `+` (Warm Coral, elevated) |
| Kanan-1 | Wishlist | Heart |
| Kanan-2 | Profil | User |

Tab aktif: coral `#FF6B6B`. Tab inactive: muted `#9091A0`.

---

## 📱 Inventori Layar (32 Screen Inventory)

Semua layar dipetakan ke file React, milestone, workflow, dan kebutuhan API.

### Row 1 — Alur Utama (Layar 1–8)

| # | Label Figma | File | Composable Target | Milestone | Workflow | API Backend |
|---|-------------|------|-------------------|-----------|----------|-------------|
| 1 | Auth & Onboarding | `Screen1Auth.tsx` | `SignInScreen` | M7 | §2 | `POST /v1/auth/google` |
| 2 | Beranda | `Screen2Home.tsx` | `HomeScreen` | M8 | §3 | `GET /v1/trips`, `GET /v1/trips/invitations` |
| 3 | Profil & Eksplorasi | `Screen3Profile.tsx` | `ProfileScreen` | M10 | §4 | `GET /v1/users/me`, `GET /v1/users/me/trips` ⚠️ |
| 4 | Buat Perjalanan | `Screen4Create.tsx` | `CreateTripSheet` | M8 | §5 | `POST /v1/trips` |
| 5 | Detail — Destinasi | `Screen5Destinations.tsx` | `TripDetailScreen` (tab Destinasi) | M8 | §6 | `GET /v1/trips/:id`, `GET /v1/trips/:id/destinations` |
| 6 | Detail — Voting | `Screen6Voting.tsx` | `VotingScreen` | M9 | §8 | `GET /v1/trips/:id/candidates`, vote/lock endpoints |
| 7 | Detail — Group Chat | `Screen7Chat.tsx` | `ChatScreen` | M9 | §9 | `GET/POST /v1/trips/:id/messages` |
| 8 | Wishlist | `Screen8Wishlist.tsx` | `WishlistScreen` | M10 | §10 | `GET /v1/wishlists` |

### Row 2 — Alur Lanjutan (Layar 9–16)

| # | Label Figma | File | Composable Target | Milestone | Workflow | API Backend |
|---|-------------|------|-------------------|-----------|----------|-------------|
| 9 | Edu Onboarding | `Screen9EduOnboarding.tsx` | `OnboardingScreen` | M7 | §1 | — (local DataStore flag) |
| 10 | Buat Username | `Screen10Username.tsx` | `UsernameSetupScreen` | M7 | §2 | `POST /v1/auth/complete-registration` |
| 11 | Notifikasi | `Screen11Notifikasi.tsx` | `NotificationScreen` | M8 | §11 | ⚠️ **Belum ada** — lihat § Kebutuhan API |
| 12 | Pencarian Pengguna | `Screen12SearchUser.tsx` | `ExploreScreen` | M10 | §4 | `GET /v1/users/search`, follow/unfollow |
| 13 | Sheet — Tambah Destinasi | `Screen13BottomSheetDestinasi.tsx` | `AddDestinationSheet` | M8 | §6 | `POST /v1/trips/:id/destinations` |
| 14 | Sheet — Undang Teman | `Screen14BottomSheetUndang.tsx` | `InviteSheet` | M9 | §7 | `POST /v1/trips/:id/invitations` |
| 15 | Sheet — Tambah Wishlist | `Screen15BottomSheetWishlist.tsx` | `AddWishlistSheet` | M10 | §10 | `POST /v1/wishlists` |
| 16 | Edit Profil | `Screen16EditProfil.tsx` | `EditProfileScreen` | M10 | §4 | `PUT /v1/users/me` |

### Row 3 — Edge Cases & Komponen Sistem (Layar 17–24)

| # | Label Figma | File | Composable Target | Milestone | Workflow | API Backend |
|---|-------------|------|-------------------|-----------|----------|-------------|
| 17 | Empty — Beranda | `Screen17EmptyBeranda.tsx` | `HomeEmptyState` | M8 | §3 | — (empty list response) |
| 18 | Empty — Chat | `Screen18EmptyChat.tsx` | `ChatEmptyState` | M9 | §9 | — (empty messages) |
| 19 | Jadwal Dikunci | `Screen19StatusLocked.tsx` | `VotingLockedState` | M9 | §8 | `GET /v1/trips/:id` (`status=fixed`) |
| 20 | Profil Publik | `Screen20PublicProfile.tsx` | `PublicProfileScreen` | M10 | §4 | `GET /v1/users/:username`, `GET /v1/users/:username/trips`, follow (privasi Instagram M5.1) |
| 21 | Pengaturan | `Screen21Settings.tsx` | `SettingsScreen` | M10 | §12 | ⚠️ **Sebagian belum ada** — logout local; push prefs |
| 22 | Skeleton Loading | `Screen22SkeletonLoading.tsx` | `SkeletonComponents` | M8–M10 | §13 | — (loading state FE) |
| 23 | Toast & Snackbar | `Screen23ToastComponents.tsx` | `ToastComponents` | M8–M10 | §13 | — (feedback FE) |
| 24 | Error 404 / Offline | `Screen24Error.tsx` | `ErrorScreen` | M8–M10 | §13 | — (network error handling) |

### Row 4 — Micro-interactions, Dark Mode & Design System (Layar 25–32)

| # | Label Figma | File | Composable Target | Milestone | Workflow | API Backend |
|---|-------------|------|-------------------|-----------|----------|-------------|
| 25 | Splash Screen | `Screen25Splash.tsx` | `SplashScreen` | M7 | §13 | — (local) |
| 26 | Dark Mode — Beranda | `Screen26DarkBeranda.tsx` | `HomeScreen` (dark theme) | M12 | §13 | — (theme FE) |
| 27 | Form Validation | `Screen27FormValidation.tsx` | Form error states | M8 | §5, §13 | Validasi client + error response BE |
| 28 | Long Press Menu | `Screen28ChatLongPress.tsx` | Chat context menu | M9 | §9 | ⚠️ **Hapus pesan belum ada** |
| 29 | Detail Destinasi | `Screen29DestinationDetail.tsx` | `DestinationDetailSheet` | M8 | §6 | ⚠️ **Detail GET belum ada** — list sudah ada |
| 30 | Multi Kandidat Tanggal | `Screen30MultiDatePicker.tsx` | Multi-date picker UI | M8 | §5 | `POST /v1/trips` (multi candidates) |
| 31 | Sync Sukses Modal | `Screen31CalendarSyncModal.tsx` | `CalendarSyncModal` | M11 | §8 | Google Calendar sync (post-lock) |
| 32 | Design Tokens | `Screen32DesignTokens.tsx` | Theme reference | M12 | — | — |

> ⚠️ = endpoint belum tersedia di backend saat M5 selesai. Lihat bagian **Kebutuhan API dari Desain** di bawah.

---

## 🔌 Kebutuhan API dari Desain (Gap vs Backend M5)

Fitur berikut **terlihat di Figma** tetapi belum sepenuhnya didukung API backend saat ini:

| Fitur UI | Layar | Endpoint yang Dibutuhkan | Status M5 |
|----------|-------|--------------------------|-----------|
| Notifikasi in-app (undangan, follow, voting, update destinasi) | 11 | `GET /v1/notifications`, `PUT /v1/notifications/:id/read`, aksi inline (terima/tolak/follow/vote) | ❌ Belum ada |
| Follower / Following count di profil | 3, 20 | `GET /v1/users/me` atau `GET /v1/users/:username` dengan field `followers_count`, `following_count` | ⚠️ Perlu verifikasi response |
| Hapus pesan chat (long press) | 28 | `DELETE /v1/trips/:id/messages/:messageId` | ❌ Belum ada |
| Detail destinasi (tap card → sheet peta + referensi) | 29 | `GET /v1/trips/:id/destinations/:destinationId` atau enrich list response | ⚠️ List ada, detail sheet perlu data lengkap |
| Cover image trip card di Beranda | 2 | Field `cover_image_url` di trip + default asset server-side (upload S3/GCS di M8+) | ❌ Belum ada |
| Username availability check real-time | 10 | `GET /v1/users/check-username?username=` | ❌ Belum ada (hanya error saat complete-registration) |
| Grid trip profil + privasi Instagram | 3, 20 | `GET /v1/users/:username/trips` + `can_view_content` di profile | ❌ Belum ada |
| Tab Beranda Mendatang/Selesai | 2 | `GET /v1/trips?tab=upcoming\|completed` | ⚠️ Belum ada filter |
| Voting deadline & reminder | 11 | `trips.voting_deadline` + cron H-7d/H-1d/H-1h | ❌ Belum ada |
| Logout / revoke session | 21 | `POST /v1/auth/logout` (opsional — bisa local-only) | ❌ Belum ada |
| Push notification preferences | 21 | `PUT /v1/users/me/notification-settings` | ❌ Belum ada (post-MVP) |

Gunakan prompt audit API (disertakan saat handoff ke Claude) untuk review menyeluruh.

---

## 🔒 Model Privasi (Instagram-style)

Privasi akun (`users.is_public`) dan visibilitas trip di profil (`trips.is_public`) bekerja berlapis:

| Layer | Field | Perilaku |
|-------|-------|----------|
| **Akun** | `users.is_public` | `false` = akun privat; konten profil (bio, grid trip) hanya untuk **followers** + owner |
| **Trip di profil** | `trips.is_public` | Hanya trip creator dengan flag ini yang masuk grid profil (ke follower atau publik) |
| **Partisipasi trip** | `trip_participants` | Partisipan selalu akses detail trip via Beranda — independen dari privasi profil |

### UI per Layar

| Layar | Perilaku privat |
|-------|-----------------|
| `Screen20PublicProfile` | Non-follower: banner *Akun Privat*, tanpa bio/grid; follower: layout penuh seperti publik |
| `Screen3Profile` | Owner selalu lihat semua trip creator di grid |
| `Screen12SearchUser` | Akun privat tetap muncul; tombol Follow; tidak perlu akses grid |
| `Screen16EditProfil` | Toggle *Akun Privat* ↔ `PUT /v1/users/me { is_public }` |
| `Screen21Settings` | Menu Privasi & Keamanan → arahkan ke Edit Profil / toggle |

### API (target M5.1)

- `GET /v1/users/:username` → tambah `can_view_content: bool`, `is_following: bool`; **bukan 404** untuk akun privat (ganti perilaku M5).
- `GET /v1/users/:username/trips?role=created` → `403 PROFILE_PRIVATE` jika privat & bukan follower; query `role=participated|all` reserved untuk fase berikutnya.

---

## 🗂️ Detail Layar Penting

### Trip Detail — Tab Structure

Figma menetapkan **3 tab** di halaman detail perjalanan:

```
Destinasi  ·  Voting  ·  Chat
```

Bukan "Info". Tab Voting selalu ada; kontennya berbeda berdasarkan `status`:
- `voting_pending` → kandidat tanggal + tombol Vote (Screen 6)
- `fixed` → banner "Jadwal Dikunci" + ringkasan tanggal final (Screen 19)

Header trip detail: judul trip, rentang tanggal / jumlah anggota, tombol `⋯` (menu), tombol `+ Undang`.

### Beranda — Trip Card

Card perjalanan (`Screen2Home.tsx`) menampilkan:
- **Cover image** hero (full-width di atas card)
- Judul trip
- Tags (chips teal)
- Rentang tanggal
- Stacked avatars partisipan
- Header hanya berisi ikon lonceng notifikasi (badge unread)

### Notifikasi — Tipe & Aksi

| Tipe | Contoh | Aksi Inline |
|------|--------|-------------|
| `invite` | "Budi mengundangmu ke Lombok Escape" | Terima / Tolak |
| `follow` | "Siti mulai mengikuti kamu" | Follow back |
| `voting` | "Voting tanggal Bali Trip segera berakhir" | Vote |
| `update` | "Rina menambahkan destinasi: Bukit Merese" | — (tap → trip detail) |

### Chat — Long Press Menu

Long press pada bubble pesan (`Screen28ChatLongPress.tsx`):
- **Balas** (reply — UI only, bisa post-MVP)
- **Salin Teks** (local clipboard)
- **Hapus** (butuh `DELETE` endpoint, hanya pesan sendiri)

---

## 🤖 Panduan untuk AI Agent

### Cara Mengaudit Alignment (M12)

1. Jalankan `figma/` preview lokal atau buka Figma Preview URL
2. Bandingkan setiap layar dengan Composable Android yang ada
3. **Color Check**: bandingkan `Color.kt` dengan `figma/src/app/components/colors.ts`
4. **Layout Check**: padding 20dp standar, bottom nav 88dp height
5. **Component Check**: setiap baris di Screen Inventory harus punya Composable
6. **State Check**: empty (17, 18), skeleton (22), error (24), validation (27), locked (19)
7. **Tab Check**: trip detail = Destinasi · Voting · Chat

### Figma Make — Catatan Penting

Kode di `figma/` adalah **React/HTML**, bukan Kotlin. Jangan salin langsung ke proyek mobile. Gunakan sebagai referensi:
- Struktur komponen dan hierarchy layout
- Spacing, warna, dan interaksi visual
- State variants (empty, error, loading)

Implementasikan ulang di Jetpack Compose mengikuti pola `docs/ARCHITECTURE.md §5`.

### Rekomendasi Penempatan Aset

```
mobile/androidApp/src/main/res/
├── drawable/          # Vektor XML (ikon, ilustrasi empty state)
│   ├── ic_coral_logo.xml
│   ├── ic_empty_trip.xml
│   └── ic_empty_wishlist.xml
└── font/              # Plus Jakarta Sans
```

Ekspor dari Figma Editor: SVG → Vector Drawable (Android Studio `File > New > Vector Asset`).

# WorkFlow - Atur Perjalanan

> **Tujuan dokumen ini**: Mendokumentasikan alur kerja pengguna (*user workflows*) dari awal membuka aplikasi hingga menggunakan seluruh fitur. Alur selaras dengan **32 layar high-fidelity** Figma (lihat `docs/FIGMA.md` untuk inventori lengkap) dan **5 tab Bottom Navigation Bar** utama.

---

## Struktur Navigasi Utama (Bottom Tab Bar)

Aplikasi menggunakan *Bottom Navigation Bar* dengan 5 menu (`figma/src/app/components/BottomNav.tsx`):

| Posisi | Label | Fungsi |
|--------|-------|--------|
| 1 | **Beranda** | Daftar perjalanan (tab Mendatang / Selesai / Undangan) |
| 2 | **Cari** | Pencarian pengguna lain |
| 3 | **[+]** | FAB tengah — buat perjalanan baru |
| 4 | **Wishlist** | Daftar destinasi impian |
| 5 | **Profil** | Halaman akun pengguna |

---

## 1. Onboarding Layar Awal (Frontend)

* **Layar Figma**: `Screen9EduOnboarding`, `Screen25Splash`
* Saat aplikasi pertama kali dibuka, tampil **Splash Screen** singkat, lalu FE mengecek flag first-launch.
* Jika pertama kali: tampilkan carousel onboarding (hero image + 3 slide fitur: Manajemen Perjalanan, Voting Jadwal, Grup Chat).
* Setelah onboarding selesai, arahkan ke halaman Autentikasi.

## 2. Autentikasi (Google Sign-In)

* **Layar Figma**: `Screen1Auth`, `Screen10Username`
* **UI/UX**: Halaman bersih dengan logo aplikasi dan tombol "Lanjutkan dengan Google" (Warm Coral `#FF6B6B`).
* Sistem mengambil data profil dasar dari Google (Email, Nama, Avatar) dan menyimpannya ke *database*.
* **Pengguna Baru**: Diarahkan ke form pembuatan *username* unik dengan validasi real-time (`Screen10Username`).
* **Pengguna Lama**: Langsung ke Beranda.
* **Interaksi Data**: Upsert tabel `users`; `POST /v1/auth/google` → `POST /v1/auth/complete-registration` (jika baru).

## 3. Beranda (Home) - Tab 1

* **Layar Figma**: `Screen2Home`, `Screen17EmptyBeranda`, `Screen26DarkBeranda`
* **Header**: Ikon lonceng Notifikasi dengan badge unread → navigasi ke layar Notifikasi (§11).
* **Tab View**: "Mendatang", "Selesai", "Undangan" (*segmented control*).
* **Trip Card** (`Screen2Home`):
  * Cover image hero di bagian atas card
  * Judul trip, Tags (chips teal), rentang tanggal, stacked avatars partisipan
* **Empty State** (`Screen17EmptyBeranda`): Ilustrasi + CTA buat perjalanan pertama.
* **Interaksi Data**: `GET /v1/trips` (filter by status/tab), `GET /v1/trips/invitations` (tab Undangan).

## 4. Pencarian & Profil - Tab 2 & Tab 5

* **Layar Figma**: `Screen12SearchUser`, `Screen3Profile`, `Screen16EditProfil`, `Screen20PublicProfile`, `Screen21Settings`

### Pencarian (Tab Cari)
* Search bar + list hasil: Avatar, Username, Nama, tombol Follow/Unfollow.
* **Interaksi Data**: `GET /v1/users/search`, `POST/DELETE /v1/users/:username/follow`.

### Profil Pribadi (Tab Profil)
* Foto, username, bio, statistik Followers/Following, grid trip, tombol Edit Profil & Pengaturan.
* **Interaksi Data**: `GET /v1/users/me`, `GET /v1/users/me/trips` (semua trip creator).

### Profil User Lain (`Screen20PublicProfile`)
* Dibuka saat tap hasil pencarian.
* **Akun publik**: profil lengkap + grid trip (`trips.is_public=true` milik creator).
* **Akun privat** (Instagram-style): non-follower hanya melihat avatar, username, nama, stats, tombol Follow, dan banner *"Akun ini privat"* — **tanpa bio dan tanpa grid trip**.
* **Follower akun privat**: profil lengkap + grid trip (`trips.is_public=true`).
* **Interaksi Data**: `GET /v1/users/:username` (field `can_view_content`), `GET /v1/users/:username/trips` (403 jika privat & bukan follower).

### Edit Profil (`Screen16EditProfil`)
* Edit bio + toggle akun privat/publik (`is_public`).
* **Interaksi Data**: `PUT /v1/users/me`.

## 5. Pembuatan Perjalanan - Tab [+]

* **Layar Figma**: `Screen4Create`, `Screen30MultiDatePicker`, `Screen27FormValidation`
* **UI/UX**: Modal full-screen (`Screen4Create`) dengan form:
  * Input "Nama Perjalanan" (wajib — validasi error di `Screen27FormValidation`)
  * Tags dinamis (ketik → chip teal, tombol × hapus)
  * Kalender rentang tanggal (start–end) dengan navigasi bulan
  * Tombol "+ Tambah Kandidat Tanggal" (dashed border) → menambah card kalender baru (`Screen30MultiDatePicker`)
  * CTA sticky "Buat Perjalanan" (Warm Coral)
* **Interaksi Data**:
  * 1 rentang tanggal → `status=fixed`, simpan `start_date`/`end_date` di `trips`
  * >1 rentang → `status=voting_pending`, simpan ke `trip_date_candidates`
  * `POST /v1/trips`

## 6. Detail Perjalanan — Tab Destinasi · Voting · Chat

* **Layar Figma**: `Screen5Destinations`, `Screen6Voting`, `Screen7Chat`, `Screen13BottomSheetDestinasi`, `Screen29DestinationDetail`
* Header: judul trip, tanggal/anggota, tombol back, menu `⋯`, tombol "+ Undang Teman".
* **3 Tab** (bukan "Info"): **Destinasi · Voting · Chat**

### Tab Destinasi
* Vertical list destinasi dengan emoji/ikon, nama, lokasi.
* Empty state + tombol "Tambah Destinasi".
* Bottom sheet form (`Screen13BottomSheetDestinasi`): Nama Tempat (wajib), Link Google Maps, Link Referensi TikTok/IG.
* Tap card → **Detail Destinasi sheet** (`Screen29DestinationDetail`): snippet peta, tombol Buka Maps, link referensi media sosial.
* **Interaksi Data**: `GET/POST/DELETE /v1/trips/:id/destinations`

### Tab Voting
* Lihat §8. Saat `status=fixed`, tampilkan state terkunci (`Screen19StatusLocked`).

### Tab Chat
* Lihat §9.

## 7. Mengundang Partisipan & Kolaborasi

* **Layar Figma**: `Screen14BottomSheetUndang`
* Bottom sheet: cari username atau input email.
* **Interaksi Data**:
  * Via Username → `trip_invitations` (status pending); notifikasi in-app (§11)
  * Via Email → Google Calendar API event invite (M11)
  * Terima undangan → mutual follow otomatis + `trip_participants`

## 8. Voting Tanggal

* **Layar Figma**: `Screen6Voting`, `Screen19StatusLocked`, `Screen31CalendarSyncModal`
* Berlaku untuk `status=voting_pending`.
* Tab Voting menampilkan card kandidat tanggal + jumlah vote + tombol Vote.
* Creator: tombol "Kunci Tanggal Ini" pada kandidat terpilih.
* Setelah lock (`status=fixed`): banner teal "Jadwal Dikunci" (`Screen19StatusLocked`) + modal sukses sync kalender (`Screen31CalendarSyncModal`).
* **Interaksi Data**: `trip_date_votes`, lock → update `trips`, trigger Google Calendar sync.

## 9. Grup Chat Internal Perjalanan

* **Layar Figma**: `Screen7Chat`, `Screen18EmptyChat`, `Screen28ChatLongPress`
* Chat bubbles (coral = pesan sendiri, putih = pesan orang lain), input + kirim + lampiran (UI).
* Header chat: nama grup, jumlah anggota aktif, mini avatars.
* **Empty State** (`Screen18EmptyChat`): ilustrasi + prompt mulai obrolan.
* **Long Press** (`Screen28ChatLongPress`): menu konteks → Balas, Salin Teks, Hapus (pesan sendiri).
* **Interaksi Data**: `GET/POST /v1/trips/:id/messages` (cursor-paginated, chronological).

## 10. Wishlist - Tab 4

* **Layar Figma**: `Screen8Wishlist`, `Screen15BottomSheetWishlist`
* Grid/List view + Filter/Sort bar (tags, prioritas).
* FAB "+" → bottom sheet form: Nama Tempat, Link, Tags, Prioritas (Tinggi/Menengah/Rendah).
* **Interaksi Data**: `GET/POST/PUT/DELETE /v1/wishlists`

## 11. Notifikasi

* **Layar Figma**: `Screen11Notifikasi`
* Diakses via ikon lonceng di Beranda.
* Tipe notifikasi:
  * **Undangan trip** — aksi Terima / Tolak
  * **Follow baru** — aksi Follow back
  * **Voting deadline** — aksi Vote (deep link ke tab Voting)
  * **Update destinasi** — tap navigasi ke trip detail
* Badge unread di ikon lonceng; mark-as-read saat dibuka.
* **Interaksi Data**: ⚠️ Membutuhkan endpoint notifications (belum ada di M5). Sementara bisa di-*compose* dari `trip_invitations` + polling/events.

## 12. Pengaturan

* **Layar Figma**: `Screen21Settings`
* Diakses dari Profil. Grup menu:
  * **Akun**: Notifikasi (push prefs), Privasi & Keamanan (link ke toggle `is_public`)
  * **Dukungan**: Bantuan & FAQ, Syarat & Ketentuan, Tentang Aplikasi (versi)
  * **Logout**: Hapus token lokal + redirect ke Sign In
* **Interaksi Data**: Sebagian local-only; push prefs membutuhkan endpoint terpisah (post-MVP).

## 13. System States & Micro-interactions

* **Layar Figma**: `Screen22SkeletonLoading`, `Screen23ToastComponents`, `Screen24Error`, `Screen25Splash`, `Screen26DarkBeranda`, `Screen27FormValidation`, `Screen32DesignTokens`

| State | Deskripsi | Trigger |
|-------|-----------|---------|
| **Splash** | Logo coral + loading | App cold start |
| **Skeleton** | Shimmer placeholder card/list | Fetch data in-progress |
| **Toast Success** | Teal snackbar (contoh: "Perjalanan berhasil dibuat") | Aksi sukses |
| **Toast Error** | Coral snackbar + tombol Retry | API error |
| **Toast Offline** | Info banner "Tidak ada koneksi" | Network unreachable |
| **Error 404/Offline** | Ilustrasi compass + CTA "Coba Lagi" | Halaman/route tidak ditemukan atau offline |
| **Form Validation** | Border merah `#E53935` + pesan error inline | Submit form invalid |
| **Dark Mode** | Variant Beranda dengan palette gelap | System theme / user preference (M12) |

Design tokens lengkap: `Screen32DesignTokens.tsx` / `figma/src/app/components/colors.ts`.

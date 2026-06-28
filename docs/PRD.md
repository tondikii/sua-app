# Product Requirements Document (PRD)

> **Tujuan dokumen ini**: Spesifikasi MVP lengkap selaras dengan 32 layar high-fidelity Figma di folder `figma/`. Inventori layar, desain tokens, dan workflow lengkap: [docs/FIGMA.md](docs/FIGMA.md).

---

## 1. Autentikasi & Onboarding
* Splash screen singkat saat cold start (`Screen1Splash`).
* Layar *Onboarding* carousel (hero image + fitur utama) hanya saat pengguna pertama kali membuka aplikasi (`Screen2EduOnboarding`).
* Login sukses via Google Sign-In — tombol "Lanjutkan dengan Google" (`Screen3Auth`).
* Sistem mengambil data dasar (Nama, Email, Avatar) dari Google.
* Pengguna baru wajib membuat *username* unik dengan validasi real-time (`Screen4Username`).
* Pengguna lama langsung diarahkan ke Beranda.

## 2. Beranda & Notifikasi
* Beranda menampilkan trip card dengan **cover image**, judul, tags, tanggal, stacked avatars (`Screen5Home`).
* Tab: "Mendatang", "Selesai", "Undangan".
* Header: ikon lonceng notifikasi dengan badge unread.
* Empty state saat belum ada perjalanan (`Screen6EmptyBeranda`).
* **Notifikasi in-app** (`Screen27Notifikasi`): undangan trip (terima/tolak), follow baru, reminder voting, update destinasi.

## 3. Profil & Sistem Sosial
* **Profil pribadi** (`Screen8Profile`): username, bio, followers/following, grid trip, akses Edit Profil & Pengaturan.
* **Profil user lain** (`Screen10PublicProfile`): tombol Follow; konten penuh hanya jika viewer berhak melihat (lihat **Model Privasi** di bawah).
* **Edit profil** (`Screen9EditProfil`): edit bio + toggle akun privat/publik (`users.is_public`).
* **Pencarian** (`Screen35SearchIdle`, `Screen7SearchUser`): tab Cari menampilkan state idle (riwayat) lalu hasil pencarian; cari username/nama, follow/unfollow — akun privat tetap muncul di hasil pencarian.
* **Pengaturan** (`Screen11Settings`): notifikasi, privasi, bantuan, logout.
* Mutual follow otomatis saat menerima undangan perjalanan.

### Model Privasi (Instagram-style)
Privasi diatur di **tingkat akun** (`users.is_public`) dan **tingkat trip** (`trips.is_public`):

| Akun | Viewer | Profil | Grid trip di profil |
|------|--------|--------|---------------------|
| **Publik** (`is_public=true`) | Siapa saja | Konten penuh (bio, stats) | Trip milik creator dengan `trips.is_public=true` |
| **Publik** | Owner | Konten penuh | Semua trip creator (termasuk `is_public=false`) |
| **Privat** (`is_public=false`) | Bukan follower | **Terbatas**: avatar, username, nama, stats, tombol Follow — bio & grid disembunyikan | Tidak ada |
| **Privat** | Follower | Konten penuh | Trip creator dengan `trips.is_public=true` |
| **Privat** | Owner | Konten penuh | Semua trip creator |

> Trip dengan `trips.is_public=false` tidak pernah muncul di grid profil ke orang lain; hanya partisipan trip yang mengakses via Beranda/detail trip.

## 4. Manajemen Perjalanan (Core)
* **Pembuatan Trip** (`Screen12Create`, `Screen13MultiDatePicker`): nama, tags dinamis, kalender rentang tanggal, tambah kandidat tanggal.
* Validasi form dengan error state inline (`Screen14FormValidation`).
* **Detail Trip** — tab **Destinasi · Voting · Chat** (`Screen15Destinations`, `Screen16Voting`, `Screen17Chat`):
  * Destinasi: list + bottom sheet tambah (`Screen18BottomSheetDestinasi`) + detail sheet peta/referensi (`Screen19DestinationDetail`).
  * Voting: kandidat tanggal + vote count; state terkunci setelah fix (`Screen21StatusLocked`).
  * Chat: bubbles, empty state (`Screen23EmptyChat`), long-press menu Balas/Salin/Hapus (`Screen24ChatLongPress`).
* Pembuat trip dapat mengubah info trip kapan saja.

## 5. Kolaborasi & Integrasi
* **Undangan** (`Screen20BottomSheetUndang`): via username (notifikasi in-app) atau email (Google Calendar).
* Terima/tolak undangan dari tab Beranda "Undangan" atau layar Notifikasi.
* **Sinkronisasi Kalender**: setelah lock tanggal, modal sukses (`Screen22CalendarSyncModal`) + event di Google Calendar partisipan.

## 6. Wishlist
* Grid/List view + filter/sort by tags & prioritas (`Screen25Wishlist`).
* FAB "+" → bottom sheet form (`Screen26BottomSheetWishlist`): nama, link, tags, prioritas (Tinggi/Menengah/Rendah).
* Empty state saat wishlist kosong.

## 7. System UX (Non-Functional UI)
* **Skeleton loading** saat fetch data (`Screen28SkeletonLoading`).
* **Toast/Snackbar** success (teal), error (coral), offline (`Screen29ToastComponents`).
* **Error 404/Offline** screen dengan CTA retry (`Screen30Error`).
* **Dark mode** variant untuk Beranda (`Screen31DarkBeranda`, layar 31 · §13) — implementasi penuh di M12.
* Design tokens terdokumentasi (`Screen32DesignTokens`, `figma/src/app/components/colors.ts`).

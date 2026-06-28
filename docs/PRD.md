# Product Requirements Document (PRD)

> **Tujuan dokumen ini**: Spesifikasi MVP lengkap selaras dengan 32 layar high-fidelity Figma di folder `figma/`. Inventori layar, desain tokens, dan workflow lengkap: [docs/FIGMA.md](docs/FIGMA.md).

---

## 1. Autentikasi & Onboarding
* Splash screen singkat saat cold start (`Screen25Splash`).
* Layar *Onboarding* carousel (hero image + fitur utama) hanya saat pengguna pertama kali membuka aplikasi (`Screen9EduOnboarding`).
* Login sukses via Google Sign-In — tombol "Lanjutkan dengan Google" (`Screen1Auth`).
* Sistem mengambil data dasar (Nama, Email, Avatar) dari Google.
* Pengguna baru wajib membuat *username* unik dengan validasi real-time (`Screen10Username`).
* Pengguna lama langsung diarahkan ke Beranda.

## 2. Beranda & Notifikasi
* Beranda menampilkan trip card dengan **cover image**, judul, tags, tanggal, stacked avatars (`Screen2Home`).
* Tab: "Mendatang", "Selesai", "Undangan".
* Header: ikon lonceng notifikasi dengan badge unread.
* Empty state saat belum ada perjalanan (`Screen17EmptyBeranda`).
* **Notifikasi in-app** (`Screen11Notifikasi`): undangan trip (terima/tolak), follow baru, reminder voting, update destinasi.

## 3. Profil & Sistem Sosial
* **Profil pribadi** (`Screen3Profile`): username, bio, followers/following, grid trip, akses Edit Profil & Pengaturan.
* **Profil user lain** (`Screen20PublicProfile`): tombol Follow; konten penuh hanya jika viewer berhak melihat (lihat **Model Privasi** di bawah).
* **Edit profil** (`Screen16EditProfil`): edit bio + toggle akun privat/publik (`users.is_public`).
* **Pencarian** (`Screen12SearchUser`): cari username/nama, follow/unfollow — akun privat tetap muncul di hasil pencarian.
* **Pengaturan** (`Screen21Settings`): notifikasi, privasi, bantuan, logout.
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
* **Pembuatan Trip** (`Screen4Create`, `Screen30MultiDatePicker`): nama, tags dinamis, kalender rentang tanggal, tambah kandidat tanggal.
* Validasi form dengan error state inline (`Screen27FormValidation`).
* **Detail Trip** — tab **Destinasi · Voting · Chat** (`Screen5Destinations`, `Screen6Voting`, `Screen7Chat`):
  * Destinasi: list + bottom sheet tambah (`Screen13BottomSheetDestinasi`) + detail sheet peta/referensi (`Screen29DestinationDetail`).
  * Voting: kandidat tanggal + vote count; state terkunci setelah fix (`Screen19StatusLocked`).
  * Chat: bubbles, empty state (`Screen18EmptyChat`), long-press menu Balas/Salin/Hapus (`Screen28ChatLongPress`).
* Pembuat trip dapat mengubah info trip kapan saja.

## 5. Kolaborasi & Integrasi
* **Undangan** (`Screen14BottomSheetUndang`): via username (notifikasi in-app) atau email (Google Calendar).
* Terima/tolak undangan dari tab Beranda "Undangan" atau layar Notifikasi.
* **Sinkronisasi Kalender**: setelah lock tanggal, modal sukses (`Screen31CalendarSyncModal`) + event di Google Calendar partisipan.

## 6. Wishlist
* Grid/List view + filter/sort by tags & prioritas (`Screen8Wishlist`).
* FAB "+" → bottom sheet form (`Screen15BottomSheetWishlist`): nama, link, tags, prioritas (Tinggi/Menengah/Rendah).
* Empty state saat wishlist kosong.

## 7. System UX (Non-Functional UI)
* **Skeleton loading** saat fetch data (`Screen22SkeletonLoading`).
* **Toast/Snackbar** success (teal), error (coral), offline (`Screen23ToastComponents`).
* **Error 404/Offline** screen dengan CTA retry (`Screen24Error`).
* **Dark mode** variant untuk Beranda (`Screen26DarkBeranda`) — implementasi penuh di M12.
* Design tokens terdokumentasi (`Screen32DesignTokens`, `figma/src/app/components/colors.ts`).

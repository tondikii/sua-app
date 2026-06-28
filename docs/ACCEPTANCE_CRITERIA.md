# Acceptance Criteria (Kriteria Penerimaan)

> **Tujuan dokumen ini**: Checklist UAT lengkap untuk memverifikasi bahwa aplikasi mobile sesuai desain Figma (32 layar) dan spesifikasi MVPs. Referensi: [docs/FIGMA.md](docs/FIGMA.md), [docs/WORKFLOW.md](docs/WORKFLOW.md).

---

## 1. Autentikasi & Onboarding
- [ ] Splash screen tampil saat cold start, lalu lanjut ke onboarding atau auth (`Screen1Splash`).
- [ ] Onboarding carousel hanya muncul saat pengguna pertama kali membuka aplikasi (`Screen2EduOnboarding`).
- [ ] Login sukses via tombol "Lanjutkan dengan Google" (`Screen3Auth`).
- [ ] Data dasar Google (Nama, Email, Avatar) tersimpan di tabel `users`.
- [ ] Pengguna baru diarahkan ke form username; sistem menolak username duplikat dengan feedback visual (`Screen4Username`).
- [ ] Pengguna lama langsung ke Beranda tanpa form username.

## 2. Beranda & Notifikasi
- [ ] Beranda menampilkan ikon lonceng dengan badge unread (`Screen5Home`).
- [ ] Tab "Mendatang", "Selesai", "Undangan" memfilter daftar trip dengan benar.
- [ ] Trip card menampilkan cover image, judul, tags (chips), rentang tanggal, stacked avatars.
- [ ] Empty state tampil saat tidak ada trip (`Screen6EmptyBeranda`).
- [ ] Layar Notifikasi menampilkan tipe: undangan, follow, voting, update destinasi (`Screen27Notifikasi`).
- [ ] Aksi inline notifikasi berfungsi: terima/tolak undangan, follow back, navigasi ke voting/trip.

## 3. Profil & Sistem Sosial
- [ ] Profil pribadi: foto, username, bio, followers/following, grid trip, tombol Edit & Pengaturan (`Screen8Profile`).
- [ ] Profil user lain — akun **publik**: tombol Follow + grid trip dengan `trips.is_public=true` (`Screen10PublicProfile`).
- [ ] Profil user lain — akun **privat**, viewer **bukan follower**: tampil terbatas (avatar, username, nama, stats, Follow); bio & grid trip disembunyikan; banner akun privat.
- [ ] Profil user lain — akun **privat**, viewer **follower**: profil lengkap + grid trip (`trips.is_public=true`).
- [ ] Edit profil: ubah bio + toggle akun privat/publik (`Screen9EditProfil`).
- [ ] Trip `is_public=false` tidak muncul di grid profil milik orang lain (hanya via Beranda/partisipasi).
- [ ] Pencarian username/nama + follow/unfollow; akun privat tetap discoverable (`Screen7SearchUser`).
- [ ] Pengaturan: menu akun, dukungan, logout (`Screen11Settings`).
- [ ] Menerima undangan trip otomatis mutual follow (follower dapat melihat trip grid jika akun privat).

## 4. Manajemen Perjalanan & Destinasi
- [ ] Form buat perjalanan via FAB "+" — modal full-screen (`Screen12Create`).
- [ ] Input nama (wajib), tags dinamis (chip + hapus), kalender rentang tanggal.
- [ ] Tombol "+ Tambah Kandidat Tanggal" menambah kalender kandidat (`Screen13MultiDatePicker`).
- [ ] Validasi form menampilkan error inline merah saat field wajib kosong (`Screen14FormValidation`).
- [ ] 1 tanggal → `status=fixed`; >1 tanggal → `status=voting_pending`.
- [ ] Detail trip punya 3 tab: **Destinasi · Voting · Chat** (`Screen15Destinations`, `Screen16Voting`, `Screen17Chat`).
- [ ] Bottom sheet tambah destinasi: nama (wajib), maps link, referensi sosmed (`Screen18BottomSheetDestinasi`).
- [ ] Tap destinasi → detail sheet dengan snippet peta & link referensi (`Screen19DestinationDetail`).
- [ ] Empty state destinasi + tombol tambah.
- [ ] Card destinasi: tombol buka Maps dan ikon referensi media sosial.

## 5. Kolaborasi, Voting & Grup Chat
- [ ] Undang partisipan via username atau email — bottom sheet (`Screen20BottomSheetUndang`).
- [ ] Undangan pending tampil di tab "Undangan" dan layar Notifikasi.
- [ ] Tab Voting: card kandidat + vote count + tombol Vote (`Screen16Voting`).
- [ ] Hanya creator yang bisa "Kunci Tanggal Ini".
- [ ] Setelah lock: banner "Jadwal Dikunci" di tab Voting (`Screen21StatusLocked`).
- [ ] Modal sukses sync kalender tampil setelah lock (`Screen22CalendarSyncModal`).
- [ ] Chat: bubbles chronological, input kirim, empty state (`Screen23EmptyChat`).
- [ ] Long press pesan: menu Balas, Salin Teks, Hapus (`Screen24ChatLongPress`).
- [ ] Chat hanya bisa diakses partisipan resmi.

## 6. Wishlist
- [ ] Grid/List view + filter/sort by tags & prioritas (`Screen25Wishlist`).
- [ ] FAB "+" → bottom sheet form: nama, link, tags, prioritas (`Screen26BottomSheetWishlist`).
- [ ] Empty state saat wishlist kosong.

## 7. System States & Design
- [ ] Skeleton loading tampil saat fetch data (`Screen28SkeletonLoading`).
- [ ] Toast success (teal), error (coral), offline/info (`Screen29ToastComponents`).
- [ ] Error 404/offline screen + tombol retry (`Screen30Error`).
- [ ] Warna, typography, radius mengikuti design tokens (`Screen32DesignTokens`, `colors.ts`).
- [ ] Bottom nav: Beranda, Cari, [+], Wishlist, Profil — tab aktif coral, inactive muted.
- [ ] Dark mode variant Beranda (`Screen31DarkBeranda`) — opsional M12.

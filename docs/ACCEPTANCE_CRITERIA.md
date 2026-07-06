# Acceptance Criteria (Kriteria Penerimaan)

> **Tujuan dokumen ini**: Checklist UAT lengkap untuk memverifikasi bahwa aplikasi mobile sesuai desain Figma (**125 layar**) dan spesifikasi MVP. Referensi: [docs/FIGMA.md](docs/FIGMA.md), [docs/WORKFLOW.md](docs/WORKFLOW.md).

---

## 1. Autentikasi & Onboarding
- [ ] Splash screen tampil saat cold start, lalu lanjut ke onboarding atau auth (`Screen1Splash`).
- [ ] Onboarding carousel hanya muncul saat pengguna pertama kali membuka aplikasi (`Screen2EduOnboarding`).
- [ ] Onboarding 4 slide: intro, voting, itinerary timeline, chat trip — dengan preview UI mini di slide 2–4.
- [ ] Login sukses via tombol "Lanjutkan dengan Google" (`Screen3Auth`).
- [ ] Data dasar Google (Nama, Email, Avatar) tersimpan di tabel `users`.
- [ ] Pengguna baru diarahkan ke form username; sistem menolak username duplikat (`Screen4Username`; `GET /v1/users/check-username`).
- [ ] Pengguna lama langsung ke Beranda tanpa form username.

## 2. Beranda & Notifikasi
- [ ] Beranda menampilkan ikon lonceng dengan badge unread (`Screen5Home`).
- [ ] Tab "Mendatang", "Selesai", "Undangan" memfilter daftar trip (`GET /v1/trips?tab=...`).
- [ ] Trip card menampilkan cover, judul, tags, rentang tanggal/waktu, stacked avatars.
- [ ] Empty state tampil saat tidak ada trip (`Screen6EmptyBeranda`).
- [ ] Layar Notifikasi menampilkan tipe: undangan, voting, aktivitas itinerary (`Screen9Notifikasi`).
- [ ] Aksi inline notifikasi berfungsi: terima/tolak undangan, navigasi ke voting/trip.

## 3. Pencarian (Tab Cari)
- [ ] Cari idle dengan riwayat (`Screen10SearchIdle`); bottom nav active = search.
- [ ] Hasil pencarian username/nama — tap baris → profil user (`Screen11SearchUser`).
- [ ] Empty hasil cari (`Screen12SearchNoResults`).
- [ ] Profil publik dari hasil cari (`Screen13PublicProfile`, `Screen14PublicProfileEmptyTrip`).

## 4. Profil & Pengaturan (Tab Profil)
- [ ] Profil pribadi: kartu horizontal (avatar kiri, nama+bio+website kanan), bar stat perjalanan, grid trip (`Screen15Profile`, `Screen16ProfileEmptyTrip`).
- [ ] Username di header; akses Pengaturan via ikon ⚙ (bukan tombol Edit di kartu).
- [ ] Edit profil: bio + website/sosial (`Screen18EditProfil`) — akses dari kartu profil di Pengaturan.
- [ ] Pengaturan: kartu profil teratas → Edit; section Bantuan lalu Akun (`Screen17Settings`, `Screen19SettingsHelpFaq`, `Screen20SettingsDeleteAccount`).

## 5. Manajemen Perjalanan & Itinerary
- [ ] Form buat perjalanan via FAB "+" — state variants §6 (`Screen21`–`Screen34`, dll.).
- [ ] Input nama (wajib), tags, kalender, toggle sepanjang hari + jam.
- [ ] Multi kandidat tanggal + validasi sekaligus (`Screen31`, `Screen33FormValidation`).
- [ ] Undang: search kosong → hasil / kosong / terundang / email (`Screen35`–`Screen41`) — **tanpa** daftar saran teman atau konfirmasi email terpisah.
- [ ] Detail trip **4 tab**: Itinerary · Voting · Chat · Media.
- [ ] Itinerary: timeline multi-hari, state waktu, empty (`Screen42ItineraryEmpty`, `Screen43Destinations`, `Screen44DestinationsFixedDate`).
- [ ] Bottom sheet tambah/edit aktivitas + cover (`Screen45`–`Screen54`).
- [ ] Tab Media: unggah, cover, dari chat (`Screen93TripDocuments`, `Screen94MediaFromChat`).

## 6. Kolaborasi, Voting & Chat
- [ ] Tab counter: Itinerary (jumlah), Voting (hidden jika 0), Chat (unread), Media (always, incl. 0).
- [ ] Voting empty: badge 0, CTA buat voting (`Screen57VotingEmpty`).
- [ ] Multi-voting collapse Tanggal / Aktivitas / Lainnya (`Screen56Voting`).
- [ ] Sheet buat/edit/hapus voting; pipeline selesai (`Screen56`–`Screen75`).
- [ ] Sheet **Detail Voting** / **Edit Voting** — jenis via badge; voting tanggal **tanpa** field judul di form.
- [ ] Chat: bubbles, lampiran, kirim media (`Screen77`–`Screen85`), empty (`Screen86`).
- [ ] Long press: pesan orang lain tanpa Hapus (`Screen87`); pesan sendiri dengan Hapus (`Screen88`).
- [ ] Balas pesan: quote di bubble — 4 skenario (`Screen89`–`Screen92`).
- [ ] Kelola trip menu ⋮: anggota + pending (`Screen97`–`Screen102`), edit, hapus, kalender (`Screen103`, `Screen95`, `Screen96`).

## 7. Wishlist Aktivitas
- [ ] Header **Wishlist Aktivitas** — grid-only (`Screen105Wishlist`).
- [ ] Filter prioritas + tag + search; empty states (`Screen104`, `Screen106`).
- [ ] Form tambah/edit: urutan field + CTA **Simpan Aktivitas** (`Screen107`, `Screen108`, `Screen109`).
- [ ] Detail + menu ⋮ + Jadikan Perjalanan (`Screen110`–`Screen117`).

## 8. System States & Design
- [ ] Skeleton, toast, error (`Screen118`–`Screen120`).
- [ ] Design tokens (`Screen125DesignTokens`, `colors.ts`).
- [ ] Bottom nav: Beranda, Cari, [+], Wishlist, Profil.
- [ ] Dark mode Beranda opsional (`Screen124DarkBeranda`).
- [ ] Media viewer (`Screen121`–`Screen123`).

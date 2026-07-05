# Acceptance Criteria (Kriteria Penerimaan)

> **Tujuan dokumen ini**: Checklist UAT lengkap untuk memverifikasi bahwa aplikasi mobile sesuai desain Figma (**112 layar**) dan spesifikasi MVP. Referensi: [docs/FIGMA.md](docs/FIGMA.md), [docs/WORKFLOW.md](docs/WORKFLOW.md).

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
- [ ] Layar Notifikasi menampilkan tipe: undangan, voting, aktivitas itinerary (`Screen27Notifikasi`).
- [ ] Aksi inline notifikasi berfungsi: terima/tolak undangan, navigasi ke voting/trip.

## 3. Pencarian (Tab Cari)
- [ ] Cari idle dengan riwayat (`Screen35SearchIdle`); bottom nav active = search.
- [ ] Hasil pencarian username/nama — tap baris → profil user (`Screen7SearchUser`).
- [ ] Empty hasil cari (`Screen40SearchNoResults`).
- [ ] Profil publik dari hasil cari (`Screen10PublicProfile`, `Screen37PublicProfileEmptyTrip`).

## 4. Profil & Pengaturan (Tab Profil)
- [ ] Profil pribadi: foto, username, bio, grid trip, Edit & Pengaturan (`Screen8Profile`, `Screen36ProfileEmptyTrip`).
- [ ] Edit profil: bio + link sosial (`Screen9EditProfil`).
- [ ] Pengaturan: menu akun, bantuan, hapus akun (`Screen11Settings`, `Screen39SettingsHelpFaq`, `Screen38SettingsDeleteAccount`).

## 5. Manajemen Perjalanan & Itinerary
- [ ] Form buat perjalanan via FAB "+" — state variants §6 (`Screen12Create`, `Screen78`, dll.).
- [ ] Input nama (wajib), tags, kalender, toggle sepanjang hari + jam.
- [ ] Multi kandidat tanggal + validasi sekaligus (`Screen13`, `Screen14FormValidation`).
- [ ] Undang: search kosong → hasil / kosong / terundang — **tanpa** daftar saran teman (`Screen20`, `Screen43`–`Screen45`, `Screen84`).
- [ ] Detail trip **4 tab**: Itinerary · Voting · Chat · Media.
- [ ] Itinerary: timeline multi-hari, state waktu, empty (`Screen77ItineraryEmpty`, `Screen15`, `Screen72`).
- [ ] Bottom sheet tambah/edit aktivitas + cover (`Screen18`, `Screen85`–`Screen93`).
- [ ] Tab Media: unggah, cover, dari chat (`Screen41`, `Screen98`).

## 6. Kolaborasi, Voting & Chat
- [ ] Tab counter: Itinerary (jumlah), Voting (hidden jika 0), Chat (unread), Media (always, incl. 0).
- [ ] Voting empty: badge 0, CTA buat voting (`Screen107VotingEmpty`).
- [ ] Multi-voting collapse Tanggal / Aktivitas / Lainnya (`Screen16Voting`).
- [ ] Sheet buat/edit/hapus voting; pipeline selesai (`Screen42`, `Screen53`–`Screen66`, `Screen21`, `Screen48`–`Screen49`).
- [ ] Chat: bubbles, lampiran, kirim media (`Screen97`–`Screen106`), empty (`Screen23`), long press + hapus (`Screen24`).
- [ ] Kelola trip menu ⋮: anggota, edit, hapus, kalender (`Screen50`–`Screen52`, `Screen22`).

## 7. Wishlist Aktivitas
- [ ] Header **Wishlist Aktivitas** — grid-only (`Screen25Wishlist`).
- [ ] Filter prioritas + tag + search; empty states (`Screen108`, `Screen110`).
- [ ] Form tambah/edit: urutan field + CTA **Simpan Aktivitas** (`Screen111`, `Screen26`, `Screen112`).
- [ ] Detail + menu ⋮ + Jadikan Perjalanan (`Screen113`–`Screen120`).

## 8. System States & Design
- [ ] Skeleton, toast, error (`Screen28`–`Screen30`).
- [ ] Design tokens (`Screen32DesignTokens`, `colors.ts`).
- [ ] Bottom nav: Beranda, Cari, [+], Wishlist, Profil.
- [ ] Dark mode Beranda opsional (`Screen31DarkBeranda`).
- [ ] Media viewer (`Screen94`–`Screen96`).

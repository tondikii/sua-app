# Product Requirements Document (PRD)

> **Tujuan dokumen ini**: Spesifikasi MVP lengkap selaras dengan **125 layar** high-fidelity Figma di folder `figma/`. Inventori layar, design tokens, dan workflow lengkap: [docs/FIGMA.md](docs/FIGMA.md).

---

## 1. Autentikasi & Onboarding
* Splash screen singkat saat cold start (`Screen1Splash`).
* Layar *Onboarding* carousel hanya saat pengguna pertama kali membuka aplikasi (`Screen2EduOnboarding`) — 4 slide:
  1. **Intro** — "Realisasikan Wacana Liburanmu"
  2. **Voting** — Sepakat jadwal → Vote Bareng, Hasil Jelas (+ preview mini voting)
  3. **Itinerary** — Rencana berserakan → Timeline Harian yang Jelas (+ preview mini itinerary)
  4. **Chat** — Chat trip kecampur → Ruang Diskusi Khusus Trip (+ preview mini chat)
* Login sukses via Google Sign-In (`Screen3Auth`).
* Pengguna baru wajib membuat *username* unik (`Screen4Username`).

## 2. Beranda & Notifikasi
* Beranda menampilkan trip card dengan **cover** (dari tab Media), judul, tags, tanggal/waktu, stacked avatars (`Screen5Home`).
* Tab: "Mendatang", "Selesai", "Undangan".
* **Notifikasi in-app** (`Screen9Notifikasi`): undangan, reminder voting (multi-tipe), aktivitas itinerary baru — diakses via lonceng di header Beranda.

## 3. Pencarian (Tab Cari)
* Idle, hasil, kosong, profil publik dari hasil cari — lihat WORKFLOW §4.

## 4. Profil (Tab Profil) & Pengaturan
* Profil pribadi & publik, edit profil, pengaturan (Bantuan, Hapus Akun) — lihat WORKFLOW §5.

## 5. Manajemen Perjalanan (Core)
* **Pembuatan Trip** (`Screen22Create`, `Screen31MultiDatePicker`, state variants §6):
  * Nama, tags, kalender rentang tanggal, **waktu** (all-day default; jika off → jam mulai & selesai).
  * Multi kandidat tanggal → auto-buat **voting tanggal**.
* Validasi form — error sekaligus (`Screen33FormValidation`).
* **Undangan setelah buat** (`Screen35`–`Screen41`): pencarian username/email — **tanpa** daftar saran teman.
* **Detail Trip** — tab **Itinerary · Voting · Chat · Media**:
  * **Itinerary**: timeline multi-hari, aktivitas berjadwal (waktu mulai/selesai), cover Maps/icon/media, sheet tambah/edit (`Screen43Destinations`, `Screen45BottomSheetDestinasi`, §7).
  * **Voting**: multi-voting concurrent — Tanggal / Aktivitas / Lainnya, UI collapse + pipeline selesai (`Screen56Voting`, §8). Sheet **Detail Voting** / **Edit Voting** — jenis via badge; form tanggal tanpa judul. Tab Voting hanya tampil jika masih ada voting aktif; badge counter voting selalu **0** saat empty.
  * **Chat**: grup internal + lampiran foto/video + long press + balas pesan (`Screen76Chat`, `Screen87`/`Screen88`, `Screen89`–`Screen92`, §9).
  * **Media**: unggah foto/video; **cover trip** dipilih dari media (`Screen93TripDocuments`, §10). Counter tab **selalu tampil** meskipun 0.

## 6. Kolaborasi & Kalender
* **Undangan** (§5 + §11 Kelola Trip): username atau email — flow search kosong → hasil / kosong / sebagian terundang / terundang; email `Screen39` → `Screen40`.
* **Google Calendar** (`Screen96CalendarSyncModal`): menu ⋮ di detail trip → tambah event ke **kalender sendiri** via OAuth Google (opsional, M11).
* **Kelola Trip** (menu ⋮): anggota + pending (`Screen97`–`Screen102`), edit info, hapus (`Screen103`, `Screen95`, §11).

## 7. Wishlist Aktivitas
* **Header**: "Wishlist Aktivitas" — grid-only (tanpa list view).
* **Filter/Sort**: tab prioritas (Semua/Tinggi/Menengah/Rendah) + filter tag + search bar.
* **FAB "+"** → bottom sheet form selaras `ActivityFormSheet`:
  1. Mulai / Selesai (waktu)
  2. Nama Aktivitas (wajib)
  3. Prioritas (Tinggi / Menengah / Rendah — tombol berwarna)
  4. Google Maps (opsional)
  5. Link Lainnya (opsional)
  * CTA: **Simpan Aktivitas**
* **State variants** (`Screen104`–`Screen113`): empty, filter kosong, form kosong/terisi/validasi, detail, edit, menu ⋮, hapus.
* **Menu ⋮ card**: Edit · Hapus · **Jadikan Perjalanan**
* **Jadikan Perjalanan** (`Screen114`–`Screen117`):
  * Prefill nama & tags trip dari wishlist
  * Setelah buat → undang + banner wishlist dihapus
  * Item dikonversi jadi **1 aktivitas** di tab Itinerary hari pertama
* **Interaksi Data**: `GET/POST/PUT/DELETE /v1/wishlists` · konversi → `POST /v1/trips` + aktivitas itinerary

## 8. System UX (Non-Functional UI)
* Skeleton, toast, error, dark mode, design tokens, media viewer (§13) — masing-masing layar unik; tidak diduplikasi di registry preview.

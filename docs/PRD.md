# Product Requirements Document (PRD)

> **Version**: 2.0 — Juli 2026 · Referensi milestone & endpoint disesuaikan dengan backend NestJS baru (`docs/ARCHITECTURE.md` v2.0); `trip_destinations` → `trip_activities`.

> **Tujuan dokumen ini**: Spesifikasi MVP lengkap selaras dengan **125 layar** high-fidelity Figma di folder `figma/`. Inventori layar, design tokens, dan workflow lengkap: [docs/FIGMA.md](docs/FIGMA.md).

---

## 1. Autentikasi & Onboarding

> **Registry Figma**: WORKFLOW §1 layar 1–2 · WORKFLOW §2 layar 3–4 · **Panduan agent**: [WORKFLOW.md § Panduan Implementasi §1–§3](WORKFLOW.md#panduan-implementasi-13-ai-agent-be--fe)
>
> **Mapping nomor**: PRD §1 = WORKFLOW §1 + §2. PRD §2 (Beranda) = WORKFLOW §3. Gunakan label `App.tsx` sebagai sumber kebenaran UI.

### 1.1 Splash (`Screen1Splash`)

- Tampil singkat saat **cold start** — gradient coral (`#FF8A65` → `#FF6B6B` → `#F94E4E`), ikon **kompas** dalam container rounded, nama app, tagline _"Rencanakan. Jelajahi. Kenang."_, progress bar bawah.
- Setelah splash: cek JWT valid → Beranda (PRD §2 / WORKFLOW §3); jika tidak ada JWT → lanjut §1.2 atau §1.3.

### 1.2 Onboarding Edukasi (`Screen2EduOnboarding`)

- Hanya saat **first launch** (flag `has_completed_onboarding` di DataStore lokal).
- Carousel **4 slide** — konten scroll penuh; pagination dots (klikable) + CTA fixed bawah:
  1. **Intro** — eyebrow _"Selamat datang"_ · judul _"Realisasikan Wacana Liburanmu"_ · subtitle _Janjian "nanti jalan-jalan" sering mandeg? Sepakat jadwal, susun aktivitas, dan update bareng — semuanya di satu trip._ · hero image + `AppBadge`
  2. **Voting** — Masalah: _Sepakat Jadwal Susah Banget_ → Solusi: _Vote Bareng, Hasil Jelas_ · preview mini voting (tab trip + 3 kandidat tanggal)
  3. **Itinerary** — Masalah: _Rencana Berserakan, Urutan Nggak Jelas_ → Solusi: _Timeline Harian yang Jelas_ · preview mini itinerary multi-hari (21 aktivitas / 4 hari, state _Sekarang_, gap kosong)
  4. **Chat** — Masalah: _Chat Trip Kecampur_ → Solusi: _Ruang Diskusi Khusus Trip_ · preview mini chat (bubble teks + foto)
- CTA: _"Selanjutnya →"_ (slide 1–3) · _"Mulai Sekarang"_ (slide 4). Tidak ada tombol skip.
- Setelah selesai (atau bukan first-launch): arahkan ke §1.3.

### 1.3 Login (`Screen3Auth`)

- Hero ~46%: foto travel + overlay gradient; logo app coral + _"Atur Perjalanan"_ + tagline _Rencanakan. Jelajahi. Kenang._
- Headline _"Mulai Perjalananmu"_; subtext _"Bergabung dan rencanakan perjalanan seru bersama orang-orang tersayang."_
- **MVP — aktif**: tombol **"Lanjutkan dengan Google"** (Warm Coral `#FF6B6B`, tinggi 52, radius 16) → `POST /v1/auth/google`.
- **Post-MVP — desain ada, belum fungsional**: tombol **"Masuk dengan Email"** (outline) + divider _"atau"_ — tidak ada layar/endpoint email auth di MVP; mobile **sembunyikan atau nonaktifkan** sampai post-MVP.
- Footer legal: _"Dengan melanjutkan, kamu menyetujui Syarat & Ketentuan serta Kebijakan Privasi kami."_ (link coral).

### 1.4 Buat Username (`Screen4Username`)

- Wajib untuk pengguna baru (`is_new_user: true` dari Google login).
- Judul _"Buat username"_; subtitle: _"Ini nama yang akan dilihat teman saat kamu diundang ke perjalanan."_
- Label _"Username"_; input dengan ikon `@`; hint _"Huruf, angka, dan underscore (\_) · min. 3 karakter"_; validasi real-time via `GET /v1/users/check-username`:
  - **Aturan**: huruf, angka, underscore (`_`) · min. 3 · max. 30 karakter
  - **Tersedia**: border teal + ikon check + teks _"Username tersedia"_ (teal)
  - **Tidak tersedia / format salah**: border coral + pesan error inline (implementasi mobile; preview Figma = happy path)
- **Saran username** (chips client-only, contoh `budi_travel`, `budijs`, `budi_explore`).
- CTA sticky _"Lanjutkan"_ → `POST /v1/auth/complete-registration` → Beranda (PRD §2 / WORKFLOW §3).
- Pengguna lama (`is_new_user: false`) langsung ke Beranda tanpa layar ini.

## 2. Beranda & Notifikasi

> **Registry Figma**: WORKFLOW §3 / `App.tsx` id: 3 layar 5–9 · Shared UI: `figma/src/app/components/home/HomeBerandaParts.tsx` · **Panduan agent**: [WORKFLOW.md § Panduan Implementasi §1–§3](WORKFLOW.md#panduan-implementasi-13-ai-agent-be--fe)

### 2.1 Shell Beranda (`HomePageShell`)

- Entry point utama setelah login — **Tab 1** bottom nav (`BottomNav` active=`home`).
- Safe area atas 60px; `HomeScrollBody` padding `20px 22px 112px`, gap 16 (aman dari FAB nav).

### 2.2 Header & Lonceng (`HomeHeader`, `NotificationBell`)

- Judul **"Perjalananku"** (22/800) + ikon lonceng (40×40, bg `C.light`, radius 12).
- Badge unread coral pada lonceng — `GET /v1/notifications/unread-count` → `unread_count`; cap **9+**; disembunyikan jika 0.
- Tap lonceng → push `Screen9Notifikasi` (full-page, tanpa bottom nav).

### 2.3 Tab View (`HomeTabs`)

- Tiga tab dengan **counter badge** (selalu tampil, termasuk 0):
  - **Mendatang** — `GET /v1/trips?tab=upcoming`
  - **Selesai** — `GET /v1/trips?tab=completed`
  - **Undangan** — `GET /v1/trips/invitations` (counter = pending count)
- Tab aktif: label coral 14/700 + underline 2.5px; counter pill `coralLight`.

### 2.4 Trip Card — Tab Mendatang (`Screen5Home`)

- Cover 150px (`cover_image_url`), judul 16/800, **tags** (`TripTags` card — max 3 + `+N`, format `#Tag`), rentang tanggal + ikon `Calendar`, **stacked avatars** (26px, overlap -9px, max 4 di FE).
- `status=voting_pending` → **`"Tanggal sedang divoting"`**; fixed → `3–7 Jul 2026 · Sepanjang hari` atau `20–24 Agu 2026 · 08:00 – 17:00` (🔜 M4).
- Tap card → detail trip.

### 2.5 Empty State — Tab Mendatang (`Screen6EmptyBeranda`)

- Hanya tab Mendatang kosong (registry tidak punya empty Selesai/Undangan).
- `EmptyTripsIllustration` kompas; judul _"Belum ada perjalanan"_; deskripsi _"Mulai rencanakan liburan pertamamu bersama teman-teman."_
- CTA **"Buat Perjalanan Baru"** (coral + `Plus`) → create trip (§6 / FAB).

### 2.6 Tab Selesai (`Screen7HomeSelesai`)

- `TripCard` **`dimmed`**: opacity 0.92, cover `grayscale(20%)`.

### 2.7 Tab Undangan (`Screen8HomeUndangan`)

- **`InvitationCard`**: cover 120px + gradient overlay; _"Diundang oleh **@username**"_; judul; tanggal; **Terima** (coral 40px) / **Tolak** (bg light, border).
- `PUT /v1/trips/:tripId/invitations/:id` `{accept: true|false}` → 204.
- 🔜 M4: `start_date`/`end_date`/`status` di `trip` summary invitation.

### 2.8 Notifikasi (`Screen9Notifikasi`)

- Full-page bg `C.light`; header _"Notifikasi"_ + **"Tandai semua dibaca"** → `PUT /v1/notifications/read-all`.
- Kartu radius 18; unread = border coral + dot 8px; avatar 44 + badge ikon 20.

| Contoh UI (`Screen9Notifikasi.tsx`)                                       | BE `type`                        | Aksi                    |
| ------------------------------------------------------------------------- | -------------------------------- | ----------------------- |
| _Budi mengundangmu ke **Lombok Escape**_                                  | `invite`                         | Terima · Tolak          |
| _Voting Tanggal **Bali Trip** segera berakhir._                           | `voting_deadline`                | Vote Sekarang → (amber) |
| _Voting Destinasi **Raja Ampat** deadline besok._                         | `voting_deadline` 🔜 `poll_type` | Vote Sekarang →         |
| _Rina menambahkan aktivitas **Sunrise di Puncak Jayagiri** di Bali Trip._ | `destination_update`             | Tap → trip              |
| _Perjalanan **Bali Trip** berangkat 5 Agu, 08:00. Siap-siap!_              | `trip_start_soon`                | Tap → trip              |

> Hydrate `actor_id`/`trip_id` di FE. Payload `invite` saat ini `{}` — lookup `invitation_id` via `GET /v1/trips/invitations`. 🔜 M9 enriched DTO.

## 3. Pencarian (Tab Cari)

> **Registry**: WORKFLOW §4 / `App.tsx` id: 4 (layar 10–14) · PRD §3 = WORKFLOW §4

### 3.1 Idle (`Screen10SearchIdle`)

- Tab 2 bottom nav; `SearchBar` placeholder **"Cari nama atau username..."**
- Riwayat **Pencarian terakhir** (client-only, max ~10); row: avatar + nama + `@username`.
- Helper: _"Temukan teman untuk diajak merencanakan liburan bareng."_

### 3.2 Hasil (`Screen11SearchUser`)

- Debounce 300–500ms → `GET /v1/users/search?q=`
- Label _"{n} hasil ditemukan"_; row: nama, `@username`, _"{n} perjalanan"_, chevron.
- Tap → profil publik (`Screen13` / `Screen14`).

### 3.3 Kosong (`Screen12SearchNoResults`)

- _"0 hasil ditemukan"_; `SearchEmptyState`: _Tidak ada hasil_ + deskripsi ejaan.

### 3.4 Profil Publik (`Screen13PublicProfile`, `Screen14PublicProfileEmptyTrip`)

- Push screen tanpa bottom nav; header = username; `ProfileCard` + grid trip **publik** saja.
- Empty stranger: _"Pengguna ini belum memiliki perjalanan."_
- API: `GET /v1/users/:username`, `GET /v1/users/:username/trips`.

## 4. Profil (Tab Profil) & Pengaturan

> **Registry**: WORKFLOW §5 / `App.tsx` id: 5 (layar 15–20) · PRD §4 = WORKFLOW §5

### 4.1 Profil Pribadi (`Screen15Profile`, `Screen16ProfileEmptyTrip`)

- `ProfileHeader` username center + ⚙ Pengaturan; `ProfileCard` horizontal + stat Perjalanan.
- Grid semua trip creator; empty owner → CTA **Buat Perjalanan Baru** compact.

### 4.2 Pengaturan (`Screen17Settings`)

- Kartu profil atas → Edit; section Bantuan & Legal (FAQ, Privasi, S&K); section Akun (Hapus Akun); kartu terpisah **Keluar**.

### 4.3 Edit Profil (`Screen18EditProfil`)

- Bio max 150 + counter; username read-only; website & ubah foto 🔜 M3; `PUT /v1/users/me` `{bio}`.

### 4.4 Bantuan & Hapus Akun (`Screen19`, `Screen20`)

- FAQ accordion 5 item; kontak `bantuan@aturperjalanan.id`.
- Hapus akun: ketik username konfirmasi + destructive CTA; `DELETE /v1/users/me` 🔜 M3.

## 5. Manajemen Perjalanan (Core)

> **Registry Figma**: WORKFLOW §6 / `App.tsx` id: 6 layar 21–41 · Shared: `trip/CreateTripParts.tsx`, `trip/InviteParts.tsx`

### 5.1 Buat Perjalanan — Modal (`CreateTripShell`)

**Entry**: FAB **[+]** (bottom nav) · CTA **Buat Perjalanan Baru** (Beranda empty §2.4, Profil empty §4.1).

| Field                     | Aturan                                                         |
| ------------------------- | -------------------------------------------------------------- |
| Nama perjalanan           | Wajib                                                          |
| Tags                      | Opsional; chip teal removable                                  |
| Kalender                  | Rentang tanggal wajib (Mode A) atau sumber kandidat (Mode B)   |
| Waktu                     | Toggle _Sepanjang hari_ default on; off → jam mulai & selesai  |
| + Tambah Kandidat Tanggal | Dari Mode A → switch Mode B; di Mode B → simpan kandidat aktif |

### 5.2 Mode A — Tanggal pasti (`Screen21`–`Screen24`)

- Satu rentang kalender → `POST /v1/trips/` dengan `start_date`/`end_date` → `status=fixed`.
- State variants: form kosong (21) · draft + waktu custom (22) · siap submit all-day (23) · validasi error sekaligus (24).
- Validasi: nama kosong + tanggal belum dipilih — tampil bersamaan; CTA disabled.

### 5.3 Mode B — Kandidat tanggal (`Screen25`–`Screen34`)

- **1–3 kandidat** rentang tanggal → `status=voting_pending` + auto voting tanggal di tab Voting (§8).
- Alur: pilih rentang → kandidat aktif (highlight coral) → tap _+ Tambah Kandidat_ → tersimpan → ulangi.
- Field _Tenggat voting tanggal_ opsional; muncul setelah kandidat pertama tersimpan (`Screen28+`).
- State variants lengkap: tooltip info (26) · progres simpan 1→3 (27–32) · validasi (33) · loading submit (34).
- Validasi: nama kosong + belum ada kandidat **tersimpan** — tampil bersamaan.

### 5.4 Undangan setelah buat (`Screen35`–`Screen41`)

- Layar full-screen pasca-create — header sukses + pencarian username/email.
- Flow: search kosong → hasil / kosong / sebagian terundang / daftar terundang.
- Email belum terdaftar → **Undang lewat Email** → banner terkirim (`Screen39` → `Screen40`, tanpa konfirmasi terpisah).
- CTA **Masuk ke Perjalanan** untuk lewati undangan.
- **Tidak ada** daftar saran teman; batalkan undangan pending per baris (`Screen41`, 🔜 `DELETE …/invitations/:id` M4).

### 5.5 Detail Trip — Tab Itinerary (§7)

> Layar 42–55 · Shared: `ItineraryParts.tsx`, `ActivityParts.tsx`

- **Shell** (`TripDetailPageShell`): 4 tab + counter; subtitle trip = tanggal pasti atau _Tanggal sedang divoting_.
- **Empty** (`Screen42`): CTA **Buat Aktivitas Pertama**; counter itinerary 0.
- **Timeline** (`Screen43`–`44`):
  - Multi-hari dengan tab Hari 1 / Hari 2; window harian (contoh 07:00–20:00).
  - Gap otomatis: _{jam} – {jam} · Tidak ada aktivitas_.
  - State waktu via `resolveItineraryTimeState`: Selesai / Berlangsung (**Sekarang**) / Akan datang / Terjadwal (saat divoting).
  - Jenis: gather, transport, meal, activity, destination.
- **Tambah/edit** (`ActivityFormSheet`, `Screen45`–`48`, `54`):
  - Urutan: Mulai/Selesai → Nama → Cover → Google Maps → Link Lainnya.
  - Maps paste → resolve nama tempat + cover otomatis (jika ada thumb).
  - Cover: Maps · media trip · galeri · 32 icon ilustrasi (`ActivityCoverPickerSheet`).
  - CTA: **Simpan Aktivitas** / **Simpan Perubahan**.
- **Detail** (`ActivityDetailSheet`, `Screen51`–`53`): read-only + tautan Maps & ref links.
- **Menu item** (`Screen55`): dropdown ⋮ **Edit** · **Hapus** (bukan sheet penuh).

### 5.6 Detail Trip — Tab Voting (§8)

> Layar 56–75 · Shared: `VotingParts.tsx`, `CreateVotingSheetParts.tsx`

- **Hub multi-voting**: collapse per jenis — Tanggal · Aktivitas (`destinasi`) · Lainnya (`Screen56`).
- **Empty** (`Screen57`): trip tanggal pasti, belum ada poll aktivitas/lainnya; CTA _Buat Voting Baru_.
- **Status**: aktif → Selesai (manual _Akhiri_) / Berakhir (tenggat); card tetap di pipeline.
- **Buat voting**: max 1 poll aktif per jenis; `Screen64`→`65` (aktivitas/lainnya); `Screen58`→`59`–`63` (tanggal ulang).
- **Form**: tanggal tanpa judul (card = _Tanggal Perjalanan_); aktivitas/lainnya punya Judul Voting + kandidat chips.
- **Menu ⋮**: aktif = Edit/Akhiri/Hapus; selesai = Hapus saja (`Screen69`, `Screen71`).
- **Modal akhiri**: tanggal kunci trip (`Screen73`); aktivitas → itinerary (`Screen74`); lainnya (`Screen75`).

### 5.7 Detail Trip — Tab Chat (§9)

> Layar 76–92 · Shared: `ChatParts.tsx`

- **Thread** (`Screen76`): chat grup per trip; bubble coral = pesan sendiri.
- **Lampiran** (`Screen77`): menu **Foto** · **Video**; media otomatis ke tab Media.
- **Composer** (`Screen78`–`81`): kirim foto/video full-screen + caption opsional.
- **Media bubble** (`Screen82`–`85`): gambar/video dalam thread + caption; overlay play untuk video.
- **Empty** (`Screen86`): _Belum ada obrolan_; input nonaktif.
- **Long press** (`Screen87`/`Screen88`): Balas · Salin; **Hapus** hanya pesan sendiri.
- **Reply** (`Screen89`–`92`): `ChatReplyQuote` dalam bubble; 4 skenario quote.
- Tab badge Chat = **unread only**.

### 5.8 Detail Trip — Tab Media (§10)

> Layar 93–94 · Shared: `DocumentParts.tsx`

- **Grid** (`Screen93`): 3 kolom · tile **Unggah** · foto/video + badge **Cover** coral.
- **Dari chat** (`Screen94`): badge **Chat** teal pada `fromChat`; counter media selalu tampil.
- **Jadikan Cover**: set cover trip dari media → card Beranda (`cover_document_id`).
- Media chat (§9) otomatis masuk grid.

### 5.9 Detail Trip — Kelola Trip (§11)

> Layar 95–103 · Akses via menu ⋮ header

- **Menu** (`TripDetailMenuSheet`): 4 aksi — anggota, kalender, edit, hapus.
- **Anggota** (`Screen97`–`102`): search username/email · pending 3 status · creator bisa **Keluarkan**.
- **Edit** (`Screen103`): form selaras buat trip §6 · CTA **Simpan**.
- **Hapus** (`Screen95`): konfirmasi destructive · creator only.
- **Kalender** (`Screen96`): event ke kalender sendiri · M16.

## 6. Kolaborasi & Kalender

- **Undangan** (§6 pasca-create + §11 Kelola Trip): username atau email — flow search → undang / pending / ditolak.
- **Google Calendar** (`Screen96CalendarSyncModal`): menu ⋮ → tambah event ke **kalender sendiri** via OAuth Google (opsional, M16).

## 7. Wishlist Aktivitas (§12)

> Layar 104–117 · Shared: `WishlistParts.tsx` · Tab bottom nav ke-4

- **Header**: _Wishlist Aktivitas_ — grid **2 kolom** (tanpa list view) + tombol **+** di header.
- **Filter/Sort**: tab prioritas (Semua/Tinggi/Menengah/Rendah) + counter · chip tag · search bar.
- **Tambah/Edit** (`Screen107`–`109`, `111`): bottom sheet — urutan field selaras aktivitas §7:
  1. Mulai / Selesai
  2. Nama Aktivitas (wajib)
  3. Prioritas (Tinggi / Menengah / Rendah — tombol berwarna)
  4. Google Maps (opsional)
  5. Link Lainnya (opsional)
  - CTA tambah: **Simpan Aktivitas** · edit: **Simpan Perubahan**
- **Empty** (`Screen104`): _Wishlist masih kosong_ + CTA **Tambah Aktivitas**.
- **Filter kosong** (`Screen106`): _Tidak ada hasil_.
- **Detail** (`Screen110`): cover, prioritas, catatan, tautan · footer **Jadikan Perjalanan**.
- **Menu ⋮ card** (`Screen112`): **Jadikan Perjalanan** · **Edit** · **Hapus**.
- **Hapus** (`Screen113`): modal konfirmasi destructive.
- **Jadikan Perjalanan** (`Screen114`–`Screen117`):
  - Prefill nama & tags trip dari wishlist (`WISHLIST_TO_TRIP`)
  - `Screen114` → `Screen115` pilih tanggal → buat trip
  - `Screen116`: undang + `WishlistRemovedBanner`
  - `Screen117`: **1 aktivitas** di itinerary hari 1 (waktu dari wishlist)
- **Interaksi Data**: `GET/POST/PUT/DELETE /v1/wishlists` · konversi atomic → `POST …/convert-to-trip`

## 8. System UX & Design Tokens (§13)

> Layar 118–125 · Shared: `MediaViewerParts.tsx`, `colors.ts`

- **Skeleton** (`Screen118`): shimmer placeholder Beranda — 2 trip card + _Memuat perjalananmu..._
- **Toast** (`Screen119`): Sukses (teal) · Error (coral) · Info (putih) — auto 3 detik atau tutup manual
- **Offline** (`Screen120`): full-screen _Tidak ada koneksi_ + **Coba Lagi** (bukan halaman 404)
- **Media viewer** (`Screen121`–`123`): fullscreen dari tab Media — foto, video pause/playing, swipe, share, Jadikan Cover
- **Dark mode** (`Screen124`): variant gelap Beranda saja — opsional M17
- **Design tokens** (`Screen125`, `colors.ts`): palette, tipografi, radius, button states — referensi `ui/theme/`

> Empty, validasi, modal konfirmasi tetap di section fitur (§3–§12); tidak diduplikasi di registry §13.

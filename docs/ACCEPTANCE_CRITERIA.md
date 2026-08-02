# Acceptance Criteria (Kriteria Penerimaan)

> **Tujuan dokumen ini**: Checklist UAT lengkap untuk memverifikasi bahwa aplikasi mobile sesuai desain Figma (**125 layar**) dan spesifikasi MVP. Referensi: [docs/FIGMA.md](docs/FIGMA.md), [docs/WORKFLOW.md](docs/WORKFLOW.md) (termasuk **Panduan Implementasi §1–§3**).

---

## 1. Autentikasi & Onboarding

### Splash & Onboarding (WORKFLOW §1 / `App.tsx` id: 1)

- [ ] Registry label: _Splash Screen_ (1), _Edu Onboarding_ (2); accent coral.
- [ ] Splash (`Screen1Splash`): gradient coral, ikon kompas, _"Atur Perjalanan"_, tagline _"Rencanakan. Jelajahi. Kenang."_, progress bar — tampil saat cold start.
- [ ] Jika JWT valid: skip §1–§2, langsung Beranda (WORKFLOW §3).
- [ ] Onboarding carousel hanya first-launch (`Screen2EduOnboarding`); flag `has_completed_onboarding` di DataStore.
- [ ] Slide 1 intro: eyebrow _Selamat datang_; judul _Realisasikan Wacana Liburanmu_; subtitle value prop selaras `Screen2EduOnboarding.tsx`.
- [ ] Slide 2–4: copy masalah/solusi selaras `BRIEF.md` + preview UI mini (voting / itinerary multi-hari / chat).
- [ ] Pagination dots klikable; CTA _Selanjutnya →_ / _Mulai Sekarang_; tidak ada tombol skip.

### Login & Username (WORKFLOW §2 / `App.tsx` id: 2)

- [ ] Registry label: _Login_ (3), _Buat Username_ (4); accent teal.
- [ ] Layar login (`Screen3Auth`): hero + logo, headline _Mulai Perjalananmu_, subtext _Bergabung dan rencanakan perjalanan seru bersama orang-orang tersayang._, tombol **Lanjutkan dengan Google** (coral `#FF6B6B`).
- [ ] Tombol **Masuk dengan Email** tidak fungsional di MVP (sembunyikan atau disabled).
- [ ] Footer _Dengan melanjutkan, kamu menyetujui Syarat & Ketentuan serta Kebijakan Privasi kami._ tampil di layar login.
- [ ] Login Google sukses: data Nama, Email, Avatar tersimpan di `users` (`POST /v1/auth/google`).
- [ ] Pengguna baru → form username (`Screen4Username`); lama → langsung Beranda.
- [ ] Username screen: judul _Buat username_; subtitle undangan; hint _Huruf, angka, dan underscore (\_) · min. 3 karakter_.
- [ ] Username: huruf, angka, underscore (`_`), min. 3, max. 30; cek real-time (`GET /v1/users/check-username`).
- [ ] Username tersedia: border teal + _"Username tersedia"_; duplikat/format salah: border coral + pesan error.
- [ ] Saran username (chips) opsional client-only; CTA _Lanjutkan_ → `POST /v1/auth/complete-registration`.
- [ ] User dengan placeholder username (pernah login, belum set username) diarahkan ke `Screen4Username` (`is_new_user: true`).
- [ ] Token disimpan secure storage; header `Authorization: Bearer` pada request berikutnya.

## 2. Beranda & Notifikasi

> Registry: WORKFLOW §3 / `App.tsx` id: 3 (layar 5–9). PRD §2 = WORKFLOW §3.

### Shell & Header

- [ ] Registry label: _Beranda — Mendatang_ (5) … _Notifikasi_ (9); accent coral.
- [ ] Tab Beranda aktif di bottom nav (`Screen5Home`–`Screen8`); `Screen9` full-page **tanpa** bottom nav.
- [ ] Header judul **"Perjalananku"** + lonceng 40×40; badge `unread_count` (cap **9+**; hidden jika 0).
- [ ] Tap lonceng → push `Screen9Notifikasi`.

### Tab Mendatang / Selesai / Undangan

- [ ] Tiga tab **Mendatang · Selesai · Undangan** dengan counter badge selalu tampil.
- [ ] Trip card Mendatang: cover 150, tags max 3 + `+N`, `Calendar` + dateRange, avatars overlap -9px max 4 (`Screen5Home`).
- [ ] `voting_pending` → _"Tanggal sedang divoting"_; fixed → format tanggal + waktu (contoh _Sepanjang hari_ / _08:00 – 17:00_).
- [ ] Empty Mendatang only: _Belum ada perjalanan_ + _Mulai rencanakan liburan pertamamu bersama teman-teman._ + CTA **Buat Perjalanan Baru** (`Screen6EmptyBeranda`).
- [ ] Tab Selesai: `TripCard` **dimmed** opacity 0.92 + grayscale 20% (`Screen7HomeSelesai`).
- [ ] Tab Undangan: overlay _Diundang oleh @username_; Terima coral / Tolak light (`Screen8HomeUndangan`).

### Notifikasi

- [ ] Header _Notifikasi_ + **Tandai semua dibaca**; kartu unread border coral + dot 8px.
- [ ] Template teks selaras preview: invite, Voting Tanggal, Voting Destinasi, aktivitas baru (`Screen9Notifikasi.tsx`).
- [ ] Aksi: Terima/Tolak (invite); **Vote Sekarang →** amber (voting); tap kartu (aktivitas).
- [ ] `PUT /v1/notifications/:id/read` dan `PUT /v1/notifications/read-all` berfungsi.
- [ ] Terima/Tolak dari notif `invite`: resolve `invitation_id` via `GET /v1/trips/invitations` + `trip_id`.
- [ ] Pagination trip: cursor UUID; notifikasi: cursor RFC3339.

## 3. Pencarian (Tab Cari)

> Registry: WORKFLOW §4 / `App.tsx` id: 4 (layar 10–14).

- [ ] Registry label: _Cari — Idle_ (10) … _Profil Publik — Empty Trip_ (14); accent teal.
- [ ] Tab Cari aktif bottom nav (`Screen10`–`12`).
- [ ] `SearchBar` placeholder _Cari nama atau username..._; border coral saat aktif.
- [ ] Riwayat pencarian terakhir client-only (`Screen10SearchIdle`).
- [ ] Hasil: _N hasil ditemukan_; baris nama + `@username` + _N perjalanan_ + chevron (`Screen11SearchUser`).
- [ ] Empty: _Tidak ada hasil_ + deskripsi ejaan (`Screen12SearchNoResults`).
- [ ] Profil publik: `PageHeader` username; grid trip publik; empty _Pengguna ini belum memiliki perjalanan._ (`Screen13`, `Screen14`).
- [ ] `GET /v1/users/search` dengan debounce; tap hasil → profil publik.

## 4. Profil & Pengaturan (Tab Profil)

> Registry: WORKFLOW §5 / `App.tsx` id: 5 (layar 15–20).

- [ ] Registry label: _Profil & Eksplorasi_ (15) … _Hapus Akun_ (20); accent coral.
- [ ] `ProfileHeader` username center + ⚙ Pengaturan (`Screen15`, `Screen16`).
- [ ] `ProfileCard` horizontal: avatar 64, nama, bio, website `Globe`, `ProfileStats` Perjalanan.
- [ ] Website di profil bisa diklik (buka URL, prefix `https://` otomatis).
- [ ] Grid 2 kolom trip; setiap kartu menampilkan cover, tag, nama, dan rentang tanggal (`Calendar` + `formatDateRange`); empty owner → CTA **Buat Perjalanan Baru** compact.
- [ ] Settings: kartu profil → Edit; Bantuan & Legal; Akun (Hapus Akun); kartu **Keluar** terpisah (`Screen17`).
- [ ] Keluar memakai `ConfirmModal` (bukan `Alert`/`window.confirm`).
- [ ] Edit: nama lengkap bisa diedit (`FocusedTextInput`); foto profil bisa diubah (galeri → presigned R2 → `PUT /users/me/avatar`); bio max 150 + counter; username read-only; Simpan (`Screen18`).
- [ ] Versi app ditampilkan dari `Constants.expoConfig.version` (bukan hardcoded).
- [ ] FAQ 12 item + `bantuan@aturperjalanan.id` (email tappable `mailto:`) (`Screen19`).
- [ ] Hapus akun: ketik username + destructive button (`Screen20`).
- [ ] `GET /v1/users/me`, `PUT /v1/users/me` `{name,bio,website_url}`, `POST /users/me/avatar/presign` + `PUT /users/me/avatar`, grid via `GET /v1/users/{username}/trips`.

## 5. Manajemen Perjalanan & Itinerary

> Registry: WORKFLOW §6 / `App.tsx` id: 6 (layar 21–41). Shared: `CreateTripParts.tsx`, `InviteParts.tsx`.

### Entry & shell (§6)

- [ ] Registry label: _6. Pembuatan Perjalanan — Tab [+]_; accent teal; layar 21–41.
- [ ] Entry FAB **[+]** dan CTA **Buat Perjalanan Baru** (Beranda empty §3, Profil empty §5) → modal `CreateTripShell`.
- [ ] Header: tombol X tutup + judul _Buat Perjalanan_; footer sticky CTA _Buat Perjalanan_ 54px coral.

### Mode A — Tanggal pasti (21–24, 34)

- [ ] `Screen21`: form kosong — nama/tags kosong, kalender muted tanpa seleksi; CTA aktif (validasi pasca-tap).
- [ ] `Screen22`: draft terisi; toggle waktu off; jam 08:00–17:00.
- [ ] `Screen23`: siap submit; toggle _Sepanjang hari_ on (`allDay`).
- [ ] `Screen24`: error nama + tanggal **sekaligus** — field inline + footer disabled + summary bullet.
- [ ] `Screen34`: loading — label _Membuat..._; form non-interaktif.

### Mode B — Kandidat tanggal (25–33)

- [ ] Tap _+ Tambah Kandidat Tanggal_ dari Mode A → switch `dateMode=candidates` (`Screen25`).
- [ ] `Screen26`: tooltip info tombol kandidat (copy voting di detail trip).
- [ ] Alur simpan: pilih rentang → kandidat **aktif** (coral) → tap tombol kandidat highlighted → **tersimpan** (putih).
- [ ] `Screen27`–`31`: progresif 1→3 kandidat; max 3; `Screen32` sembunyikan tombol tambah.
- [ ] Field _Tenggat voting tanggal_ muncul setelah kandidat pertama tersimpan; opsional.
- [ ] `Screen33`: validasi nama + minimal 1 kandidat tersimpan — error sekaligus.

### Waktu & submit

- [ ] Toggle _Sepanjang hari_ default on; off → picker jam/menit; jam sebelum sekarang disabled.
- [ ] `POST /v1/trips/` fixed: `start_date`+`end_date` → `status=fixed`.
- [ ] `POST /v1/trips/` kandidat: `candidates[1-3]` → `status=voting_pending` + `trip_date_candidates`.

### Undang setelah buat (35–41)

- [ ] Setelah create sukses → layar undang (bukan langsung detail).
- [ ] `Screen35`: header _Perjalanan berhasil dibuat!_ + search kosong + **Masuk ke Perjalanan**.
- [ ] `Screen36`–`37`: hasil cari username; badge **✓ Terundang** jika sudah diundang.
- [ ] `Screen38`: tidak ditemukan (`SearchEmptyState`).
- [ ] `Screen39` → `Screen40`: email belum terdaftar → **Undang lewat Email** → banner terkirim (**tanpa** layar konfirmasi terpisah).
- [ ] `Screen41`: daftar terundang + **Batalkan** per baris.
- [ ] **Tidak ada** daftar saran teman.
- [ ] `POST /v1/trips/:id/invitations` username/email; `GET /v1/users/search?q=`.

### Detail trip & itinerary (§7+)

> Registry: WORKFLOW §7 / `App.tsx` id: 7 (layar 42–55). Shared: `ItineraryParts.tsx`, `ActivityParts.tsx`, `TripDetailParts.tsx`.

#### Shell & tab

- [ ] Detail trip **4 tab**: Itinerary · Voting · Chat · Media (`TripDetailTabs`).
- [ ] Counter Itinerary = jumlah aktivitas; Voting counter selalu tampil (termasuk 0); Chat = unread only; Media selalu tampil.
- [ ] Header: judul trip + subtitle tanggal/waktu + back + menu ⋮ (§11).

#### Timeline (42–44, 55)

- [ ] `Screen42`: empty — _Belum ada aktivitas_ + CTA **Buat Aktivitas Pertama**; counter itinerary 0.
- [ ] `Screen43`: `datePending` — 1 hari, gap _Tidak ada aktivitas_, state **Terjadwal**; subtitle _Tanggal sedang divoting_.
- [ ] `Screen44`: multi-hari (2 hari); `referenceNow` 14:00 Hari 1; legend Selesai/Berlangsung/Akan datang; badge **Sekarang** pada item aktif.
- [ ] Gap otomatis antar aktivitas dalam window harian (`buildItineraryTimeline`).
- [ ] Jenis aktivitas: gather · transport · meal · activity · destination — ikon di thumb kosong.
- [ ] `Screen55`: menu ⋮ dropdown **Edit** · **Hapus**; tombol Navigation hanya destination/activity.

#### Sheet tambah/edit (45–50, 54)

- [ ] Form urutan: Mulai/Selesai → Nama Aktivitas → Cover → Google Maps → Link Lainnya.
- [ ] CTA tambah: **Simpan Aktivitas**; edit: **Simpan Perubahan**.
- [ ] `Screen46`: paste Maps → cover otomatis + `mapsPlaceName`.
- [ ] `Screen47`: Maps tanpa thumbnail — hint pilih cover manual.
- [ ] `Screen48`: cover dari media perjalanan (`coverSource=trip_media`).
- [ ] `Screen49`/`50`: picker cover — grid Media / 32 icon ilustrasi; CTA **Gunakan**.
- [ ] Link Lainnya: URL + judul tampilan (setelah URL diisi); **+ Tambah link**.
- [ ] `Screen54`: mode edit — `PUT /activities/:id` (M6).

#### Detail aktivitas (51–53)

- [ ] Tap item → `ActivityDetailSheet`: jam, judul, lokasi, deskripsi, section **Tautan**.
- [ ] Variant cover: foto Maps (51) · icon (52) · tanpa cover (53).

#### API

- [ ] `GET/POST/DELETE /v1/trips/:id/activities` — field minimal (`place_name`, `maps_link`, `reference_link`, `sort_order`).
- [ ] Enriched fields (times, kind, ref_links[], cover_*) 🔜 M6.

#### Tab Media (§10)

- [ ] Registry label: _10. Detail Perjalanan — Tab Media_; accent coral; layar 93–94.
- [ ] `Screen93`: `DocumentGrid` — tile **Unggah** · 3 kolom · badge **Cover** · **Jadikan Cover**.
- [ ] `Screen94`: item `fromChat` + badge **Chat** teal; counter media 5.
- [ ] Tab counter Media **selalu tampil** (termasuk 0).
- [ ] Foto media trip bisa jadi cover aktivitas (`Screen49` §7).

## 6. Kolaborasi, Voting & Chat

> Registry Voting: WORKFLOW §8 / `App.tsx` id: 8 (layar 56–75). Shared: `VotingParts.tsx`, `CreateVotingSheetParts.tsx`.

### Tab Voting (56–75)

- [ ] Registry label: _8. Detail Perjalanan — Tab Voting_; accent teal; layar 56–75.
- [ ] Tab Voting **selalu tampil**; counter selalu tampil termasuk **0** (`TripDetailTabs`).
- [ ] `Screen56`: 3 collapse — Tanggal · Aktivitas · Lainnya; tombol **Vote** / **✓ Voted**; FAB _Buat Voting Baru_.
- [ ] `Screen57`: empty trip tanggal pasti; _Belum ada voting_ + CTA _Buat Voting Baru_.
- [ ] Pipeline status: aktif → **Selesai** (manual) / **Berakhir** (tenggat); card tetap di list.
- [ ] Menu ⋮ aktif (`Screen69`): **Edit** · **Akhiri Voting** · **Hapus**; selesai (`Screen71`): **Hapus** saja.
- [ ] `Screen70`: tanggal ended + pemenang read-only; aktivitas masih aktif.
- [ ] `Screen72`: aktivitas `expired` + pemenang vote terbanyak.

### Sheet buat/edit voting

- [ ] `Screen64` → `Screen65`: pilih jenis → Detail (judul + kandidat + tenggat) → **Buat Voting**.
- [ ] `Screen64`: Tanggal disabled + _Sedang berlangsung_ jika poll tanggal aktif.
- [ ] `Screen58`–`63`: buat ulang voting tanggal setelah selesai; form **tanpa** judul.
- [ ] `Screen60`/`62`: picker kandidat tanggal + **Simpan Kandidat**.
- [ ] `Screen66` edit aktivitas · `Screen67` edit tanggal (**tanpa** back) · CTA **Simpan**.

### Modal voting

- [ ] `Screen68`: konfirmasi hapus — _Hapus voting?_
- [ ] `Screen73`: kunci tanggal (creator) → modal _Voting Tanggal Perjalanan Selesai_
- [ ] `Screen74`: aktivitas selesai → pemenang masuk itinerary
- [ ] `Screen75`: voting lainnya selesai

### Chat & kelola (§9, §11)

> Registry Chat: WORKFLOW §9 / `App.tsx` id: 9 (layar 76–92). Shared: `ChatParts.tsx`.

#### Tab Chat (76–92)

- [ ] Registry label: _9. Detail Perjalanan — Tab Chat_; accent charcoal; layar 76–92.
- [ ] `Screen76`: thread grup — bubble coral (saya) / putih+avatar (lain); separator _Hari ini_.
- [ ] `Screen77`: `ChatAttachMenu` — **Foto** · **Video** + catatan tab Media.
- [ ] `Screen78`–`81`: `ChatMediaComposer` — foto/video + caption kosong/terisi; full-screen gelap.
- [ ] `Screen82`–`85`: bubble media terkirim/diterima — foto & video + caption + durasi.
- [ ] `Screen86`: empty _Belum ada obrolan_; input disabled; counter chat 0.
- [ ] `Screen87`: long-press orang lain — **Balas** · **Salin Teks** (tanpa Hapus).
- [ ] `Screen88`: long-press sendiri — tambah **Hapus**; soft delete API.
- [ ] `Screen89`–`92`: reply quote 4 skenario; label **Kamu** untuk pesan sendiri.
- [ ] Tab badge Chat = unread only (hidden jika 0 atau tab aktif).

#### Kelola trip (§11)

> Registry: WORKFLOW §11 / `App.tsx` id: 11 (layar 95–103). Shared: `TripDetailMenuSheet`, `TripMemberParts`, `InviteParts`.

- [ ] Menu ⋮ (`TripDetailMenuSheet`): Daftar Anggota · Google Calendar · Edit Info · Hapus.
- [x] `Screen95`: modal _Hapus perjalanan?_ — destructive · soft delete API.
- [x] `Screen96`: modal _Tambah ke Google Calendar?_ — `{tanggal} · kalender kamu` (M16) — item menu disabled saat trip masih `voting_pending` (subtitle "Tanggal belum dikunci"); event dibuat di kalender user sendiri via OAuth per-user.
- [ ] `Screen97`: pembuat — search + undang username; badge **Pembuat** / **Anggota**.
- [ ] `Screen98`: `EmailInviteSearchResult` — **Undang lewat Email**.
- [ ] `Screen99`: pending `email_sent` — **Batalkan**.
- [ ] `Screen100`: pending `email_sent` + `pending_accept` — **Batalkan**.
- [ ] `Screen101`: `rejected` — **Undang kembali**.
- [ ] `Screen102`: POV anggota — tanpa **Keluarkan**; tetap kelola pending.
- [ ] `Screen103`: edit trip — form §6 · CTA **Simpan**.

## 7. Wishlist Aktivitas (§12)

> Registry: WORKFLOW §12 / `App.tsx` id: 12 (layar 104–117). Shared: `WishlistParts.tsx`.

- [ ] Registry label: _12. Wishlist — Tab 4_; accent coral; layar 104–117.
- [ ] `Screen104`: empty _Wishlist masih kosong_ + CTA **Tambah Aktivitas**.
- [ ] `Screen105`: grid 2 kolom · 4 item · sort/filter tabs + search.
- [ ] `Screen106`: filter/search tanpa hasil — _Tidak ada hasil_.
- [ ] `Screen107`–`109`: form tambah kosong / terisi / validasi nama wajib.
- [ ] `Screen110`: detail sheet — catatan, tautan, footer **Jadikan Perjalanan**.
- [ ] `Screen111`: edit — CTA **Simpan Perubahan**.
- [ ] `Screen112`: menu ⋮ — **Jadikan Perjalanan** · **Edit** · **Hapus**.
- [ ] `Screen113`: modal _Hapus dari wishlist?_ destructive.
- [ ] `Screen114`–`115`: Jadikan Perjalanan — prefill → tanggal → **Buat Perjalanan**.
- [ ] `Screen116`: undang + `WishlistRemovedBanner` · **Masuk ke Perjalanan**.
- [ ] `Screen117`: itinerary 1 aktivitas hasil konversi (hari 1).

## 8. System States & Design (§13)

> Registry: WORKFLOW §13 / `App.tsx` id: 13 (layar 118–125).

- [ ] Registry label: _13. System States & Micro-interactions_; accent coral; layar 118–125.
- [ ] `Screen118`: skeleton shimmer Beranda — 2 card + spinner _Memuat perjalananmu..._
- [ ] `Screen119`: toast **Sukses** (teal) · **Error** (coral + Coba Lagi) · **Info** (putih); tutup X; 3 detik.
- [ ] `Screen120`: offline full-screen — _Tidak ada koneksi_ · CTA **Coba Lagi**.
- [ ] `Screen121`: `MediaPhotoViewer` — X · counter · Share · caption · **Jadikan Cover**.
- [ ] `Screen122`: video pause — overlay play besar.
- [ ] `Screen123`: video playing — kontrol play/pause + progress bar.
- [ ] `Screen124`: dark mode Beranda — palette gelap opsional (M17).
- [ ] `Screen125` + `colors.ts`: tokens brand/netral/danger · tipografi · radius.
- [ ] Bottom nav: Beranda, Cari, [+], Wishlist, Profil (`BottomNav.tsx`).

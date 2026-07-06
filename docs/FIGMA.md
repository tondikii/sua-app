# Figma Design Reference — Atur Perjalanan

> **Tujuan dokumen ini**: 
> - Untuk AI agents: Menjadi sumber kebenaran utama screen inventory, design tokens, dan mapping ke workflow/API sebelum mengimplementasikan atau mengaudit layar UI (M7–M12).
> - Untuk product team: Dokumentasi lengkap palet warna, spacing, tipografi, dan **125 layar** high-fidelity — referensi saat design review atau perubahan brand.

---

## 📦 Sumber Desain Lokal

Desain diekspor dari Figma Make dan disimpan di folder **`figma/`** di root monorepo.

| Sumber | Path / URL | Keterangan |
|--------|------------|------------|
| **Code bundle (lokal)** | `figma/` | **125 layar** high-fidelity sebagai React preview (state variants per pipeline). **Sumber kebenaran utama** untuk screen inventory & design tokens. |
| **Design tokens (kode)** | `figma/src/app/components/colors.ts` | Palet warna, font, avatar colors (`C`, `AVATAR_COLORS`, `FONT`). |
| **Screen registry** | `figma/src/app/App.tsx` | **125 layar** dikelompokkan **§1–§13** selaras `docs/WORKFLOW.md`. Counter header otomatis dari registry. |
| **Shared trip UI** | `figma/src/app/components/trip/` | `TripDetailParts`, `ItineraryParts`, `ActivityParts`, `VotingParts`, `CreateVotingSheetParts`, `ChatParts`, `InviteParts`, `TripMemberParts`, `WishlistParts`, dll. |
| **Figma Editor** | https://www.figma.com/design/tFarpj9aEUL64GrDd1jGU5/Atur-Perjalanan | File desain asli (memerlukan akses Figma). |
| **Figma Preview (live)** | https://capri-spring-88160657.figma.site | Preview browser — alternatif jika bundle lokal belum dijalankan. |

### Menjalankan Preview Lokal

```bash
cd figma
npm i
npm run dev
```

Buka URL Vite (biasanya `http://localhost:5173`) untuk melihat seluruh **125 layar** dalam phone frame, dikelompokkan per §1–§13.

> **Untuk AI Agent**: Prioritaskan inspeksi `figma/src/app/App.tsx`, `figma/src/app/components/screens/`, dan `colors.ts`.

---

## 🎨 Design Tokens

Nilai di bawah ini diambil dari `figma/src/app/components/colors.ts` dan `Screen125DesignTokens.tsx`. Implementasikan di `mobile/androidApp/.../ui/theme/`.

### Color Palette

| Token Name | HEX | Penggunaan |
|------------|-----|------------|
| `ColorCoral` (Primary) | `#FF6B6B` | Active tab, primary button, CTA, bubble chat sendiri |
| `ColorCoralLight` | `#FFF0F0` | Background highlight, badge unread |
| `ColorCoralDark` | `#E85555` | Pressed state primary button |
| `ColorTeal` (Secondary) | `#4ECDC4` | Secondary accent, tag chips, banner sukses |
| `ColorTealLight` | `#EDF9F8` | Background tag chip, ikon secondary |
| `ColorCharcoal` | `#1A1A2E` | Teks utama, judul |
| `ColorMuted` | `#9091A0` | Placeholder, label sekunder, tab inactive |
| `ColorMutedLight` | `#B8B9C6` | Hint text, timestamp |
| `ColorBorder` | `#EBEBF2` | Divider, stroke card/input |
| `ColorLight` | `#F7F7FB` | Background layar sekunder |
| `BackgroundPrimary` | `#FFFFFF` | Background layar utama |
| `ColorDanger` | `#F94141` | Validasi gagal, aksi destruktif |
| `ShadowColor` | `rgba(26,26,46,0.08)` | Elevation shadow default |

**Avatar palette** (`AVATAR_COLORS`): `#FF6B6B`, `#4ECDC4`, `#FFB347`, `#8B7CF6`, `#60A5FA`, `#F472B6`

**Brand philosophy**: Palette *Sunset & Beach* — Pure white canvas, charcoal text, Warm Coral primary, Soft Teal secondary.

### Typography

Font: **Plus Jakarta Sans** (`figma/src/styles/fonts.css`)

| Style | Weight | Size | Penggunaan |
|-------|--------|------|------------|
| `H1` | Bold 800 | 24sp | Judul halaman |
| `H2` | SemiBold 700 | 18sp | Judul section, card title |
| `H3` | Medium 600 | 15sp | Sub-judul, label form |
| `Body` | Regular 400 | 14sp | Teks isi utama |
| `Caption` | Medium 500 | 12sp | Timestamp, metadata, badge |

### Komponen Navigasi

Bottom Navigation Bar (`figma/src/app/components/BottomNav.tsx`):

| Posisi | Label | Ikon |
|--------|-------|------|
| Kiri-1 | Beranda | Home |
| Kiri-2 | Cari | Search |
| Tengah | — | FAB `+` (Warm Coral, elevated) |
| Kanan-1 | Wishlist | Heart |
| Kanan-2 | Profil | User |

Tab aktif: coral. Tab inactive: muted.

---

## 📱 Inventori Layar (125 Screen Inventory)

**Nomor layar** = indeks preview **1–125** berurutan di `App.tsx` (selaras nama komponen `Screen{N}`). **Sumber kebenaran**: `figma/src/app/App.tsx` → `workflowSections`.

> Beberapa file mengekspor beberapa komponen (mis. `Screen78ChatSendPhoto.tsx` → layar 78–81; `Screen89ChatReplyMeToOther.tsx` → layar 89–92). Indeks registry tetap 1 per layar.

### §1 Onboarding Layar Awal

| # | Label | File |
|---|-------|------|
| 1 | Splash Screen | `Screen1Splash.tsx` |
| 2 | Edu Onboarding | `Screen2EduOnboarding.tsx` |

### §2 Autentikasi (Google Sign-In)

| # | Label | File |
|---|-------|------|
| 3 | Auth & Onboarding | `Screen3Auth.tsx` |
| 4 | Buat Username | `Screen4Username.tsx` |

### §3 Beranda (Home) — Tab 1

| # | Label | File |
|---|-------|------|
| 5 | Beranda — Mendatang | `Screen5Home.tsx` |
| 6 | Empty — Beranda | `Screen6EmptyBeranda.tsx` |
| 7 | Beranda — Selesai | `Screen7HomeSelesai.tsx` |
| 8 | Beranda — Undangan | `Screen8HomeUndangan.tsx` |
| 9 | Notifikasi | `Screen9Notifikasi.tsx` |

### §4 Pencarian (Cari) — Tab 2

| # | Label | File |
|---|-------|------|
| 10 | Cari — Idle | `Screen10SearchIdle.tsx` |
| 11 | Cari — Hasil | `Screen11SearchUser.tsx` |
| 12 | Cari — Tidak Ada Hasil | `Screen12SearchNoResults.tsx` |
| 13 | Profil Publik | `Screen13PublicProfile.tsx` |
| 14 | Profil Publik — Empty Trip | `Screen14PublicProfileEmptyTrip.tsx` |

### §5 Profil — Tab 5

Kartu profil **horizontal** (avatar kiri, nama+bio+website kanan) + bar stat perjalanan di bawah. Username di header; Pengaturan via ikon ⚙. Edit profil diakses dari kartu profil di `Screen17Settings`.

| # | Label | File |
|---|-------|------|
| 15 | Profil & Eksplorasi | `Screen15Profile.tsx` |
| 16 | Profil — Empty Trip | `Screen16ProfileEmptyTrip.tsx` |
| 17 | Pengaturan | `Screen17Settings.tsx` |
| 18 | Edit Profil | `Screen18EditProfil.tsx` |
| 19 | Bantuan & FAQ | `Screen19SettingsHelpFaq.tsx` |
| 20 | Hapus Akun | `Screen20SettingsDeleteAccount.tsx` |

### §6 Pembuatan Perjalanan — Tab [+]

| # | Label | File |
|---|-------|------|
| 21 | A — Form kosong (awal) | `Screen21CreateTripEmpty.tsx` |
| 22 | A — Default terisi · waktu custom | `Screen22Create.tsx` |
| 23 | A — Siap submit · sepanjang hari | `Screen23CreateTripFixedDate.tsx` |
| 24 | A — Validasi error | `Screen24CreateTripFixedValidation.tsx` |
| 25 | B — Mode kandidat · belum ada tersimpan | `Screen25CreateTripUncertainDate.tsx` |
| 26 | B — Tooltip info tombol kandidat | `Screen26CreateTripUncertainInfo.tsx` |
| 27 | B — Kandidat 1 aktif · belum simpan | `Screen27PickDateCandidate1.tsx` |
| 28 | B — Kandidat 1 tersimpan · tenggat muncul | `Screen28CreateTripCandidate1Saved.tsx` |
| 29 | B — 1 tersimpan + kandidat 2 aktif | `Screen29PickDateCandidate2.tsx` |
| 30 | B — 2 kandidat tersimpan | `Screen30CreateTripTwoCandidatesSaved.tsx` |
| 31 | B — 2 tersimpan + kandidat 3 aktif | `Screen31MultiDatePicker.tsx` |
| 32 | B — 3 kandidat + tenggat · siap submit | `Screen32DateCandidatesComplete.tsx` |
| 33 | B — Validasi error | `Screen33FormValidation.tsx` |
| 34 | Submit — Loading | `Screen34CreateTripSubmitting.tsx` |
| 35 | Undang — Sukses buat · search kosong | `Screen35BottomSheetUndang.tsx` |
| 36 | Undang — Hasil cari | `Screen36InviteSearchResults.tsx` |
| 37 | Undang — Hasil cari · sebagian terundang | `Screen37InvitePartialInvited.tsx` |
| 38 | Undang — Tidak ditemukan | `Screen38InviteSearchEmpty.tsx` |
| 39 | Undang — Email belum terdaftar | `Screen39InviteEmailNotRegistered.tsx` |
| 40 | Undang — Email terkirim | `Screen40InviteEmailSent.tsx` |
| 41 | Undang — Daftar terundang | `Screen41InviteSent.tsx` |

> **Removed**: daftar saran teman (`Screen83` lama); konfirmasi email terpisah — alur langsung `Screen39` → `Screen40`.

### §7 Detail Perjalanan — Tab Itinerary

| # | Label | File |
|---|-------|------|
| 42 | Itinerary — Empty | `Screen42ItineraryEmpty.tsx` |
| 43 | Itinerary — Tanggal divoting · Hari 1 + gap | `Screen43Destinations.tsx` |
| 44 | Itinerary — Multi-hari (state waktu) | `Screen44DestinationsFixedDate.tsx` |
| 45 | Sheet — Tambah aktivitas (form awal) | `Screen45BottomSheetDestinasi.tsx` |
| 46 | Sheet — Tambah (Maps + cover otomatis) | `Screen46ActivityAddLinked.tsx` |
| 47 | Sheet — Tambah (Maps tanpa thumbnail) | `Screen47ActivityMapsNoThumb.tsx` |
| 48 | Sheet — Tambah (cover media perjalanan) | `Screen48ActivityTripMediaCover.tsx` |
| 49 | Sheet — Pilih cover · Media | `Screen49ActivityCoverPicker.tsx` |
| 50 | Sheet — Pilih cover · Icon | `Screen50ActivityCoverIconPicker.tsx` |
| 51 | Detail aktivitas (cover Maps) | `Screen51DestinationDetail.tsx` |
| 52 | Detail aktivitas (cover icon) | `Screen52ActivityDetailNoCover.tsx` |
| 53 | Detail aktivitas (tanpa cover) | `Screen53ActivityDetailBare.tsx` |
| 54 | Sheet — Edit aktivitas | `Screen54ActivityEdit.tsx` |
| 55 | Menu ⋮ aktivitas (Edit · Hapus) | `Screen55ActivityItemMenu.tsx` |

### §8 Detail Perjalanan — Tab Voting

| # | Label | File |
|---|-------|------|
| 56 | Voting Aktif (tanggal + aktivitas) | `Screen56Voting.tsx` |
| 57 | Voting — Empty | `Screen57VotingEmpty.tsx` |
| 58 | Sheet — Buat voting baru (tanggal) | `Screen58CreateVotingTanggal.tsx` |
| 59 | Sheet — Detail Voting (tanggal · awal) | `Screen59CreateVotingTanggalDetails.tsx` |
| 60 | Sheet — Tambah Kandidat Tanggal (kandidat 2) | `Screen60CreateVotingTanggalPickCandidate.tsx` |
| 61 | Sheet — Detail Voting (2 kandidat) | `Screen61VotingTanggalDetailsTwoCandidates.tsx` |
| 62 | Sheet — Tambah Kandidat Tanggal (kandidat 3) | `Screen62VotingTanggalPickCandidate3.tsx` |
| 63 | Sheet — Detail Voting (lengkap) | `Screen63VotingTanggalDetailsComplete.tsx` |
| 64 | Sheet — Buat Voting (pilih jenis) | `Screen64CreateVoting.tsx` |
| 65 | Sheet — Detail Voting (aktivitas) | `Screen65CreateVotingDetails.tsx` |
| 66 | Sheet — Edit Voting (aktivitas) | `Screen66EditVoting.tsx` |
| 67 | Sheet — Edit Voting (tanggal) | `Screen67EditVotingTanggal.tsx` |
| 68 | Modal — Hapus Voting | `Screen68DeleteVotingModal.tsx` |
| 69 | Menu ⋮ — Aktif (Edit/Akhiri/Hapus) | `Screen69VotingCardMenu.tsx` |
| 70 | Voting — Pipeline + Selesai | `Screen70VotingEndedPipeline.tsx` |
| 71 | Menu ⋮ — Selesai (Hapus saja) | `Screen71VotingEndedMenu.tsx` |
| 72 | Voting — Auto Berakhir | `Screen72VotingExpired.tsx` |
| 73 | Modal — Akhiri Voting Tanggal | `Screen73StatusLocked.tsx` |
| 74 | Modal — Aktivitas Itinerary Selesai | `Screen74VotingLockedDestinasi.tsx` |
| 75 | Modal — Voting Lainnya Selesai | `Screen75VotingLockedLainnya.tsx` |

### §9 Detail Perjalanan — Tab Chat

| # | Label | File |
|---|-------|------|
| 76 | Chat — Grup aktif | `Screen76Chat.tsx` |
| 77 | Chat — Lampiran foto/video | `Screen77ChatAttachMenu.tsx` |
| 78 | Chat — Kirim foto + caption | `Screen78ChatSendPhoto.tsx` |
| 79 | Chat — Kirim foto (caption terisi) | `Screen78ChatSendPhoto.tsx` |
| 80 | Chat — Kirim video + caption | `Screen78ChatSendPhoto.tsx` |
| 81 | Chat — Kirim video (caption terisi) | `Screen78ChatSendPhoto.tsx` |
| 82 | Chat — Foto terkirim (saya) | `Screen82ChatPhotoSent.tsx` |
| 83 | Chat — Video terkirim (saya) | `Screen83ChatVideoSent.tsx` |
| 84 | Chat — Foto dari anggota lain | `Screen84ChatPhotoReceived.tsx` |
| 85 | Chat — Video dari anggota lain | `Screen85ChatVideoReceived.tsx` |
| 86 | Chat — Empty | `Screen86EmptyChat.tsx` |
| 87 | Chat — Long press (pesan orang lain) | `Screen87ChatLongPress.tsx` |
| 88 | Chat — Long press (pesan sendiri) | `Screen87ChatLongPress.tsx` |
| 89 | Chat — Balas (saya → orang lain) | `Screen89ChatReplyMeToOther.tsx` |
| 90 | Chat — Balas (saya → saya) | `Screen89ChatReplyMeToOther.tsx` |
| 91 | Chat — Balas (orang lain → orang lain) | `Screen89ChatReplyMeToOther.tsx` |
| 92 | Chat — Balas (orang lain → saya) | `Screen89ChatReplyMeToOther.tsx` |

### §10 Detail Perjalanan — Tab Media

| # | Label | File |
|---|-------|------|
| 93 | Tab — Media & Cover | `Screen93TripDocuments.tsx` |
| 94 | Tab — Media (+ dari chat) | `Screen94MediaFromChat.tsx` |

### §11 Detail Perjalanan — Kelola Trip

| # | Label | File |
|---|-------|------|
| 95 | Modal — Hapus Perjalanan | `Screen95TripDelete.tsx` |
| 96 | Modal — Google Calendar | `Screen96CalendarSyncModal.tsx` |
| 97 | Anggota — Pembuat | `Screen97TripMembers.tsx` |
| 98 | Anggota — Cari email belum terdaftar | `Screen98TripMembersInviteEmail.tsx` |
| 99 | Anggota — Pending · belum daftar app | `Screen99TripMembersEmailInvited.tsx` |
| 100 | Anggota — Pending · 2 state | `Screen100TripMembersPendingInvite.tsx` |
| 101 | Anggota — Ditolak · undang kembali | `Screen101TripMembersRejected.tsx` |
| 102 | Anggota — POV anggota | `Screen102TripMembersAsMember.tsx` |
| 103 | Edit Info Perjalanan | `Screen103TripEdit.tsx` |

### §12 Wishlist — Tab 4

| # | Label | File |
|---|-------|------|
| 104 | Empty — Belum ada item | `Screen104WishlistEmpty.tsx` |
| 105 | Grid — Daftar terisi | `Screen105Wishlist.tsx` |
| 106 | Filter — Tidak ada hasil | `Screen106WishlistFilterEmpty.tsx` |
| 107 | Sheet — Tambah (form kosong) | `Screen107AddWishlistEmpty.tsx` |
| 108 | Sheet — Tambah (form terisi) | `Screen108BottomSheetWishlist.tsx` |
| 109 | Sheet — Tambah (validasi error) | `Screen109AddWishlistValidation.tsx` |
| 110 | Detail item | `Screen110WishlistDetail.tsx` |
| 111 | Sheet — Edit item | `Screen111EditWishlist.tsx` |
| 112 | Menu ⋮ (Edit · Hapus · Jadikan Perjalanan) | `Screen112WishlistCardMenu.tsx` |
| 113 | Modal — Hapus item | `Screen113WishlistDelete.tsx` |
| 114 | Jadikan Perjalanan — Prefill wishlist | `Screen114WishlistToTripEmpty.tsx` |
| 115 | Jadikan Perjalanan — Siap submit | `Screen115WishlistToTripReady.tsx` |
| 116 | Undang — Sukses buat (+ wishlist dihapus) | `Screen116WishlistToTripInvite.tsx` |
| 117 | Itinerary — 1 aktivitas dari wishlist | `Screen117ItineraryFromWishlist.tsx` |

### §13 System States & Micro-interactions

| # | Label | File |
|---|-------|------|
| 118 | Skeleton Loading | `Screen118SkeletonLoading.tsx` |
| 119 | Toast & Snackbar | `Screen119ToastComponents.tsx` |
| 120 | Error — Offline | `Screen120Error.tsx` |
| 121 | Media Viewer — Foto | `Screen121MediaViewerPhoto.tsx` |
| 122 | Media Viewer — Video (pause) | `Screen122MediaViewerVideo.tsx` |
| 123 | Media Viewer — Video (playing) | `Screen123MediaViewerVideoPlaying.tsx` |
| 124 | Dark Mode — Beranda | `Screen124DarkBeranda.tsx` |
| 125 | Design Tokens | `Screen125DesignTokens.tsx` |

---

## 🔌 Kebutuhan API dari Desain (Gap vs Backend)

**Sumber kebenaran teknis**: `docs/ARCHITECTURE.md §3.0.1` (matrix schema) · `§4.3.0` (35 endpoint ✅) · `§4.3.2` (gap M5.2) · `docs/WORKFLOW.md` (kontrak per §).

### Ringkasan Status (Juli 2026)

| Kategori | ✅ M5.1 | 🔜 M5.2 | M11 / Post-MVP |
|----------|---------|---------|----------------|
| Auth + username | 3 endpoint | — | logout opsional |
| Beranda + notif | 8 endpoint | — | — |
| Pencarian + profil | 4 endpoint | delete account | follow |
| Create trip + undang | 3 endpoint | times, cancel invite | — |
| Itinerary | 3 endpoint (thin) | PUT edit, enriched fields, Maps thumb | — |
| Voting | date vote/lock | multi-poll Aktivitas/Lainnya | — |
| Chat | text + delete | media, reply, read cursor | — |
| Media tab | — | documents + cover | — |
| Kelola trip | edit/delete trip | members list, remove | Calendar |
| Wishlist | CRUD basic | enriched fields, convert atomic | — |

### Detail Gap Table

| Fitur UI | Layar | Endpoint / Schema | Status |
|----------|-------|-------------------|--------|
| Notifikasi in-app | 9 | `GET /v1/notifications`, unread-count, mark read | ✅ M5.1 |
| Hapus pesan chat | 87, 88 | `DELETE /v1/trips/:id/messages/:messageId` — menu Hapus hanya long-press pesan sendiri | ✅ M5.1 |
| Username check real-time | 4 | `GET /v1/users/check-username` | ✅ M5.1 |
| Tab Beranda Mendatang/Selesai | 5, 7 | `GET /v1/trips?tab=upcoming\|completed` | ✅ M5.1 |
| Grid trip profil publik | 13, 15 | `GET /v1/users/:username/trips` | ✅ M5.1 |
| Voting deadline & reminder | 56 | cron H-7d/H-1d/H-1h + `voting_deadline` | ✅ M5.1 |
| Cover image trip card | 5, 93 | `cover_image_url` default resolver | ✅ M5.1 (URL); 🔜 `cover_document_id` M5.2 |
| Edit aktivitas itinerary | 54 | `PUT /v1/trips/:id/destinations/:id` | 🔜 M5.2 |
| Aktivitas times/kind/cover | 43, 45–54 | enrich `trip_destinations` columns | 🔜 M5.2 |
| Trip waktu (non-all-day) | 22, 31 | `is_all_day`, `start_time`, `end_time` on trips | 🔜 M5.2 |
| Daftar anggota + batalkan undang | 41, 97–102 | `GET …/members`, `DELETE …/invitations/:id` | 🔜 M5.2 |
| Wishlist enriched + convert | 110–117 | wishlist columns + `POST …/convert-to-trip` | 🔜 M5.2 |
| Chat foto/video + unread badge | 77–85 | multipart messages + `trip_message_reads` | 🔜 M5.2 |
| Balas pesan (reply quote) | 89–92 | `reply_to_id` + enriched message payload | 🔜 M5.2e |
| Tab Media + set cover | 93, 94 | `trip_documents` CRUD + `PUT …/cover` | 🔜 M5.2 |
| Multi-voting Aktivitas/Lainnya | 56–75 | `trip_polls` schema + CRUD; tanggal tetap `candidates` | 🔜 M5.2c |
| Hapus akun | 20 | `DELETE /v1/users/me` | 🔜 M5.2 |
| Event kalender Google | 96 | Calendar API integration | M11 |
| Logout revoke session | 17 | `POST /v1/auth/logout` | Opsional (local OK) |
| Follow/follower | — | `POST/DELETE …/follow` | Post-MVP (kode ada) |

---

## 🔒 Visibilitas Profil & Trip

MVP fokus *trip planner*, bukan fitur sosial. Tidak ada sistem follow/follower aktif di MVP.

| Layer | Field | Perilaku |
|-------|-------|----------|
| **Trip di profil** | `trips.is_public` | Hanya trip creator dengan flag ini yang masuk grid profil publik |
| **Partisipasi trip** | `trip_participants` | Partisipan akses detail trip via Beranda |

---

## 🗂️ Detail Layar Penting

### Trip Detail — Tab Structure

```
Itinerary  ·  Voting  ·  Chat  ·  Media
```

| Tab | Counter | Catatan |
|-----|---------|---------|
| Itinerary | Jumlah aktivitas | Timeline multi-hari |
| Voting | Voting aktif | **Tab disembunyikan jika 0**; empty state badge **0** |
| Chat | Unread saja | Badge coral hanya jika > 0 |
| Media | Jumlah file | **Selalu tampil, termasuk `0`** |

### Onboarding (`Screen2EduOnboarding`)

| Slide | Masalah | Solusi | Preview |
|-------|---------|--------|---------|
| 1 Intro | — | Realisasikan Wacana Liburanmu | Hero + badge app |
| 2 | Sepakat Jadwal Susah Banget | Vote Bareng, Hasil Jelas | Mini voting (3 kandidat) |
| 3 | Rencana Berserakan | Timeline Harian yang Jelas | Mini itinerary (21 aktivitas, 4 hari) |
| 4 | Chat Trip Kecampur | Ruang Diskusi Khusus Trip | Mini chat |

Layout: scroll konten penuh; dots sticky di atas CTA.

### Undangan — Tanpa Saran Teman

Flow: `Screen35` (search kosong) → `Screen36`/`Screen37`/`Screen38` → `Screen41`. Email: `Screen39` → `Screen40` (tanpa konfirmasi terpisah). Tidak ada daftar saran teman.

### Voting — Sheet Copy & Form Rules

| Konteks | Title sheet | Form fields |
|---------|-------------|-------------|
| Detail (aktivitas) | Detail Voting | Judul + kandidat + tenggat |
| Detail (tanggal) | Detail Voting | Kandidat tanggal + tenggat saja |
| Edit (aktivitas) | Edit Voting | Sama + tombol kembali |
| Edit (tanggal) | Edit Voting | Sama tanpa kembali (`Screen67`) |
| Tambah kandidat tanggal | Tambah Kandidat Tanggal | Kalender + daftar kandidat |

Jenis voting selalu lewat **badge inline** (`VotingTypeBadgeInline`), bukan di judul sheet.

### Chat — Long Press & Reply

| Layar | Skenario |
|-------|----------|
| `Screen87` | Long press pesan orang lain — Balas, Salin (tanpa Hapus) |
| `Screen88` | Long press pesan sendiri — Balas, Salin, **Hapus** |
| `Screen89` | Balas: saya → orang lain |
| `Screen90` | Balas: saya → saya |
| `Screen91` | Balas: orang lain → orang lain |
| `Screen92` | Balas: orang lain → saya |

Quote balasan: `ChatReplyQuote` di dalam bubble; label **Kamu** jika membalas pesan sendiri.

### Naming: UI vs Backend

| UI (Figma) | Backend (saat ini) |
|------------|-------------------|
| Itinerary / aktivitas | `trip_destinations`, `/destinations` endpoints |
| Voting type "Aktivitas" | Internal code `destinasi` di `VotingType` |

---

## 🤖 Panduan untuk AI Agent

### Cara Mengaudit Alignment (M12)

1. Jalankan `figma/` preview lokal
2. Verifikasi **125 layar** di `App.tsx` vs Composable Android
3. **Color Check**: `Color.kt` ↔ `colors.ts`
4. **Layout Check**: padding 20dp, bottom nav 88dp
5. **State Check**: empty, skeleton, error, validation, wishlist→trip
6. **Tab Check**: Itinerary · Voting · Chat · Media

### Rekomendasi Penempatan Aset

```
mobile/androidApp/src/main/res/
├── drawable/          # Vektor XML (ikon, ilustrasi empty state)
└── font/              # Plus Jakarta Sans
```

Ekspor dari Figma Editor: SVG → Vector Drawable (Android Studio).

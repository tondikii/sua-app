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

> **Untuk AI Agent**: Baca **`docs/WORKFLOW.md` → Panduan Implementasi §1–§3** sebelum coding BE/Mobile. Lalu inspeksi `figma/src/app/App.tsx`, `figma/src/app/components/screens/`, dan `colors.ts`.

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
| `ColorDangerDark` | `#E83030` | Danger pressed / border |
| `ColorDangerLight` | `#FFEBEB` | Danger tint / icon bg |
| `ColorDangerBorder` | `#F5A8A8` | Danger outline |
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

### Border Radius (`Screen125DesignTokens`)

| Token | Nilai | Contoh penggunaan |
|-------|-------|-------------------|
| `sm` | 8px | Tombol kecil, close icon |
| `md` | 12px | Input, nav icon button |
| `lg` | 16px | Card kecil |
| `xl` | 20px | Trip card, wishlist card |
| `2xl` | 28px | — |

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

> **Registry `App.tsx`**: `id: 1` · accent **coral** · subtitle *Splash · Carousel 4 slide (pengenalan → masalah & solusi per BRIEF)*

| # | Label (App.tsx) | File |
|---|-----------------|------|
| 1 | Splash Screen | `Screen1Splash.tsx` |
| 2 | Edu Onboarding | `Screen2EduOnboarding.tsx` |

**`Screen1Splash`**: gradient coral (`#FF8A65`→`#FF6B6B`→`#F94E4E`); ikon **kompas** 156×156; *"Atur Perjalanan"*; tagline *Rencanakan. Jelajahi. Kenang.*; progress bar.

**`Screen2EduOnboarding`**: carousel 4 slide; copy dari `SLIDES[]` — lihat tabel lengkap di [WORKFLOW.md §1](WORKFLOW.md#1-onboarding-layar-awal). CTA *Selanjutnya →* / *Mulai Sekarang*; tanpa skip.

### §2 Autentikasi (Google Sign-In)

> **Registry `App.tsx`**: `id: 2` · accent **teal** · subtitle *Lanjutkan dengan Google · Buat username unik (pengguna baru)*

| # | Label (App.tsx) | File |
|---|-----------------|------|
| 3 | Login | `Screen3Auth.tsx` |
| 4 | Buat Username | `Screen4Username.tsx` |

**`Screen3Auth`**: hero travel + logo coral; headline *Mulai Perjalananmu*; subtext *Bergabung dan rencanakan perjalanan seru bersama orang-orang tersayang.*; **Lanjutkan dengan Google** (MVP); **Masuk dengan Email** (post-MVP, nonaktif); footer legal S&K + Privasi.

**`Screen4Username`**: *Buat username*; subtitle undangan; validasi real-time; aturan `a-z`, `0-9`, `_`, min 3 max 30; hint *Huruf, angka, dan underscore (_) · min. 3 karakter*; saran chips; CTA *Lanjutkan*.

### §3 Beranda (Home) — Tab 1

> **Registry `App.tsx`**: `id: 3` · accent **coral** · subtitle *Tab Mendatang · Selesai · Undangan · Notifikasi · Empty state*

| # | Label (App.tsx) | File |
|---|-----------------|------|
| 5 | Beranda — Mendatang | `Screen5Home.tsx` |
| 6 | Empty — Beranda | `Screen6EmptyBeranda.tsx` |
| 7 | Beranda — Selesai | `Screen7HomeSelesai.tsx` |
| 8 | Beranda — Undangan | `Screen8HomeUndangan.tsx` |
| 9 | Notifikasi | `Screen9Notifikasi.tsx` |

**Shared**: `home/HomeBerandaParts.tsx` (`HomePageShell`, `HomeHeader`, `HomeTabs`, `TripCard`, `InvitationCard`, `NotificationBell`, `HomeScrollBody`), `ui/EmptyTripsState.tsx`, `ui/TripTags.tsx`, `trip/CreateTripParts.tsx` (`TRIP_DATE_PENDING`).

| Layar | Spesifikasi kunci (dari kode) |
|-------|-------------------------------|
| `Screen5Home` | Tab Mendatang aktif; `TripCard` cover 150, tags max 3 + `+N`, avatars overlap -9px; contoh `TRIP_DATE_PENDING` + fixed date |
| `Screen6EmptyBeranda` | Tab counter 0; *Belum ada perjalanan* + deskripsi + CTA **Buat Perjalanan Baru** |
| `Screen7HomeSelesai` | `TripCard dimmed` — opacity 0.92, cover grayscale 20% |
| `Screen8HomeUndangan` | `InvitationCard` cover 120, overlay *Diundang oleh @username*, Terima/Tolak tinggi 40 |
| `Screen9Notifikasi` | Full-page **tanpa** `BottomNav`; 4 kartu contoh (invite, 2× voting, aktivitas); Vote Sekarang amber |

Detail lengkap + kontrak API: [WORKFLOW.md §3](WORKFLOW.md#3-beranda-home--tab-1).

### §4 Pencarian (Cari) — Tab 2

> **Registry `App.tsx`**: `id: 4` · accent **teal** · subtitle *Idle · Hasil · Kosong · Profil publik (dari hasil cari)*

| # | Label (App.tsx) | File |
|---|-----------------|------|
| 10 | Cari — Idle | `Screen10SearchIdle.tsx` |
| 11 | Cari — Hasil | `Screen11SearchUser.tsx` |
| 12 | Cari — Tidak Ada Hasil | `Screen12SearchNoResults.tsx` |
| 13 | Profil Publik | `Screen13PublicProfile.tsx` |
| 14 | Profil Publik — Empty Trip | `Screen14PublicProfileEmptyTrip.tsx` |

**Shared**: `search/SearchParts.tsx` (`SearchBar`, `SearchUserRow`), `ui/SearchEmptyState.tsx`, `profile/ProfileParts.tsx` (Screen13–14).

| Layar | Spesifikasi kunci |
|-------|-------------------|
| `Screen10` | Riwayat client-only; placeholder *Cari nama atau username...* |
| `Screen11` | Hasil + *N hasil ditemukan* + trip count per baris |
| `Screen12` | `SearchEmptyState` *Tidak ada hasil* |
| `Screen13`–`14` | `PageHeader` username; grid trip publik 2 kolom |

Detail: [WORKFLOW.md §4](WORKFLOW.md#4-pencarian-cari--tab-2).

### §5 Profil — Tab 5

> **Registry `App.tsx`**: `id: 5` · accent **coral** · subtitle *Profil pribadi · Empty trip · Pengaturan · Edit · Bantuan · Hapus akun*

Kartu profil **horizontal** + `ProfileStats`; username di `ProfileHeader` center; ⚙ → Pengaturan; edit via kartu profil di Settings.

| # | Label (App.tsx) | File |
|---|-----------------|------|
| 15 | Profil & Eksplorasi | `Screen15Profile.tsx` |
| 16 | Profil — Empty Trip | `Screen16ProfileEmptyTrip.tsx` |
| 17 | Pengaturan | `Screen17Settings.tsx` |
| 18 | Edit Profil | `Screen18EditProfil.tsx` |
| 19 | Bantuan & FAQ | `Screen19SettingsHelpFaq.tsx` |
| 20 | Hapus Akun | `Screen20SettingsDeleteAccount.tsx` |

**Shared**: `profile/ProfileParts.tsx`, `ui/EmptyTripsState.tsx`, `ui/TripTags.tsx`.

Detail: [WORKFLOW.md §5](WORKFLOW.md#5-profil--tab-5).

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

**Shared**: `trip/CreateTripParts.tsx` (form + kalender + kandidat + footer), `trip/InviteParts.tsx` (undang post-create).

Detail alur & API: [WORKFLOW.md §6](WORKFLOW.md#6-pembuatan-perjalanan--tab-).

#### `CreateTripParts.tsx` — props kunci `CreateTripFormBody`

| Prop | Tipe | Efek UI |
|------|------|---------|
| `dateMode` | `'fixed' \| 'candidates'` | Label kalender *Tanggal Perjalanan* vs *Pilih Tanggal* |
| `noDateSelected` | bool | Kalender tanpa highlight (awal kosong) |
| `dateMuted` | bool | Hari kalender abu-abu |
| `allDay` / `startTime` / `endTime` | — | Blok waktu; picker jam dengan jam lampau disabled |
| `showAddButton` | bool | Tombol *+ Tambah Kandidat Tanggal* |
| `highlightAddButton` | bool | Border dashed coral — siap simpan kandidat aktif |
| `candidateInfoOpen` | bool | Tooltip info di atas tombol kandidat |
| `activeCandidate` | `TripDateCandidate` | Baris kandidat coral (belum tersimpan) |
| `savedCandidates` | `TripDateCandidate[]` | Baris kandidat putih (tersimpan); trigger field tenggat |
| `showCandidateList` | bool | Daftar kandidat di bawah kalender |
| `showEmptySlot` | bool | Slot dashed *Kandidat N: Pilih tanggal...* |
| `votingDeadline` | string? | Nilai field tenggat (opsional) |
| `compact` / `tagsCompact` | bool | Padding lebih rapat (mode kandidat) |

#### `InviteParts.tsx` — komponen undang

| Komponen | Layar | Perilaku |
|----------|-------|----------|
| `InviteShell` | 35–41 | Header sukses + `SearchInput` + body + footer sticky |
| `InviteSearchResultsBody` | 36–37 | *N hasil* + `InviteUserRow` |
| `InviteUserRow` | 36–37 | Tombol **Undang** atau badge **✓ Terundang** |
| `EmailInviteSearchResult` | 39 | Kartu email + **Undang lewat Email** |
| `EmailInviteSentBanner` | 40 | Banner teal *Email terkirim* |
| `InviteInvitedList` | 40–41 | Section *Sudah diundang* + `InviteInvitedRow` / `EmailInvitedRow` |
| `InvitePrimaryButton` | semua | CTA **Masuk ke Perjalanan** (lewati / selesai undang) |

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

**Shared**: `ItineraryParts.tsx` (timeline, gap, state waktu), `ActivityParts.tsx` (form, detail, cover picker, menu), `TripDetailParts.tsx` (shell + tab counter), `ActivitySheetBackdropPresets.tsx`.

Detail alur & API: [WORKFLOW.md §7](WORKFLOW.md#7-detail-perjalanan--tab-itinerary).

#### `ItineraryParts.tsx` — komponen timeline

| Komponen / tipe | Perilaku |
|-----------------|----------|
| `ItineraryTabBody` | Ringkasan *N aktivitas · M hari* + tabs hari + timeline + footer CTA |
| `ItineraryDayTimeline` | Header hari + window badge + segmen item/gap |
| `buildItineraryTimeline` | Sisipkan gap *Tidak ada aktivitas* antar item dalam window |
| `resolveItineraryTimeState` | `past`/`present`/`future`/`scheduled` — lihat `ITINERARY_TIME_STATE_META` |
| `ItineraryItemRow` | Dot timeline + card + thumb + Navigation + menu ⋮ |
| `ItineraryEmptyState` | *Belum ada aktivitas* + deskripsi |
| `AddItineraryItemButton` | CTA coral *Tambah Aktivitas* / *Buat Aktivitas Pertama* |

#### `ActivityParts.tsx` — form & sheet

| Komponen | Layar | Perilaku |
|----------|-------|----------|
| `ActivityFormSheet` | 45–48, 54 | Field: Mulai/Selesai → Nama → Cover → Maps → Link Lainnya |
| `ActivityCoverPickerSheet` | 49–50 | Section: Media perjalanan / Galeri / Ilustrasi (32 icon) |
| `ActivityDetailSheet` | 51–53 | Detail read-only + section Tautan |
| `ActivityItemMenuSheet` | 55 | Dropdown **Edit** · **Hapus** (bukan full sheet) |
| `ActivitySheetScreen` | 45–54 | Backdrop itinerary redup + overlay + sheet |

**`ActivityDraft`**: `title`, `startTime`, `endTime`, `kind`, `location`, `description`, `coverSource`, `coverIcon`, `coverUrl`, `hasMapsLink`, `mapsPlaceName`, `refLinks[]`.

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

**Shared**: `VotingParts.tsx`, `CreateVotingSheetParts.tsx`, `VotingCardMenuSheet.tsx`, `VotingDeleteModal.tsx`, `VotingLockedModal.tsx`.

Detail alur & API: [WORKFLOW.md §8](WORKFLOW.md#8-detail-perjalanan--tab-voting).

#### `VotingParts.tsx` — komponen tab

| Komponen | Perilaku |
|----------|----------|
| `VotingCollapseSection` | Header collapse + optional menu ⋮ + `VotingCandidateList` children |
| `VotingCandidateList` | Vote / ✓ Voted / Pemenang (readOnly + `winnerId`) |
| `VotingTypeBadge` | Badge jenis: Tanggal (coral) · Aktivitas (teal) · Lainnya |
| `VotingStatusBadge` | Selesai · Berakhir |
| `VotingEmptyState` | *Belum ada voting* — trip tanggal pasti tanpa poll aktivitas/lainnya |
| `CreateVotingButton` | CTA *Buat Voting Baru* |

#### `CreateVotingSheetParts.tsx` — sheet & form

| Komponen | Layar | Perilaku |
|----------|-------|----------|
| `VotingTypeOptionList` | 58, 64 | 3 jenis + deskripsi; disabled + *Sedang berlangsung* |
| `CreateVotingDetailsForm` | 65, 66 | Judul + kandidat chips + tenggat (aktivitas/lainnya) |
| `CreateVotingTanggalDetailsForm` | 59, 61, 63, 67 | Kandidat tanggal + tenggat — **tanpa** judul |
| `VotingTanggalPickCandidateScreen` | 60, 62 | Kalender picker + **Simpan Kandidat** |
| `VotingTypeBadgeInline` | semua form | Jenis voting di body sheet, bukan di title |
| `VotingCardMenuSheet` | 69, 71 | Aktif: Edit/Akhiri/Hapus · Selesai: Hapus saja |

### §9 Detail Perjalanan — Tab Chat

| # | Label | File / export |
|---|-------|---------------|
| 76 | Chat — Grup aktif | `Screen76Chat.tsx` |
| 77 | Chat — Lampiran foto/video | `Screen77ChatAttachMenu.tsx` |
| 78 | Chat — Kirim foto + caption | `Screen78ChatSendPhoto.tsx` |
| 79 | Chat — Kirim foto (caption terisi) | `Screen78ChatSendPhoto.tsx` → `Screen79ChatSendPhotoCaption` |
| 80 | Chat — Kirim video + caption | `Screen78ChatSendPhoto.tsx` → `Screen80ChatSendVideo` |
| 81 | Chat — Kirim video (caption terisi) | `Screen78ChatSendPhoto.tsx` → `Screen81ChatSendVideoCaption` |
| 82 | Chat — Foto terkirim (saya) | `Screen82ChatPhotoSent.tsx` |
| 83 | Chat — Video terkirim (saya) | `Screen83ChatVideoSent.tsx` |
| 84 | Chat — Foto dari anggota lain | `Screen84ChatPhotoReceived.tsx` |
| 85 | Chat — Video dari anggota lain | `Screen85ChatVideoReceived.tsx` |
| 86 | Chat — Empty | `Screen86EmptyChat.tsx` |
| 87 | Chat — Long press (pesan orang lain) | `Screen87ChatLongPress.tsx` |
| 88 | Chat — Long press (pesan sendiri) | `Screen87ChatLongPress.tsx` → `Screen88ChatLongPressOwn` |
| 89 | Chat — Balas (saya → orang lain) | `Screen89ChatReplyMeToOther.tsx` |
| 90 | Chat — Balas (saya → saya) | `Screen89ChatReplyMeToOther.tsx` → `Screen90ChatReplyMeToSelf` |
| 91 | Chat — Balas (orang lain → orang lain) | `Screen89ChatReplyMeToOther.tsx` → `Screen91ChatReplyOtherToOther` |
| 92 | Chat — Balas (orang lain → saya) | `Screen89ChatReplyMeToOther.tsx` → `Screen92ChatReplyOtherToMe` |

**Shared**: `ChatParts.tsx` — layout, bubble, composer, long-press, reply quote.

Detail alur & API: [WORKFLOW.md §9](WORKFLOW.md#9-detail-perjalanan--tab-chat).

#### `ChatParts.tsx` — komponen utama

| Komponen | Layar | Perilaku |
|----------|-------|----------|
| `TripDetailChatLayout` | semua | Shell header + tab + area pesan + input |
| `ChatThreadView` | 76–77, 82–85, 89–92 | Daftar `ChatMessageBubble` + separator |
| `ChatMessageBubble` | semua thread | Teks / foto / video + optional `replyTo` quote |
| `ChatInputBar` | semua (kecuali 86) | Paperclip + *Tulis pesan...* + Send |
| `ChatAttachMenu` | 77 | Popover Foto · Video |
| `ChatMediaComposer` | 78–81 | Full-screen kirim media + caption |
| `ChatComposerScreen` | 78–81 | Backdrop chat redup + composer |
| `ChatLongPressView` | 87–88 | Highlight + `ChatLongPressMenu` |
| `ChatEmptyState` | 86 | Ilustrasi SVG + *Belum ada obrolan* |
| `ChatReplyQuote` | 89–92 | Quote dalam bubble; label **Kamu** jika `isMe` |

### §10 Detail Perjalanan — Tab Media

| # | Label | File |
|---|-------|------|
| 93 | Tab — Media & Cover | `Screen93TripDocuments.tsx` |
| 94 | Tab — Media (+ dari chat) | `Screen94MediaFromChat.tsx` |

**Shared**: `DocumentParts.tsx` — `DocumentGrid`, `TripDocument`.

Detail alur & API: [WORKFLOW.md §10](WORKFLOW.md#10-detail-perjalanan--tab-media).

#### `DocumentParts.tsx` — komponen utama

| Komponen | Layar | Perilaku |
|----------|-------|----------|
| `DocumentGrid` | 93–94 | Grid 3 kolom · tile Unggah + media tiles |
| `TripDocument` | semua | `type` photo/video · `isCover` · `fromChat` |
| Badge Cover | 93 | Star coral + border highlight |
| Badge Chat | 94 | `MessageCircle` teal pada `fromChat` |
| Jadikan Cover | 93–94 | Overlay button → set `cover_document_id` |

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

**Shared**: `TripDetailMenuSheet.tsx`, `TripDetailBackdrop.tsx`, `TripMemberParts.tsx`, `InviteParts.tsx`, `TripDeleteModal.tsx`, `CalendarEventParts.tsx`, `CreateTripParts.tsx`.

Detail alur & API: [WORKFLOW.md §11](WORKFLOW.md#11-detail-perjalanan--kelola-trip-menu-).

#### Komponen §11

| Komponen | Layar | Perilaku |
|----------|-------|----------|
| `TripDetailMenuSheet` | 95–96, 103 | 4 item menu ⋮; `highlightId` pada preview |
| `TripDetailBackdrop` | 95–96, 103 | Detail redup + overlay + menu terbuka |
| `TripMembersScreen` | 97–102 | Halaman *Anggota Perjalanan* |
| `TripMembersPanel` | 97–102 | Search + hasil + pending + daftar anggota |
| `TripMemberRow` | 97–102 | Badge role / tombol **Keluarkan** (creator) |
| `EmailInvitedRow` | 99–102 | Pending/rejected + Batalkan / Undang kembali |
| `EmailInviteSearchResult` | 98 | Kartu email belum punya akun |
| `TripDeleteModal` | 95 | Konfirmasi destructive |
| `CalendarEventModal` | 96 | Konfirmasi sync kalender (M11) |
| `CreateTripShell` | 103 | Form edit = pola buat trip §6 |

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
| 112 | Menu ⋮ (Jadikan · Edit · Hapus) | `Screen112WishlistCardMenu.tsx` |
| 113 | Modal — Hapus item | `Screen113WishlistDelete.tsx` |
| 114 | Jadikan Perjalanan — Prefill wishlist | `Screen114WishlistToTripEmpty.tsx` |
| 115 | Jadikan Perjalanan — Siap submit | `Screen115WishlistToTripReady.tsx` |
| 116 | Undang — Sukses buat (+ wishlist dihapus) | `Screen116WishlistToTripInvite.tsx` |
| 117 | Itinerary — 1 aktivitas dari wishlist | `Screen117ItineraryFromWishlist.tsx` |

**Shared**: `WishlistParts.tsx` — shell, grid, form, menu, detail, konversi.

Detail alur & API: [WORKFLOW.md §12](WORKFLOW.md#12-wishlist-aktivitas--tab-4).

#### `WishlistParts.tsx` — komponen utama

| Komponen | Layar | Perilaku |
|----------|-------|----------|
| `WishlistPageShell` | 104–106, 112 | Header + search + sort + tag + grid |
| `WishlistGrid` / `WishlistGridCard` | 105, 112 | Grid 2 kolom + prioritas badge |
| `WishlistEmptyState` | 104 | Ilustrasi + CTA **Tambah Aktivitas** |
| `WishlistFilterEmptyState` | 106 | *Tidak ada hasil* |
| `WishlistFormSheet` | 107–109, 111 | Bottom sheet form + backdrop |
| `WishlistDetailSheet` | 110 | Detail + footer **Jadikan Perjalanan** |
| `WishlistCardMenuSheet` | 112 | Dropdown card menu |
| `WishlistDeleteModal` | 113 | Konfirmasi hapus |
| `WishlistRemovedBanner` | 116 | Info wishlist dihapus pasca-konversi |
| `WISHLIST_IMPORTED_DAY` | 117 | Demo itinerary hasil konversi |

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

**Shared**: `MediaViewerParts.tsx` (viewer 121–123) · `colors.ts` (semua layar).

Detail alur: [WORKFLOW.md §13](WORKFLOW.md#13-system-states--micro-interactions).

#### Komponen §13

| Komponen | Layar | Perilaku |
|----------|-------|----------|
| `Screen118` (inline) | 118 | Shimmer skeleton Beranda — 2 trip cards |
| `ToastCard` | 119 | 3 variant: sukses · error · info |
| `Screen120Error` | 120 | Full-screen offline |
| `MediaTabBackdrop` | 121–123 | Tab Media redup di belakang viewer |
| `MediaPhotoViewer` | 121 | Foto fullscreen + swipe |
| `MediaVideoViewer` | 122–123 | Video + kontrol play/progress |
| `Screen124DarkBeranda` | 124 | Palette gelap khusus Beranda (M12) |
| `Screen125DesignTokens` | 125 | Swatch + tipografi + radius referensi dev |

---

## 🔌 Kebutuhan API dari Desain (Gap vs Backend)

**Sumber kebenaran teknis**: `docs/ARCHITECTURE.md §3.0.1` (matrix schema) · `§4.3.0` (35 endpoint ✅) · `§4.3.2` (gap M5.2) · `docs/WORKFLOW.md` (kontrak per §).

### Ringkasan Status (Juli 2026)

| Kategori | ✅ M5.1 | 🔜 M5.2 | M11 / Post-MVP |
|----------|---------|---------|----------------|
| Auth + username | 3 endpoint | validasi `_` | email login, logout opsional |
| Beranda + notif | 8 endpoint | invitation dates, notification enrich, trip card times | — |
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
| Username underscore `_` | 4 | `complete-registration` validator `^[a-zA-Z0-9_]{3,30}$` | 🔜 M5.2 (BE saat ini `alphanum`) |
| Login email | 3 | Post-MVP — tombol desain nonaktif di MVP | — |
| Tab Beranda Mendatang/Selesai | 5, 7 | `GET /v1/trips?tab=upcoming\|completed` | ✅ M5.1 |
| Tab Beranda Undangan | 8 | `GET /v1/trips/invitations` enriched | ✅ M5.1; 🔜 trip dates di summary |
| Trip card waktu (`· Sepanjang hari`) | 5, 8 | `is_all_day`, `start_time`, `end_time` on trips | 🔜 M5.2 |
| Notification enrich (actor/trip) | 9 | embed di `GET /v1/notifications` | 🔜 M5.2 |
| `invitation_id` di notif invite | 9 | payload untuk Terima/Tolak tanpa lookup | 🔜 M5.2 |
| Voting aktivitas notif label | 9 | `payload.poll_type` + `trip_polls` | 🔜 M5.2c |
| Grid trip profil publik | 13, 15 | `GET /v1/users/:username/trips` | ✅ M5.1 |
| Voting deadline & reminder | 56 | cron H-7d/H-1d/H-1h + `voting_deadline` | ✅ M5.1 |
| Cover image trip card | 5, 93 | `cover_image_url` default resolver | ✅ M5.1 (URL); 🔜 `cover_document_id` M5.2 |
| Edit aktivitas itinerary | 54 | `PUT /v1/trips/:id/destinations/:id` | 🔜 M5.2 |
| Aktivitas times/kind/cover | 43, 45–54 | enrich `trip_destinations` columns | 🔜 M5.2 |
| Trip waktu (non-all-day) | 22, 29, 31 | `is_all_day`, `start_time`, `end_time` on trips / kandidat | 🔜 M5.2 |
| Kandidat tanggal (1–3) | 25–32 | `candidates[]` min 1 max 3; `voting_deadline` override | ✅ create; 🔜 override + per-candidate time |
| Daftar anggota + batalkan undang | 41, 97–102 | `GET …/members`, `DELETE …/invitations/:id` | 🔜 M5.2 |
| Wishlist enriched + convert | 110–117 | wishlist columns + `POST …/convert-to-trip` | 🔜 M5.2 |
| Chat foto/video + unread badge | 77–85 | multipart messages + `trip_message_reads` | 🔜 M5.2 |
| Balas pesan (reply quote) | 89–92 | `reply_to_id` + enriched message payload | 🔜 M5.2e |
| Tab Media + set cover | 93, 94 | `trip_documents` CRUD + `PUT …/cover`; `from_chat` | 🔜 M5.2b |
| Kelola trip — members | 97–102 | `GET …/members`, pending 3 status, remove/reinvite | 🔜 M5.2 |
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
| Itinerary | Jumlah aktivitas | Badge hidden jika 0 |
| Voting | Jumlah poll | **Tab & badge selalu tampil**, termasuk **0** (`Screen57`) |
| Chat | Unread saja | Badge coral hanya jika > 0 |
| Media | Jumlah file | **Selalu tampil, termasuk `0`** |

### Onboarding (`Screen2EduOnboarding`)

| Slide | Eyebrow / Masalah | Solusi | Preview |
|-------|-------------------|--------|---------|
| 1 Intro | *Selamat datang* | Realisasikan Wacana Liburanmu | Hero + `AppBadge` |
| 2 | Sepakat Jadwal Susah Banget | Vote Bareng, Hasil Jelas | `MiniVotingPreview` (3 kandidat tanggal) |
| 3 | Rencana Berserakan, Urutan Nggak Jelas | Timeline Harian yang Jelas | `MiniItineraryPreview` (21 aktivitas, 4 hari, state *Sekarang*) |
| 4 | Chat Trip Kecampur | Ruang Diskusi Khusus Trip | `MiniChatPreview` (teks + foto) |

Layout: scroll konten penuh; dots klikable sticky di atas CTA; CTA *Selanjutnya →* / *Mulai Sekarang*; tanpa skip.

### Autentikasi (`Screen3Auth`, `Screen4Username`)

| Layar | Elemen kunci | MVP |
|-------|--------------|-----|
| `Screen3Auth` | Hero, logo, *Mulai Perjalananmu*, Google button coral | ✅ Google Sign-In |
| `Screen3Auth` | Divider *atau*, **Masuk dengan Email** | Post-MVP (sembunyikan/nonaktifkan) |
| `Screen3Auth` | Footer S&K + Kebijakan Privasi | ✅ Tampilkan |
| `Screen4Username` | Input `@`, hint `a-z 0-9 _`, min 3 max 30 | ✅ |
| `Screen4Username` | Feedback tersedia (teal) / error (coral) | ✅ |
| `Screen4Username` | Saran chips (client-only) | Opsional |

> **Gap BE**: validator username saat ini `alphanum` (tanpa `_`) — target M5.2: `^[a-zA-Z0-9_]{3,30}$`.

### Beranda (`Screen5Home`–`Screen9Notifikasi`)

**`HomeBerandaParts.tsx`** — komponen bersama:

| Komponen | Props / perilaku |
|----------|------------------|
| `HomePageShell` | Safe area 60px + `BottomNav` home |
| `HomeHeader` | *"Perjalananku"* + `NotificationBell` |
| `NotificationBell` | Badge coral; cap **9+**; hidden jika 0 |
| `HomeTabs` | Mendatang · Selesai · Undangan + counter |
| `TripCard` | Cover 150; tags; calendar row; avatars; prop `dimmed` |
| `InvitationCard` | Cover 120; overlay @inviter; Terima/Tolak |

**Notifikasi (`Screen9Notifikasi`)** — template copy:

| Tipe | Contoh teks | Tombol |
|------|-------------|--------|
| invite | Budi mengundangmu ke **Lombok Escape** | Terima · Tolak |
| voting (tanggal) | Voting Tanggal **Bali Trip** segera berakhir. | Vote Sekarang → |
| voting (aktivitas) | Voting Destinasi **Raja Ampat** deadline besok. | Vote Sekarang → |
| activity | Rina menambahkan aktivitas **Sunrise…** di Bali Trip. | (tap navigasi) |

**Konstanta copy**: `TRIP_DATE_PENDING` = `"Tanggal sedang divoting"` (`CreateTripParts.tsx`).

**Gap BE kritis §3**: notif `invite` tanpa `invitation_id` — lihat `WORKFLOW.md` Panduan §3.

### Buat Perjalanan — Mode & Validasi (`CreateTripParts.tsx`)

| Mode | Trigger FE | Payload BE | Status trip |
|------|------------|------------|-------------|
| A — tanggal pasti | Kalender langsung (tanpa simpan kandidat) | `start_date` + `end_date` | `fixed` |
| B — kandidat | Tap *+ Tambah Kandidat* dari Mode A, lalu simpan 1–3 rentang | `candidates[]` (min 1, max 3) | `voting_pending` |

**Copy validasi** (tampil sekaligus): lihat tabel di [WORKFLOW.md §6](WORKFLOW.md#validasi-kedua-mode).

**Konstanta**: `TRIP_DATE_PENDING` = *"Tanggal sedang divoting"* — dipakai di card Beranda saat `voting_pending`.

### Undangan — Tanpa Saran Teman

Flow post-create: `Screen34` loading → `Screen35` (search kosong) → `Screen36`/`Screen37`/`Screen38` → `Screen41`. Email: `Screen39` → `Screen40` (tanpa konfirmasi terpisah). CTA **Masuk ke Perjalanan** selalu tersedia. Tidak ada daftar saran teman.

### Itinerary — Timeline & State Waktu (`ItineraryParts.tsx`)

| State | Label UI | Kondisi |
|-------|----------|---------|
| `past` | Selesai | Item/hari sudah lewat |
| `present` | Berlangsung + **Sekarang** | `referenceNow` dalam rentang item |
| `future` | Akan datang | Item belum dimulai |
| `scheduled` | Terjadwal | Trip `datePending` (semua item) |

Gap antar aktivitas: *{start} – {end} · Tidak ada aktivitas* (`buildItineraryTimeline`). Warna state = dot/card timeline, **bukan** jenis aktivitas.

**Form aktivitas** (`ActivityFormSheet`): Mulai/Selesai → Nama → Cover → Google Maps → Link Lainnya · CTA **Simpan Aktivitas** / **Simpan Perubahan**.

**Cover picker** (`ActivityCoverPickerSheet`): Media perjalanan · Galeri perangkat · 32 icon ilustrasi.

### Voting — Pipeline & State (`VotingParts.tsx`)

| `VotingStatus` | Label | Menu ⋮ |
|----------------|-------|--------|
| `active` | — | Edit · Akhiri Voting · Hapus |
| `ended` | Selesai | Hapus saja |
| `expired` | Berakhir | Hapus saja |

Tab counter voting **selalu tampil** termasuk 0. Max 1 poll aktif per jenis. Form tanggal **tanpa** judul — card pipeline pakai *Tanggal Perjalanan*.

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

| Layar | Skenario | Menu long-press |
|-------|----------|-----------------|
| `Screen87` | Pesan orang lain | Balas · Salin Teks |
| `Screen88` (`Screen88ChatLongPressOwn`) | Pesan sendiri | Balas · Salin Teks · **Hapus** |
| `Screen89` | Balas: saya → orang lain | Quote `ChatReplyQuote` di bubble coral |
| `Screen90` | Balas: saya → saya | Quote label **Kamu** |
| `Screen91` | Balas: orang lain → orang lain | Quote dengan accent warna pengirim |
| `Screen92` | Balas: orang lain → saya | Quote pesan saya sebagai asal |

**Composer media** (`Screen78`–`81`): `ChatMediaComposer` full-screen — foto/video preview + caption opsional + Send.

**Lampiran** (`Screen77`): `ChatAttachMenu` — Foto · Video; footnote *masuk tab Media*.

### Media — Grid & Cover (§10)

| Layar | Fokus |
|-------|-------|
| `Screen93` | Grid 3 kolom · tile **Unggah** · badge **Cover** coral · **Jadikan Cover** |
| `Screen94` | + item `fromChat` dengan badge **Chat** teal · counter media 5 |

### Kelola Trip — Menu ⋮ (§11)

| Layar | Fokus |
|-------|-------|
| `Screen95` | `TripDeleteModal` — hapus permanen |
| `Screen96` | `CalendarEventModal` — kalender sendiri (M11) |
| `Screen97`–`102` | `TripMembersScreen` — search, pending, anggota |
| `Screen103` | `CreateTripShell` edit — **Simpan** |

### Wishlist — Grid & Konversi (§12)

| Layar | Fokus |
|-------|-------|
| `Screen104`–`106` | Empty · grid 4 item · filter tanpa hasil |
| `Screen107`–`109` | Form tambah: kosong / terisi / validasi nama |
| `Screen110`–`113` | Detail · edit · menu ⋮ · hapus |
| `Screen114`–`117` | Jadikan Perjalanan → undang → 1 aktivitas itinerary |

### System States — Global (§13)

| Layar | Fokus |
|-------|-------|
| `Screen118` | Skeleton shimmer Beranda · *Memuat perjalananmu...* |
| `Screen119` | Toast Sukses (teal) · Error (coral) · Info (putih) |
| `Screen120` | Offline full-screen · **Coba Lagi** |
| `Screen121`–`123` | Media viewer foto / video pause / playing |
| `Screen124` | Dark mode Beranda (opsional M12) |
| `Screen125` | Design tokens referensi dev |

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

# WorkFlow - Atur Perjalanan

> **Tujuan dokumen ini**: Mendokumentasikan alur kerja pengguna (*user workflows*) dari awal membuka aplikasi hingga menggunakan seluruh fitur. Alur selaras dengan **112 layar high-fidelity** Figma (lihat `docs/FIGMA.md`), **5 tab Bottom Navigation Bar**, **PRD**, dan **kontrak API backend** (`docs/ARCHITECTURE.md §4.3`).

**Preview lokal**: `figma/src/app/App.tsx` — **112 layar**, **§1–§13**. Nomor layar = indeks `Screen{N}` (non-sequential OK). Setiap layar **sekali** di registry.

**Legenda API** (di kolom Interaksi Data):

| Simbol | Arti |
|--------|------|
| ✅ | Endpoint + schema **sudah ada** di backend (M0–M5.1) |
| 🔜 | **Target M5.2** — wajib sebelum mobile parity penuh |
| — | Client-only (tanpa API) |
| M11 | Google Calendar — milestone terpisah |

Spesifikasi teknis lengkap: `docs/ARCHITECTURE.md §3.0.1` (matrix schema/API) · `§4.3.0` (35 endpoint implemented) · `§4.3.2` (gap M5.2).

---

## Diagram Alur Utama

```mermaid
flowchart TD
  A[Splash §1] --> B[Onboarding carousel §1]
  B --> C[Google Sign-In §2]
  C --> D{Pengguna baru?}
  D -->|Ya| E[Buat Username §2]
  D -->|Tidak| F[Beranda §3]
  E --> F
  F --> G[Bottom Nav]
  G --> G1[Cari §4]
  G --> G2[FAB + §6]
  G --> G3[Wishlist §12]
  G --> G4[Profil §5]
  G2 --> H[Detail Trip §7–§10]
  H --> I[Itinerary §7]
  H --> J[Voting §8]
  H --> K[Chat §9]
  H --> L[Media §10]
  F --> M[Notifikasi — lonceng §3]
  G4 --> N[Pengaturan §5]
```

---

## Peta Preview §1–§13

| § | Judul (App.tsx) | Tab / Entry | Layar (contoh) |
|---|-----------------|-------------|----------------|
| 1 | Onboarding | Cold start | 1–2 |
| 2 | Autentikasi | Post-onboarding | 3–4 |
| 3 | Beranda | Tab 1 + lonceng | 5–6, 33–34, 27 |
| 4 | Pencarian | Tab 2 | 35, 7, 40, 10, 37 |
| 5 | Profil | Tab 5 + Pengaturan | 8–9, 36, 11, 38–39 |
| 6 | Pembuatan Perjalanan | FAB [+] | 78, 12–14, 57–59, 67–71, 80–82, 20, 43–45, 84 |
| 7 | Detail — Itinerary | Tab trip | 77, 15, 72, 18–19, 85–93 |
| 8 | Detail — Voting | Tab trip | 16, 107, 42, 53–56, 60–66, 21, 48–49, 73–75 |
| 9 | Detail — Chat | Tab trip | 17, 23–24, 97–106 |
| 10 | Detail — Media | Tab trip | 41, 98 |
| 11 | Detail — Kelola Trip | Menu ⋮ | 50–52, 22 |
| 12 | Wishlist | Tab 4 | 108, 25–26, 110–120 |
| 13 | System States | Global patterns | 28–32, 94–96 |

---

## Struktur Navigasi Utama (Bottom Tab Bar)

Aplikasi menggunakan *Bottom Navigation Bar* dengan 5 menu (`figma/src/app/components/BottomNav.tsx`):

| Posisi | Label | Fungsi | Workflow |
|--------|-------|--------|----------|
| 1 | **Beranda** | Daftar perjalanan (tab Mendatang / Selesai / Undangan) | §3 |
| 2 | **Cari** | Pencarian pengguna lain | §4 |
| 3 | **[+]** | FAB tengah — buat perjalanan baru | §6 |
| 4 | **Wishlist** | Wishlist aktivitas impian | §12 |
| 5 | **Profil** | Halaman akun pengguna + pengaturan | §5 |

**Entry point global**: ikon lonceng di header Beranda → `Screen27Notifikasi` (digroup di §3 preview).

---

## §1. Onboarding Layar Awal

* **Layar Figma**: `Screen1Splash`, `Screen2EduOnboarding`
* **Trigger**: Cold start aplikasi (`Screen1Splash`).
* Saat splash selesai, FE mengecek flag first-launch (DataStore lokal).
* Jika pertama kali: carousel 4 slide (`Screen2EduOnboarding`):
  1. **Intro** — *"Realisasikan Wacana Liburanmu"*
  2. **Masalah + Solusi (Voting)** — Sepakat Jadwal Susah Banget → Vote Bareng, Hasil Jelas (+ preview mini voting)
  3. **Masalah + Solusi (Itinerary)** — Rencana Berserakan, Urutan Nggak Jelas → Timeline Harian yang Jelas (+ preview mini itinerary multi-hari)
  4. **Masalah + Solusi (Chat)** — Chat Trip Kecampur → Ruang Diskusi Khusus Trip (+ preview mini chat)
* Layout: scroll penuh konten + indicator slide sticky di atas CTA; tombol Selanjutnya/Mulai fixed bawah.
* Setelah onboarding selesai (atau jika bukan first-launch), arahkan ke Autentikasi (§2).
* **Interaksi Data**: — (flag first-launch di DataStore lokal; **tanpa API**)

## §2. Autentikasi (Google Sign-In)

* **Layar Figma**: `Screen3Auth`, `Screen4Username`
* **UI/UX**: Halaman bersih dengan logo aplikasi dan tombol "Lanjutkan dengan Google" (Warm Coral `#FF6B6B`).
* Sistem mengambil data profil dasar dari Google (Email, Nama, Avatar) dan upsert ke `users`.
* **Pengguna Baru**: Form *username* unik + validasi real-time (`Screen4Username`).
* **Pengguna Lama**: Langsung ke Beranda (§3).

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| Login Google | POST | `/v1/auth/google` `{id_token}` → JWT + `is_new_user` | ✅ |
| Set username | POST | `/v1/auth/complete-registration` `{username}` | ✅ |
| Cek username | GET | `/v1/users/check-username?username=` → `{available}` | ✅ |

## §3. Beranda (Home) — Tab 1

* **Layar Figma**: `Screen5Home`, `Screen6EmptyBeranda`, `Screen33HomeSelesai`, `Screen34HomeUndangan`, `Screen27Notifikasi`
* **Header**: Judul "Perjalananku" + lonceng notifikasi (badge unread).
* **Tab View**: "Mendatang", "Selesai", "Undangan" — masing-masing dengan **counter**.
* **Trip Card** (`Screen5Home`): `cover_image_url`, judul, tags, rentang tanggal, stacked avatars (`participants_preview`).
* **Tab Undangan** (`Screen34HomeUndangan`): card enriched (trip + inviter) + Terima/Tolak.
* **Notifikasi** (`Screen27Notifikasi`): tipe `invite`, `voting_deadline`, `destination_update`.

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| List trip mendatang | GET | `/v1/trips?tab=upcoming&cursor=` | ✅ |
| List trip selesai | GET | `/v1/trips?tab=completed&cursor=` | ✅ |
| Undangan pending | GET | `/v1/trips/invitations` | ✅ |
| Terima/Tolak undangan | PUT | `/v1/trips/:tripId/invitations/:id` `{accept}` | ✅ |
| List notifikasi | GET | `/v1/notifications/?cursor=` | ✅ |
| Badge unread | GET | `/v1/notifications/unread-count` | ✅ |
| Mark read | PUT | `/v1/notifications/:id/read` atau `/read-all` | ✅ |

> Response trip enriched: `participant_count`, `participants_preview[]`, `cover_image_url`, `voting_deadline`.

## §4. Pencarian (Cari) — Tab 2

* **Layar Figma**: `Screen35SearchIdle`, `Screen7SearchUser`, `Screen40SearchNoResults`, `Screen10PublicProfile`, `Screen37PublicProfileEmptyTrip`
* **Urutan preview**: Cari idle → Cari hasil → Cari kosong → Profil publik (dari hasil) → Profil publik empty trip.

### Flow Pencarian
* **Idle** (`Screen35SearchIdle`): search bar + riwayat terakhir (**client-only**).
* **Hasil** (`Screen7SearchUser`): Avatar, Username, Nama → tap → profil.
* **Kosong** (`Screen40SearchNoResults`): tidak ada hasil.

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| Cari user | GET | `/v1/users/search?q=&limit=&cursor=` | ✅ |

### Profil User Lain (dari hasil cari)
* **`Screen10PublicProfile`**: profil + grid trip publik (`trips.is_public=true`).
* **`Screen37PublicProfileEmptyTrip`**: profil tanpa trip di grid.

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| Profil | GET | `/v1/users/:username` → `ProfileView` + `public_trip_count` | ✅ |
| Grid trip | GET | `/v1/users/:username/trips` (stranger: hanya `is_public`) | ✅ |

## §5. Profil — Tab 5

* **Layar Figma**: `Screen8Profile`, `Screen36ProfileEmptyTrip`, `Screen9EditProfil`, `Screen11Settings`, `Screen39SettingsHelpFaq`, `Screen38SettingsDeleteAccount`

### Profil Pribadi
* Username di **header** (bukan di kartu profil).
* Kartu profil horizontal, stat trip, grid **semua** trip creator (termasuk `is_public=false`).
* **Empty trip** (`Screen36ProfileEmptyTrip`).

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| Profil saya | GET | `/v1/users/me` | ✅ |
| Grid trip saya | GET | `/v1/users/{my_username}/trips` | ✅ |

### Edit Profil (`Screen9EditProfil`)
* Edit bio; UI juga menampilkan website/sosial & ubah foto — **partial BE support**.

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| Update bio | PUT | `/v1/users/me` `{bio}` | ✅ |
| Website / lokasi pin | PUT | `/v1/users/me` `{website_url?, location_label?}` | 🔜 M5.2 |
| Upload avatar | POST | `/v1/users/me/avatar` (multipart) | 🔜 M5.2 |

### Pengaturan (akses dari Profil)
* **`Screen11Settings`**: akun, bantuan, keluar (logout = clear token lokal).
* **`Screen39SettingsHelpFaq`**: FAQ + kontak.
* **`Screen38SettingsDeleteAccount`**: konfirmasi hapus akun.

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| Hapus akun | DELETE | `/v1/users/me` | 🔜 M5.2 |
| Logout | — | Clear JWT lokal (opsional `POST /auth/logout`) | — |

## §6. Pembuatan Perjalanan — Tab [+]

* **Layar Figma**: `Screen78CreateTripEmpty`, `Screen12Create`, `Screen67CreateTripFixedDate`, `Screen68CreateTripFixedValidation`, `Screen70`–`Screen71`, `Screen57`–`Screen59`, `Screen80`–`Screen81`, `Screen13MultiDatePicker`, `Screen14FormValidation`, `Screen82CreateTripSubmitting`, `Screen20BottomSheetUndang`, `Screen43`–`Screen45`, `Screen84InvitePartialInvited`
* **UI/UX**: Modal full-screen — form **ringkas**:
  * Input "Nama Perjalanan" (wajib)
  * Tags dinamis (opsional)
  * Kalender rentang tanggal (wajib) + "+ Tambah Kandidat Tanggal"
  * **Waktu** (opsional): toggle *Sepanjang hari* (default) — jika off, set jam mulai & selesai
  * CTA sticky "Buat Perjalanan"
* **Mode A (tanggal pasti)**: 1 rentang → `status=fixed`.
* **Mode B (kandidat)**: >1 kandidat → `status=voting_pending` + auto voting tanggal + tenggat.
* **Undang setelah buat** — **hanya via pencarian** (tidak ada daftar saran teman):
  * `Screen20` — search kosong + CTA "Masuk ke Perjalanan"
  * `Screen43` — hasil pencarian ditemukan
  * `Screen84` — hasil cari, sebagian sudah terundang
  * `Screen44` — tidak ditemukan
  * `Screen45` — daftar yang sudah diundang (bisa batalkan)
* **Validasi** (`Screen14FormValidation`): semua error wajib **sekaligus**.

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| Buat trip (fixed) | POST | `/v1/trips/` `{name, tags, start_date, end_date}` | ✅ |
| Buat trip (voting) | POST | `/v1/trips/` `{name, tags, candidates[2-3]}` → `voting_pending` | ✅ |
| Waktu non-all-day | POST | `/v1/trips/` + `is_all_day, start_time, end_time` | 🔜 M5.2 |
| Undang username | POST | `/v1/trips/:id/invitations` `{username}` | ✅ |
| Undang email | POST | `/v1/trips/:id/invitations` `{email}` | ✅ |
| Cari untuk undang | GET | `/v1/users/search?q=` | ✅ |
| Batalkan undangan | DELETE | `/v1/trips/:id/invitations/:id` | 🔜 M5.2 |

> Setelah create: creator auto-masuk `trip_participants`. `voting_deadline` auto-set jika >1 kandidat.

## §7. Detail Perjalanan — Tab Itinerary

Entry detail trip: tap card Beranda (§3), setelah buat (§6), konversi wishlist (§12), atau deep link notifikasi.

* **Header global** (`TripDetailHeader`): judul trip, tanggal/waktu/status, back, menu **⋮** (§11).
* **4 Tab** (`TripDetailTabs`): Itinerary · Voting · Chat · Media — dengan counter (Voting tab hidden jika 0 aktif; Chat badge = unread; Media counter always visible).

* **Layar Figma**: `Screen77ItineraryEmpty`, `Screen15Destinations`, `Screen72DestinationsFixedDate`, `Screen18BottomSheetDestinasi`, `Screen85`–`Screen93`
* Timeline multi-hari dengan aktivitas berjadwal (waktu mulai/selesai, window harian).
* State waktu: past / present (Sekarang) / future — `resolveItineraryTimeState`.
* Bottom sheet tambah aktivitas — form selaras `ActivityFormSheet`.
* Cover aktivitas: Maps thumbnail, icon transport, atau media trip.
* Menu ⋮ per item: Edit · Hapus.
* **Naming**: UI = **Itinerary/aktivitas**; BE = `trip_destinations` / `/destinations`.

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| List aktivitas | GET | `/v1/trips/:id/destinations` | ✅ (field minimal) |
| Tambah aktivitas | POST | `/v1/trips/:id/destinations` | ✅ (field minimal) |
| Hapus aktivitas | DELETE | `/v1/trips/:id/destinations/:id` | ✅ |
| Edit aktivitas | PUT | `/v1/trips/:id/destinations/:id` | 🔜 M5.2 |
| Enriched fields | — | times, kind, ref_links[], cover_*, thumbnail | 🔜 M5.2 schema |
| Resolve Maps thumb | — | Places/Static API di BE | 🔜 M5.2 |

> Field minimal today: `place_name`, `maps_link`, `reference_link`, `sort_order`. Target penuh selaras `ActivityDraft` (`ActivityParts.tsx`).

## §8. Detail Perjalanan — Tab Voting

* **Layar Figma**: `Screen16Voting`, `Screen107VotingEmpty`, `Screen42`/`Screen53`–`Screen56`, `Screen60`–`Screen66`, `Screen21`/`Screen48`/`Screen49`, `Screen73`–`Screen75`
* **Multi-voting** concurrent — Tanggal / **Aktivitas** (internal type `destinasi`) / Lainnya — collapse section.
* **Empty** (`Screen107VotingEmpty`): trip tanggal pasti, badge voting **0**, CTA buat voting baru.
* Pipeline: aktif → selesai (manual/auto berakhir) → menu hanya Hapus.
* Buat voting baru: max 1 Tanggal & 1 Aktivitas aktif per trip.
* Reminder voting: cron H-7d / H-1d / H-1h (`voting_deadline`).

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| List kandidat tanggal | GET | `/v1/trips/:id/candidates` enriched | ✅ |
| Vote / unvote tanggal | POST/DELETE | `…/candidates/:id/vote` | ✅ |
| Kunci tanggal (creator) | POST | `…/candidates/:id/lock` → `status=fixed` | ✅ |
| Poll Aktivitas/Lainnya | CRUD + vote + lock/end | `/v1/trips/:id/polls` | 🔜 M5.2c |
| Buat voting baru (sheet) | POST | `/v1/trips/:id/polls` `{poll_type, title, options[], deadline?}` | 🔜 M5.2c |

> Tanggal voting = legacy `trip_date_candidates`. Multi-poll hub (Tanggal + **Aktivitas** + Lainnya) butuh `trip_polls` (§3.5 ARCHITECTURE).

## §9. Detail Perjalanan — Tab Chat

* **Layar Figma**: `Screen17Chat`, `Screen23EmptyChat`, `Screen24ChatLongPress`, `Screen97`–`Screen106`
* Chat bubbles (coral = pesan sendiri), input + kirim + lampiran foto/video.
* **Empty State** (`Screen23EmptyChat`): ilustrasi + prompt mulai obrolan.
* **Long Press** (`Screen24ChatLongPress`): Balas, Salin Teks, Hapus (pesan sendiri).

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| Load chat | GET | `/v1/trips/:id/messages?cursor=` (RFC3339) | ✅ |
| Kirim teks | POST | `/v1/trips/:id/messages` `{message}` | ✅ |
| Hapus pesan sendiri | DELETE | `/v1/trips/:id/messages/:messageId` soft | ✅ |
| Kirim foto/video | POST | multipart `{kind, file, caption?}` | 🔜 M5.2e |
| Balas pesan | POST | `{reply_to_id}` | 🔜 M5.2e |
| Mark read (badge) | PUT | `/v1/trips/:id/messages/read` | 🔜 M5.2d |
| Salin teks | — | Clipboard client | — |

> Media chat otomatis masuk tab Media (§10) via `trip_documents.from_chat=true`.

## §10. Detail Perjalanan — Tab Media

* **Layar Figma**: `Screen41TripDocuments`, `Screen98MediaFromChat`
* Grid foto/video perjalanan; unggah dari perangkat.
* **Cover trip** dipilih via "Jadikan Cover" — card Beranda resolve dari media ini.
* Media dari chat otomatis masuk tab Media (`Screen98`).

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| List media | GET | `/v1/trips/:id/documents` | 🔜 M5.2b |
| Upload foto/video | POST | `/v1/trips/:id/documents` multipart | 🔜 M5.2b |
| Hapus media | DELETE | `/v1/trips/:id/documents/:id` | 🔜 M5.2b |
| Jadikan cover | PUT | `/v1/trips/:id/cover` `{document_id}` | 🔜 M5.2b |

> Counter tab Media **selalu tampil** (termasuk 0). Cover card Beranda resolve dari `cover_document_id` atau default asset.

## §11. Detail Perjalanan — Kelola Trip (menu ⋮)

* **Layar Figma**: `Screen50TripMembers`, `Screen22CalendarSyncModal`, `Screen51TripEdit`, `Screen52TripDelete`
* **Daftar Anggota** — daftar anggota + undang via pencarian (sama seperti §6, tanpa saran).
* **Tambah ke Google Calendar** — modal (`Screen22CalendarSyncModal`, M11).
* **Edit Info Perjalanan** — modal (`Screen51TripEdit`).
* **Hapus Perjalanan** — konfirmasi (`Screen52TripDelete`).

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| List anggota + pending | GET | `/v1/trips/:id/members` | 🔜 M5.2 |
| Undang (search) | POST | `/v1/trips/:id/invitations` | ✅ |
| Batalkan undangan | DELETE | `/v1/trips/:id/invitations/:id` | 🔜 M5.2 |
| Keluarkan anggota | DELETE | `/v1/trips/:id/members/:userId` | 🔜 M5.2 |
| Edit info trip | PUT | `/v1/trips/:id` `{name, tags, dates?}` | ✅ |
| Hapus trip | DELETE | `/v1/trips/:id` soft (creator) | ✅ |
| Google Calendar | POST | `/v1/integrations/google-calendar/events` | M11 |

## §12. Wishlist Aktivitas — Tab 4

* **Layar Figma**: `Screen108WishlistEmpty`, `Screen25Wishlist`, `Screen110WishlistFilterEmpty`, `Screen111AddWishlistEmpty`, `Screen26BottomSheetWishlist`, `Screen112AddWishlistValidation`, `Screen113WishlistDetail`, `Screen114EditWishlist`, `Screen115WishlistCardMenu`, `Screen116WishlistDelete`, `Screen117WishlistToTripEmpty`, `Screen118WishlistToTripReady`, `Screen119WishlistToTripInvite`, `Screen120ItineraryFromWishlist`
* **Shared components**: `figma/src/app/components/trip/WishlistParts.tsx`

### Daftar & Filter
* Header **Wishlist Aktivitas** — **grid-only**.
* Sort tab prioritas: Semua / Tinggi / Menengah / Rendah (dengan counter).
* Filter tag + search bar.

### Tambah / Edit / Detail / Konversi
* Form field order: Mulai/Selesai → Nama → Prioritas → Maps → Link · CTA **Simpan Aktivitas**.
* Tap card → detail + CTA **Jadikan Perjalanan** (`Screen113`).
* **Jadikan Perjalanan**: `Screen117` prefill → `Screen118` submit → `Screen119` undang + banner hapus wishlist → `Screen120` 1 aktivitas itinerary hari 1.

| Aksi | Method | Endpoint | Status |
|------|--------|----------|--------|
| List + filter | GET | `/v1/wishlists/?priority=&tag[]=&cursor=` | ✅ |
| Tambah / edit | POST/PUT | `/v1/wishlists/` `{place_name, link, tags, priority_level}` | ✅ (field minimal) |
| Hapus | DELETE | `/v1/wishlists/:id` soft | ✅ |
| Enriched fields | — | start/end time, location, notes, thumbnail | 🔜 M5.2 |
| Jadikan Perjalanan | POST | `/v1/wishlists/:id/convert-to-trip` `{trip_name?, tags?, invite?}` | 🔜 M5.2 |

> Konversi **harus atomic** (transaction): create trip + 1 aktivitas hari 1 + soft-delete wishlist (`§3.4 ARCHITECTURE`).

## §13. System States & Micro-interactions

* **Layar Figma (unik di registry)**: `Screen28SkeletonLoading`, `Screen29ToastComponents`, `Screen30Error`, `Screen31DarkBeranda`, `Screen32DesignTokens`, `Screen94MediaViewerPhoto`, `Screen95MediaViewerVideo`, `Screen96MediaViewerVideoPlaying`
* Pola UX lain (empty, validasi, modal konfirmasi, loading submit) **hanya** muncul di section fitur masing-masing — tidak diduplikasi di §13 preview.
* Design tokens: `figma/src/app/components/colors.ts`, `Screen32DesignTokens.tsx`.

| State | Layar | Deskripsi |
|-------|-------|-----------|
| Splash | 1 | Logo coral + loading (§1) |
| Skeleton | 28 | Shimmer placeholder |
| Toast | 29 | Success (teal) / error (coral) / offline |
| Error | 30 | Offline / 404 + retry |
| Dark Mode | 31 | Variant Beranda gelap (M12) |
| Media Viewer | 94–96 | Foto / video pause / playing |
| Form Validation | 14 | Inline errors (§6) |

---

## Relasi dengan Dokumen Lain

| Dokumen | Peran |
|---------|-------|
| `docs/BRIEF.md` | Masalah, solusi, audiens, brand philosophy |
| `docs/PRD.md` | Spesifikasi MVP per fitur — selaras §1–§13 |
| `docs/FIGMA.md` | Inventori layar, design tokens, gap API vs backend |
| `docs/ARCHITECTURE.md` | **Schema §3**, **endpoint §4.3**, pola Go/KMP — sumber kebenaran teknis BE |
| `docs/MILESTONES.md` | M5.1 ✅ selesai · **M5.2 🔜 design parity BE** · M6+ mobile |
| `docs/ACCEPTANCE_CRITERIA.md` | Checklist UAT |

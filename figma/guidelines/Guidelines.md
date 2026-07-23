# Atur Perjalanan — Figma Preview Guidelines

Panduan untuk AI agents & developer saat mengedit bundle React di `figma/`.

## Sumber kebenaran

| Dokumen                              | Isi                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------- |
| `figma/src/app/App.tsx`              | Registry **125 layar**, §1–§13                                         |
| `figma/src/app/components/colors.ts` | Design tokens (`C.*`, `FONT`) — **wajib** dipakai, jangan hardcode hex |
| `docs/WORKFLOW.md`                   | Alur user + kontrak API per § (✅ vs 🔜 M5.2)                          |
| `docs/FIGMA.md`                      | Inventori layar, gap API, onboarding copy                              |
| `docs/ARCHITECTURE.md`               | **Schema §3**, endpoint §4.3 — sumber kebenaran teknis BE              |
| `docs/MILESTONES.md`                 | M5.2 = target implementasi gap BE                                      |

## Konvensi layar

- File: `Screen{N}{PascalCase}.tsx` — nomor **N** = indeks registry (sequential 1–125).
- Setiap layar muncul **sekali** di `App.tsx` (no cross-section duplicate).
- Phone frame label: "Layar N" dari field `index` registry.
- Shared UI trip: `figma/src/app/components/trip/` (`ItineraryParts`, `ActivityParts`, `VotingParts`, `ChatParts`, …).

## Naming UI vs backend

| UI (Figma)            | Backend (unchanged MVP)                                                                 |
| --------------------- | --------------------------------------------------------------------------------------- |
| Itinerary / aktivitas | `trip_destinations`, `/destinations`                                                    |
| Voting tipe Aktivitas | poll type `destinasi`                                                                   |
| Undang via search     | Tidak ada saran teman; email `Screen39`→`Screen40` tanpa konfirmasi terpisah            |
| Voting sheet tanggal  | Tanpa field judul — badge jenis + kandidat + tenggat (`CreateVotingTanggalDetailsForm`) |
| Chat hapus pesan      | Hanya long-press pesan sendiri (`ChatLongPressMenu isOwnMessage`)                       |

## Voting sheets (`CreateVotingSheetParts.tsx`)

- Title sheet: **Detail Voting** / **Edit Voting** / **Tambah Kandidat Tanggal** — jenis voting lewat `VotingTypeBadgeInline`, bukan di judul.
- Subtitle statis per jenis — lihat konstanta `CREATE_VOTING_*` / `EDIT_VOTING_*` di file tersebut.
- `Screen67`: edit voting tanggal — tanpa `onBack`, footer **Simpan**.

## Chat (`ChatParts.tsx`)

- Long press: `Screen87` (orang lain, tanpa Hapus) · `Screen88` (sendiri, dengan Hapus).
- Reply quote: `ChatReplyQuote` + `replyTo` pada `ChatMessage` — `Screen89`–`Screen92`.

## Layout & styling

- Mobile-first, max width phone frame (~390px).
- Prefer flexbox/grid; absolute positioning hanya untuk overlay/modal.
- Spacing & radius konsisten dengan `Screen125DesignTokens`.
- Bahasa UI: **Bahasa Indonesia** (copy produk).

## Onboarding (`Screen2EduOnboarding`)

4 slide carousel — copy selaras `docs/BRIEF.md` / `docs/WORKFLOW.md §1`:

1. _Selamat datang_ — Realisasikan Wacana Liburanmu
2. Sepakat Jadwal Susah Banget → Vote Bareng, Hasil Jelas
3. Rencana Berserakan, Urutan Nggak Jelas → Timeline Harian yang Jelas (+ preview itinerary multi-hari)
4. Chat Trip Kecampur → Ruang Diskusi Khusus Trip

Sticky pagination dots (klikable) + fixed CTA; konten scrollable full-screen; tanpa skip.

## Autentikasi (`Screen3Auth`, `Screen4Username`)

- MVP: **Lanjutkan dengan Google** saja — tombol email post-MVP (sembunyikan/nonaktifkan di mobile).
- Username: `a-z`, `0-9`, `_`, min 3 max 30 — gap BE: validator `alphanum` belum izinkan `_` (M5.2).
- **Agent**: lihat `docs/WORKFLOW.md` → Panduan Implementasi §1–§3.

## Beranda (`Screen5Home`–`Screen9Notifikasi`)

- Shared: `home/HomeBerandaParts.tsx` — jangan duplikasi layout di layar individual.
- Tab counter selalu tampil; `TripCard dimmed` hanya tab Selesai; `InvitationCard` ≠ `TripCard`.
- Lonceng badge cap **9+**; notifikasi full-page dengan aksi inline per tipe.
- `TRIP_DATE_PENDING` = `"Tanggal sedang divoting"`.
- Hydrate `actor_id`/`trip_id`; Terima/Tolak notif invite via lookup `GET /invitations` (gap `invitation_id` M5.2).

## Sebelum commit perubahan layar

1. Tambah/update entry di `App.tsx` section yang benar (§1–§13).
2. `cd figma && npm run build` harus lulus.
3. Update `docs/FIGMA.md` + `docs/WORKFLOW.md` jika menambah/menghapus layar atau mengubah alur.

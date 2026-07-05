# Atur Perjalanan — Figma Preview Guidelines

Panduan untuk AI agents & developer saat mengedit bundle React di `figma/`.

## Sumber kebenaran

| Dokumen | Isi |
|---------|-----|
| `figma/src/app/App.tsx` | Registry **112 layar**, §1–§13 |
| `figma/src/app/components/colors.ts` | Design tokens (`C.*`, `FONT`) — **wajib** dipakai, jangan hardcode hex |
| `docs/WORKFLOW.md` | Alur user + kontrak API per § (✅ vs 🔜 M5.2) |
| `docs/FIGMA.md` | Inventori layar, gap API, onboarding copy |
| `docs/ARCHITECTURE.md` | **Schema §3**, endpoint §4.3 — sumber kebenaran teknis BE |
| `docs/MILESTONES.md` | M5.2 = target implementasi gap BE |

## Konvensi layar

- File: `Screen{N}{PascalCase}.tsx` — nomor **N** = indeks registry (boleh non-sequential).
- Setiap layar muncul **sekali** di `App.tsx` (no cross-section duplicate).
- Phone frame label: "Layar N" dari field `index` registry.
- Shared UI trip: `figma/src/app/components/trip/` (`ItineraryParts`, `ActivityParts`, `VotingParts`, `ChatParts`, …).

## Naming UI vs backend

| UI (Figma) | Backend (unchanged MVP) |
|------------|-------------------------|
| Itinerary / aktivitas | `trip_destinations`, `/destinations` |
| Voting tipe Aktivitas | poll type `destinasi` |
| Undang via search | Tidak ada saran teman (`Screen83` dihapus) |

## Layout & styling

- Mobile-first, max width phone frame (~390px).
- Prefer flexbox/grid; absolute positioning hanya untuk overlay/modal.
- Spacing & radius konsisten dengan `Screen32DesignTokens`.
- Bahasa UI: **Bahasa Indonesia** (copy produk).

## Onboarding (`Screen2EduOnboarding`)

4 slide carousel — copy selaras `docs/BRIEF.md` / `docs/WORKFLOW.md §1`:

1. Realisasikan Wacana Liburanmu  
2. Sepakat Jadwal Susah Banget → Vote Bareng, Hasil Jelas  
3. Rencana Berserakan → Timeline Harian yang Jelas (+ preview itinerary multi-hari)  
4. Chat campur aduk → Ruang Diskusi Khusus Trip  

Sticky pagination dots + fixed CTA; konten scrollable full-screen.

## Sebelum commit perubahan layar

1. Tambah/update entry di `App.tsx` section yang benar (§1–§13).
2. `cd figma && npm run build` harus lulus.
3. Update `docs/FIGMA.md` + `docs/WORKFLOW.md` jika menambah/menghapus layar atau mengubah alur.

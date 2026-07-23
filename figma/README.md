# Atur Perjalanan — Figma Preview Bundle

React preview bundle untuk **125 layar** high-fidelity MVP. Sumber kebenaran inventori layar & design tokens untuk tim produk dan AI agents.

## Quick Start

```bash
npm i
npm run dev
```

Buka URL Vite (biasanya `http://localhost:5173`).

## Struktur

| Path                               | Isi                                                |
| ---------------------------------- | -------------------------------------------------- |
| `src/app/App.tsx`                  | Registry **125 layar** dikelompokkan **§1–§13**    |
| `src/app/components/screens/`      | Satu file per layar (`Screen{N}*.tsx`)             |
| `src/app/components/trip/`         | Composable UI trip (itinerary, voting, chat, dll.) |
| `src/app/components/colors.ts`     | Design tokens (`C`, `AVATAR_COLORS`, `FONT`)       |
| `src/app/components/BottomNav.tsx` | Bottom nav 5 tab                                   |

## Dokumentasi Terkait

- [docs/FIGMA.md](../docs/FIGMA.md) — inventori layar, tokens, gap API
- [docs/WORKFLOW.md](../docs/WORKFLOW.md) — alur pengguna §1–§13
- [docs/BRIEF.md](../docs/BRIEF.md) — masalah & solusi produk

## Catatan

- Nomor layar = `Screen{N}` (sequential 1–125, contoh: `Screen108`).
- UI memakai **Itinerary / aktivitas**; backend memakai `trip_destinations`.
- Undangan trip: hanya via **pencarian** username/email (tidak ada saran teman).
- Voting sheet copy & form rules: `CreateVotingSheetParts.tsx` — lihat `docs/WORKFLOW.md §8`.
- Chat long press & reply: `ChatParts.tsx` — `Screen87`/`Screen88`, `Screen89`–`Screen92`.

Original Figma: https://www.figma.com/design/tFarpj9aEUL64GrDd1jGU5/Atur-Perjalanan

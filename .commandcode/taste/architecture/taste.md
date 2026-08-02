# architecture
- Prefers to audit and fix monorepo architecture fundamentals (package boundaries, shared code, tooling) before building features on top — takes a "foundations first" approach rather than deferring structural debt. Confidence: 0.9
- Prefers shared packages across backend and mobile (shared types, shared validation schemas) instead of duplicating type definitions or validation logic in each package. Confidence: 0.85
- Prefers standardized root-level tooling configs (ESLint flat config, Prettier, tsconfig.base.json) applied uniformly across all packages in the monorepo rather than per-package bespoke configurations. Confidence: 0.8
- Prefers making architectural decisions via structured options with clear recommendations, and tends to choose the comprehensive option when presented. Confidence: 0.8
- Expects documentation (README, env examples, architecture docs) to be updated alongside code changes — does not tolerate stale docs after refactoring. Confidence: 0.8
- Expects the agent to read ALL relevant documentation files comprehensively (README, PRD, WORKFLOW, FIGMA, ARCHITECTURE, etc.) before starting work — being reminded to read a missing doc is a signal of insufficient thoroughness. Confidence: 0.85

- Every React Query hook that fetches user-facing data should include `refetchOnMount: 'always'` to bypass stale cache from AsyncStorage persistence — applied consistently to `useTrips`, `useUserTrips`, etc. Confidence: 0.75

- Screens that display API-fetched data must have explicit loading state (e.g., `ActivityIndicator`) and error state (e.g., fallback UI with retry option) — no screen should silently show empty content while loading or on error. Confidence: 0.8

- Every user-triggered API call — including action/mutation endpoints (e.g., sending a trip invite), not just data-fetching screens — must show an explicit loading indicator while the request is in flight. A missing loader on any API hit is a bug the user expects the agent to audit systematically across the whole app ("tolong audit lagi segala hit api yang belum ada loadernya" — audit all API hits lacking loaders; for list-item actions (e.g., accept/decline invitation), the loader must be scoped to that item's own buttons — a spinner inside the button while its request is in flight, not a global spinner). Confidence: 0.85

- Prefers real-time derived values (e.g., `trips.length` from fresh query data) over stale cached counters (e.g., `user.trip_count` from one-time session hydrate) for stat displays in the UI. Confidence: 0.75

- Proactively cleans up unused imports and merges duplicate imports from the same module (e.g., `import { colors } from '@/theme/colors'` + `import { avatarColorFor } from '@/theme/colors'` → single import) when editing a file. The user also explicitly requests dead/unused code removal as part of change requests ("hapus code code terkait wishlist yang sudah tidak diperlukan"), so the agent should audit for and strip unused imports/utilities (e.g., `useRef`, `AsyncStorage`, `useConvertToTrip`, unused theme imports) rather than leaving them behind. Confidence: 0.8

- When Prisma has version-specific bugs (e.g., 5.22 + Node 24 `take` validator regression), prefers falling back to `$queryRawUnsafe` with hand-written SQL rather than endlessly trying different ORM syntax permutations — pragmatic "bypass the bug" approach over "work around within the ORM." Confidence: 0.7

- Prefer popup/dropdown menus over full-screen navigation for secondary management actions (e.g., Kelola Trip / kebab ⋯ actions should be a popup menu from the header, not a separate routed screen). Confidence: 0.9

- Related sub-features of a detail screen (e.g., Voting, Chat, Media inside Trip Detail) should be rendered inline in the same screen via local tab state — not as separate routed screens each with their own header/back navigation; the URL should not change when switching tabs. Confidence: 0.85

- Edit screens should reuse the create screen component with an edit state flag — the user explicitly stated edit-info should go to "the same screen as create trip but set conditionally" ("edit info perjalanan harusnya ke screen yang sama kaya buat perjalanan tapi diset conditional", citing Figma Screen103TripEdit): prefill existing data, swap the CTA to "Simpan", and reuse the same form shell rather than building a separate near-duplicate screen or a small popup. Confidence: 0.92

- Activity creation form should not include a "Jenis" (kind/type) selector field — the kind is determined by context or defaults per the design spec; extra fields not in the design are bugs. Confidence: 0.85

- Backend API validation should defensively trim whitespace from time inputs before applying strict format validation (e.g., `.trim()` on start_time and end_time before Zod regex check) to handle client-side formatting inconsistencies. Confidence: 0.8

- Calendar date picker should default to today's date as the initial selected date when first opened. Confidence: 0.85

- Navigation back actions should gracefully handle an empty navigation stack (e.g., after browser refresh) by falling back to a default route instead of throwing an error. Confidence: 0.85

- When a component's presentation layer changes (e.g., from modal sheet to full screen), prefers refactoring the existing component into a pure content component (no modal/backdrop/visible props) and wrapping it in a new routed screen that provides the header/navigation — reusing the existing content logic rather than rewriting it, and deleting the obsolete modal file. Confidence: 0.75
- User-entered times are wall-clock values (e.g., 19:00–21:30) that must be preserved and rendered identically on every surface (form, wishlist, itinerary activity, serializers) — any timezone-induced shift (e.g., a Prisma `@db.Time` value read with local `getHours()`/`toTimeString` vs UTC `toISOString` turning 19:00 into 07:00) is a bug the user will report. Times should be treated as local wall-clock throughout DB storage and serialization, never as UTC instants; when a time renders differently in one part of the app than another, the agent must trace the DB value → serializer → UI chain to find the conversion mismatch. Confidence: 0.7

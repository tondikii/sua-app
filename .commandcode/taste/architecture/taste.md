# architecture
- Prefers to audit and fix monorepo architecture fundamentals (package boundaries, shared code, tooling) before building features on top — takes a "foundations first" approach rather than deferring structural debt. Confidence: 0.9
- Prefers shared packages across backend and mobile (shared types, shared validation schemas) instead of duplicating type definitions or validation logic in each package. Confidence: 0.85
- Prefers standardized root-level tooling configs (ESLint flat config, Prettier, tsconfig.base.json) applied uniformly across all packages in the monorepo rather than per-package bespoke configurations. Confidence: 0.8
- Prefers making architectural decisions via structured options with clear recommendations, and tends to choose the comprehensive option when presented. Confidence: 0.7
- Expects documentation (README, env examples, architecture docs) to be updated alongside code changes — does not tolerate stale docs after refactoring. Confidence: 0.8
- Expects the agent to read ALL relevant documentation files comprehensively (README, PRD, WORKFLOW, FIGMA, ARCHITECTURE, etc.) before starting work — being reminded to read a missing doc is a signal of insufficient thoroughness. Confidence: 0.85

- Every React Query hook that fetches user-facing data should include `refetchOnMount: 'always'` to bypass stale cache from AsyncStorage persistence — applied consistently to `useTrips`, `useUserTrips`, etc. Confidence: 0.75

- Screens that display API-fetched data must have explicit loading state (e.g., `ActivityIndicator`) and error state (e.g., fallback UI with retry option) — no screen should silently show empty content while loading or on error. Confidence: 0.8

- Prefers real-time derived values (e.g., `trips.length` from fresh query data) over stale cached counters (e.g., `user.trip_count` from one-time session hydrate) for stat displays in the UI. Confidence: 0.75

- Proactively cleans up unused imports and merges duplicate imports from the same module (e.g., `import { colors } from '@/theme/colors'` + `import { avatarColorFor } from '@/theme/colors'` → single import) when editing a file. Confidence: 0.7

- When Prisma has version-specific bugs (e.g., 5.22 + Node 24 `take` validator regression), prefers falling back to `$queryRawUnsafe` with hand-written SQL rather than endlessly trying different ORM syntax permutations — pragmatic "bypass the bug" approach over "work around within the ORM." Confidence: 0.7

- Prefer popup/dropdown menus over full-screen navigation for secondary management actions (e.g., Kelola Trip should be a popup menu from the header, not a separate routed screen). Confidence: 0.85

- Edit screens should reuse the create screen component with an edit state flag (e.g., EditTrip reuses CreateTrip screen with pre-filled data and "Edit Perjalanan" title) rather than building a separate screen. Confidence: 0.85

- Activity creation form should not include a "Jenis" (kind/type) selector field — the kind is determined by context or defaults per the design spec; extra fields not in the design are bugs. Confidence: 0.85

- Backend API validation should defensively trim whitespace from time inputs before applying strict format validation (e.g., `.trim()` on start_time and end_time before Zod regex check) to handle client-side formatting inconsistencies. Confidence: 0.8

- Calendar date picker should default to today's date as the initial selected date when first opened. Confidence: 0.85

- Navigation back actions should gracefully handle an empty navigation stack (e.g., after browser refresh) by falling back to a default route instead of throwing an error. Confidence: 0.85

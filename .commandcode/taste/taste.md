# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# env

- `.env.example` and environment variables must accurately reflect platform/service requirements — e.g., iOS and Android use separate client IDs from Google Cloud Console and must not be conflated into a single misleading variable. Confidence: 0.8

- When updating an environment variable's value in `.env`, must also update the same value in `.env.example` simultaneously to keep both files in sync. Confidence: 0.85

- Expects ALL env files across the project (root `.env`, `backend/.env`, `mobile/.env` / `mobile/.env.production`) to be kept in sync with their `.env.example` templates in both directions — when asked to sync env files ("sync semua env, hapus yang sudah tidak terpakai"), the agent should copy any vars present in the template but missing from `.env`, remove vars no longer used, and fix template variable names that no longer match actual code usage (e.g., `EXPO_PUBLIC_GOOGLE_CLIENT_ID` → `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, matching `useGoogleAuth.ts`). "Unused" is judged by actual source-code usage (grep for `process.env` / config reads, plus deployment docs/config), not by file-diff guessing or stale doc references; the final state is verified with an automated key-set comparison across all env files before declaring done. Confidence: 0.85

# web
See [web/taste.md](web/taste.md)
# ui/form
See [ui/form/taste.md](ui/form/taste.md)
# ui/navigation

- Nested `<Tabs>` layouts that exist only for route/screen organization (not actual bottom navigation) must hide the tab bar via `tabBarStyle: { display: 'none' }` — sub-screens like trip detail use custom header tabs for navigation, and the bottom tab bar should not appear there. The main app-level `(tabs)` group is the only place the bottom tab bar should be visible. Confidence: 0.8

# ui/icons

- **Zero tolerance for emoji in UI** — SVG icon components must be used for ALL UI elements; emoji must never appear in production UI as icons or decorative elements (e.g., `🔍` → `Search` SVG, `🕐` → `Clock` SVG, `✈️🗳️📋🔔` → dedicated notification-type SVG icons, `›` → `ChevronRight`, `×` → `X`). This is a hard requirement, not a preference. Confidence: 0.92

- When a needed icon component does not exist, creates it following the project's existing icon patterns (same file structure, same `{size, color}` props interface, same react-native-svg approach) rather than using text/emoji workarounds or inline SVGs. Confidence: 0.8

- On web, `<TextInput>` elements show a browser-default focus outline that must be explicitly removed via `outlineStyle: 'none'` (web-only, `Platform.OS === 'web'`) on every TextInput style — the user considers this a visual bug if not handled. Apply consistently across all screens with inputs (search, forms, edit profile, wishlist sheets). Confidence: 0.7

- On web, focused TextInput elements should show a custom visible focus border in the app's accent color (coral, 2px) in addition to removing the browser default outline — the focus indicator should be a deliberate design choice, applied consistently to EVERY text input and time-picker box across the app (forms, search bars, chat, settings, auth, wishlist sheets), not just outline removal. Confidence: 0.8

- When asked to make focus styling consistent across all inputs, prefers a shared reusable component (e.g., `FocusedTextInput`) that auto-applies the coral focus border + web `outlineStyle: 'none'`, used across every screen rather than per-file manual styling. Confidence: 0.75

# workflow
See [workflow/taste.md](workflow/taste.md)
# communication

- Communication is a mix of Indonesian and English; agent may respond in Indonesian, but all code must be written in English (variable names, comments, strings, file content). Confidence: 0.9
- Provides structured IDE context in messages using `<ide-context>` blocks containing file path, language, and line number — signals that the agent should reference the exact file location to understand the current working context. Confidence: 0.85

# architecture
See [architecture/taste.md](architecture/taste.md)

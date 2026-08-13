# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# env

- `.env.example` and environment variables must accurately reflect platform/service requirements — e.g., iOS and Android use separate client IDs from Google Cloud Console and must not be conflated into a single misleading variable. Confidence: 0.8

- When updating an environment variable's value in `.env`, must also update the same value in `.env.example` simultaneously to keep both files in sync. Confidence: 0.85

- Expects ALL env files across the project (root `.env`, `backend/.env`, `mobile/.env` / `mobile/.env.production`) to be kept in sync with their `.env.example` templates in both directions — when asked to sync env files ("sync semua env, hapus yang sudah tidak terpakai"), the agent should copy any vars present in the template but missing from `.env`, remove vars no longer used, and fix template variable names that no longer match actual code usage (e.g., `EXPO_PUBLIC_GOOGLE_CLIENT_ID` → `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, matching `useGoogleAuth.ts`). "Unused" is judged by actual source-code usage (grep for `process.env` / config reads, plus deployment docs/config), not by file-diff guessing or stale doc references; the final state is verified with an automated key-set comparison across all env files before declaring done. Confidence: 0.85

- Uses a single shared Supabase instance across all environments (development, local, and production) — `DATABASE_URL`/`DIRECT_URL` are identical everywhere with no environment-isolated fallback; the user noted this as an FYI during Vercel debugging, signaling that migrations must be run manually and non-destructively — the user manages schema changes manually via the Supabase Dashboard rather than via automated build-time migration or Prisma CLI. Consistent with the free-tier hosting preference. Confidence: 0.8

# web
See [web/taste.md](web/taste.md)
# ui/form
See [ui/form/taste.md](ui/form/taste.md)
# ui/navigation

- Nested `<Tabs>` layouts that exist only for route/screen organization (not actual bottom navigation) must hide the tab bar via `tabBarStyle: { display: 'none' }` — sub-screens like trip detail use custom header tabs for navigation, and the bottom tab bar should not appear there. The main app-level `(tabs)` group is the only place the bottom tab bar should be visible. Confidence: 0.8

# ui/icons
See [ui/icons/taste.md](ui/icons/taste.md)
# workflow
See [workflow/taste.md](workflow/taste.md)
# communication

- Communication is a mix of Indonesian and English; agent may respond in Indonesian, but all code must be written in English (variable names, comments, strings, file content). Confidence: 0.9
- Provides structured IDE context in messages using `<ide-context>` blocks containing file path, language, and line number — signals that the agent should reference the exact file location to understand the current working context. Reconfirmed when the user pasted an IDE error for `backend/api/index.ts` (line 5) with a bare `<ide-context>` block and no further explanation — the agent anchored on that exact file/line to investigate. Confidence: 0.9

# architecture
See [architecture/taste.md](architecture/taste.md)

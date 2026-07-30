# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# env

- `.env.example` and environment variables must accurately reflect platform/service requirements — e.g., iOS and Android use separate client IDs from Google Cloud Console and must not be conflated into a single misleading variable. Confidence: 0.8

- When updating an environment variable's value in `.env`, must also update the same value in `.env.example` simultaneously to keep both files in sync. Confidence: 0.85

# web
See [web/taste.md](web/taste.md)
# ui/form

- Time inputs should use a structured picker component (scrollable hour/minute columns with confirm/cancel), not a free-form TextInput — the user explicitly wants a proper "time selector" that feels nicer than a raw text field for entering structured data like time. Confidence: 0.8
- TimePicker component must be extracted as a shared reusable component (e.g., `components/TimePicker.tsx`) and used across all screens that need time input (CreateTrip, ActivityFormSheet, etc.) — never duplicated inline per screen. Confidence: 0.85
- When a time picker input box is focused/active, it must show a visible focus indicator (dark/black border) on the input box itself, not just when the picker dropdown is open. Confidence: 0.8
- Tag input should fill the full width of its container (use `flex: 1`), not be constrained to a fixed minimum width — the tag trigger/input should span the entire available space. Confidence: 0.85

# ui/navigation

- Nested `<Tabs>` layouts that exist only for route/screen organization (not actual bottom navigation) must hide the tab bar via `tabBarStyle: { display: 'none' }` — sub-screens like trip detail use custom header tabs for navigation, and the bottom tab bar should not appear there. The main app-level `(tabs)` group is the only place the bottom tab bar should be visible. Confidence: 0.8

# ui/icons

- **Zero tolerance for emoji in UI** — SVG icon components must be used for ALL UI elements; emoji must never appear in production UI as icons or decorative elements (e.g., `🔍` → `Search` SVG, `🕐` → `Clock` SVG, `✈️🗳️📋🔔` → dedicated notification-type SVG icons, `›` → `ChevronRight`, `×` → `X`). This is a hard requirement, not a preference. Confidence: 0.92

- When a needed icon component does not exist, creates it following the project's existing icon patterns (same file structure, same `{size, color}` props interface, same react-native-svg approach) rather than using text/emoji workarounds or inline SVGs. Confidence: 0.8

- On web, `<TextInput>` elements show a browser-default focus outline that must be explicitly removed via `outlineStyle: 'none'` (web-only, `Platform.OS === 'web'`) on every TextInput style — the user considers this a visual bug if not handled. Apply consistently across all screens with inputs (search, forms, edit profile, wishlist sheets). Confidence: 0.7

- On web, focused TextInput elements should show a custom visible focus border (e.g., black/dark border) in addition to removing the browser default outline — the focus indicator should be a deliberate design choice, not just outline removal. Confidence: 0.75

# workflow
See [workflow/taste.md](workflow/taste.md)
# communication

- Communication is a mix of Indonesian and English; agent may respond in Indonesian, but all code must be written in English (variable names, comments, strings, file content). Confidence: 0.9
- Provides structured IDE context in messages using `<ide-context>` blocks containing file path, language, and line number — signals that the agent should reference the exact file location to understand the current working context. Confidence: 0.8

# architecture
See [architecture/taste.md](architecture/taste.md)
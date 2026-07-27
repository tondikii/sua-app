# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# env

- `.env.example` and environment variables must accurately reflect platform/service requirements — e.g., iOS and Android use separate client IDs from Google Cloud Console and must not be conflated into a single misleading variable. Confidence: 0.8

# web

- Constrain web layout to mobile phone max-width (e.g., 390-430px) so the web design mirrors the mobile app design exactly. Confidence: 0.75

- The Expo/React Native application must also target the web platform (Expo web) — mobile and web are built from the same codebase, not separate projects. Confidence: 0.8

- Prefers working "correctly and accurately to the design" — implementation must match Figma design specs exactly (dimensions, colors, spacing, font weights, component structure, shadows), not just functionally. Design fidelity is a first-class requirement. Confidence: 0.8

- Prefers reusing existing Figma source code directly (the `.tsx` component files under `figma/src/app/components/`) rather than recreating design assets from scratch — the agent should extract and adapt the existing Figma components, not author new ones. Confidence: 0.85

# workflow
See [workflow/taste.md](workflow/taste.md)
# communication

- Communication is a mix of Indonesian and English; agent may respond in Indonesian, but all code must be written in English (variable names, comments, strings, file content). Confidence: 0.9
- Provides structured IDE context in messages using `<ide-context>` blocks containing file path, language, and line number — signals that the agent should reference the exact file location to understand the current working context. Confidence: 0.7

# architecture
See [architecture/taste.md](architecture/taste.md)

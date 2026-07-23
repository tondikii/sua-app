# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# env

- `.env.example` and environment variables must accurately reflect platform/service requirements — e.g., iOS and Android use separate client IDs from Google Cloud Console and must not be conflated into a single misleading variable. Confidence: 0.8

# web

- Constrain web layout to mobile phone max-width (e.g., 390-430px) so the web design mirrors the mobile app design exactly. Confidence: 0.75

- Prefers working "correctly and accurately to the design" — implementation must match Figma design specs exactly (dimensions, colors, spacing, font weights, component structure, shadows), not just functionally. Design fidelity is a first-class requirement. Confidence: 0.8

# workflow

- Prefers agent to first read project documentation (README, docs/) to understand context before proposing next steps or architecture decisions — "read first, propose later" approach, not jumping into suggestions without context. Confidence: 0.7
- Prefers continuous forward momentum — proceeding to the next milestone/task even when the current milestone hasn't been fully tested or verified (e.g., EAS build still pending), rather than waiting for full verification before moving on. Confidence: 0.8

# communication

- Communication is a mix of Indonesian and English; agent may respond in Indonesian, but all code must be written in English (variable names, comments, strings, file content). Confidence: 0.9
- Provides structured IDE context in messages using `<ide-context>` blocks containing file path, language, and line number — signals that the agent should reference the exact file location to understand the current working context. Confidence: 0.7

# architecture

- Prefers to audit and fix monorepo architecture fundamentals (package boundaries, shared code, tooling) before building features on top — takes a "foundations first" approach rather than deferring structural debt. Confidence: 0.9
- Prefers shared packages across backend and mobile (shared types, shared validation schemas) instead of duplicating type definitions or validation logic in each package. Confidence: 0.85
- Prefers standardized root-level tooling configs (ESLint flat config, Prettier, tsconfig.base.json) applied uniformly across all packages in the monorepo rather than per-package bespoke configurations. Confidence: 0.8
- Prefers making architectural decisions via structured options with clear recommendations, and tends to choose the comprehensive option when presented. Confidence: 0.7
- Expects documentation (README, env examples, architecture docs) to be updated alongside code changes — does not tolerate stale docs after refactoring. Confidence: 0.8

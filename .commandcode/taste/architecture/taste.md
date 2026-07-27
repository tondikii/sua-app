# architecture
- Prefers to audit and fix monorepo architecture fundamentals (package boundaries, shared code, tooling) before building features on top — takes a "foundations first" approach rather than deferring structural debt. Confidence: 0.9
- Prefers shared packages across backend and mobile (shared types, shared validation schemas) instead of duplicating type definitions or validation logic in each package. Confidence: 0.85
- Prefers standardized root-level tooling configs (ESLint flat config, Prettier, tsconfig.base.json) applied uniformly across all packages in the monorepo rather than per-package bespoke configurations. Confidence: 0.8
- Prefers making architectural decisions via structured options with clear recommendations, and tends to choose the comprehensive option when presented. Confidence: 0.7
- Expects documentation (README, env examples, architecture docs) to be updated alongside code changes — does not tolerate stale docs after refactoring. Confidence: 0.8
- Expects the agent to read ALL relevant documentation files comprehensively (README, PRD, WORKFLOW, FIGMA, ARCHITECTURE, etc.) before starting work — being reminded to read a missing doc is a signal of insufficient thoroughness. Confidence: 0.85

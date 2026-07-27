# workflow
- Prefers agent to first read project documentation (README, docs/) to understand context before proposing next steps or architecture decisions — "read first, propose later" approach, not jumping into suggestions without context. Confidence: 0.7
- Prefers continuous forward momentum — proceeding to the next milestone/task even when the current milestone hasn't been fully tested or verified (e.g., EAS build still pending), rather than waiting for full verification before moving on. Confidence: 0.8
- Uses EAS development builds for mobile testing rather than Expo Go — agent should assume standalone dev builds when diagnosing platform-specific issues (e.g., OAuth, deep linking), not Expo Go web-proxy behavior. Confidence: 0.85
- When debugging configuration issues, compares against known-working existing projects (e.g., referencing another Expo RN app's OAuth config) to determine what's actually required — uses "this works without X on my other project" as evidence to push back on unnecessary additions. Confidence: 0.8
- Uses standalone test files (e.g., `google-login-test.html`) to isolate and verify subsystem behavior before debugging within the full app — methodical isolation-first debugging. Confidence: 0.75

- When debugging cloud service integration (OAuth, APIs), cross-references local codebase configuration (.env, environment variables) against the cloud service's configured settings (e.g., Google Cloud Console authorized URIs, client IDs) and expects the agent to diagnose mismatches between the two rather than only debugging code logic. Confidence: 0.65
- Prefers minimal, lean configuration — pushes back on adding unnecessary scopes, APIs, or settings ("scope belum perlu kali", "People API kenya gaperlu deh") and only adds what is strictly required. Confidence: 0.8

- Expects consistent naming conventions across test files — inconsistent test file naming (e.g., mixed `*.spec.ts`, `*.e2e-spec.ts`, `*.test.ts` patterns) is a bug that should be proactively audited and fixed. Confidence: 0.85

- Expects the agent to proactively cross-reference milestone requirements against ALL project documentation (PRD, WORKFLOW, FIGMA, ARCHITECTURE, actual Figma screens) to find gaps — not just implement the milestone checklist verbatim. The user expects the agent to think critically about what's missing beyond what's explicitly written. Confidence: 0.8

- Prefers incremental, module-by-module fixes when aligning web with mobile — starts with "dari module auth dulu" (from the auth module first) rather than attempting a sweeping cross-cutting fix across all modules at once. Confidence: 0.65

- Expects the agent to proactively manage backend infrastructure (starting dev servers, killing zombie processes on occupied ports, verifying service health) when connection errors arise — treats "backend not running" as an agent responsibility, not a user task. Confidence: 0.7

- Reports infrastructure issues (connection refused, port conflicts) the same way as code bugs — expects the agent to autonomously distinguish between actual code problems and missing/stale services, and fix accordingly. Confidence: 0.65

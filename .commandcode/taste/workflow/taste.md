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

- Prefers a structured "audit-first, fix-later" workflow when addressing UI/design discrepancies — first comprehensively audit and list all differences between Figma design and implementation in a detailed plan, then fix them systematically one by one, rather than making ad-hoc fixes without a prior comparison. Confidence: 0.75

- Form validation errors must clear reactively when the user edits the corresponding field — error indicators should not persist after the user begins correcting the input, even if the form hasn't been re-submitted. "When edited, the error should disappear" is the expected behavior. Confidence: 0.85

- For runtime/API debugging, expects fast diagnosis and immediate fixes — gets frustrated when the agent spends excessive time (15-20+ minutes) exploring/reading files without producing code changes. Prefers the agent to quickly form a hypothesis, apply the fix, and verify, rather than exhaustive exploration. "Audit-first" applies to design tasks, not runtime bug fixing. Confidence: 0.85

- When implementing a new feature that is a variant of an existing one (e.g., "same API as trips but filtered by user"), expects the agent to immediately recognize the pattern similarity and reuse the existing implementation rather than reinventing or experimenting with alternative approaches (e.g., raw SQL workarounds). "kan simple tinggal apinya sama dengan yang trips hanya saja di filter by user" — the agent should diagnose which part (BE/FE) needs the change, then make a targeted, pattern-consistent fix. Confidence: 0.9

- When stuck in a debugging loop (repeated failed fixes on a live server), prefers stepping back to run existing e2e tests first to verify environment health and isolate the problem, rather than continuing to try ad-hoc fixes against the running server. "Pelan-pelan mungkin bisa coba mulai dari run e2e testnya" — slow down, use tests as the systematic starting point. Confidence: 0.8

- Shares full curl commands (copied from browser DevTools / mobile webview network tab) to help the agent reproduce and debug API issues — expects the agent to run them directly rather than asking for simplified reproduction steps. Confidence: 0.75

- When repeatedly restarting backend processes, the agent must verify port is actually free (confirm no stale process owns it) before starting a new one — EADDRINUSE from zombie processes causes confusing false negatives where old code handles requests while new code appears to fail. Agent should use `lsof -i :PORT` after killing to confirm PID ownership. Confidence: 0.8

- Prefers full-stack feature ownership — when implementing a feature, the agent must fix ALL necessary layers (mobile UI, mobile hooks, backend services, shared packages, tests) proactively, not just the layer mentioned in the request. The user explicitly expects "perbaiki semua sisi yang diperlukan entah dari mobile ataupun be" (fix all necessary sides whether mobile or backend). The agent should autonomously diagnose which layers need changes across the entire stack. Confidence: 0.85

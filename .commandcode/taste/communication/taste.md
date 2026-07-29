- Delegates task prioritization to the agent — prefers open-ended prompts like "lanjutkan saja yang menurutmu paling tepat" (just continue with what you think is most appropriate) or simply "continue" to signal trust in the agent's judgment to autonomously decide the next priority, rather than micromanaging step-by-step direction. Confidence: 0.85

- Reports bugs with systemic scope signals ("kemungkinan pada semua ts file" / "possibly in all ts files") and expects the agent to autonomously diagnose and fix across the entire codebase, not just in isolated files — trusts the agent to determine the full blast radius without being guided file-by-file. Confidence: 0.8

- Provides verbose diagnostic context when reporting bugs — copies full error text verbatim (including error codes like "Error 400: redirect_uri_mismatch") along with cloud service configuration details (Google Cloud Console authorized URIs, client ID settings) so the agent can cross-reference and diagnose configuration mismatches. Confidence: 0.65

- Expects honest status updates when the agent is stuck — will directly ask "ada kendala apa?" (what's the obstacle?) if progress stalls. Prefers the agent to transparently report blockers and pivot strategies quickly rather than continuing to debug the same approach unproductively. Confidence: 0.8

- When reporting API/backend integration issues, provides the exact `curl` command with full HTTP headers (auth token, content-type, origin, user-agent) and payload as reproduction evidence — expects the agent to treat this as the definitive reference for the request format and cross-reference it against the backend schema/validation expectations (e.g., Zod schemas) rather than guessing the API contract or asking for more details. Confidence: 0.7

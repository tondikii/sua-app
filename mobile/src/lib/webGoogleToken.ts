const WEB_GOOGLE_TOKEN_KEY = 'ap_google_web_id_token';

/**
 * Persist the Google web OAuth `id_token` from the URL hash into sessionStorage
 * as early as possible — at the root layout module scope, BEFORE any
 * client-side route redirect can rewrite the URL and drop the hash. Without
 * this, the redirect from `/` to `/(auth)/sign-in` (which Expo Router performs
 * via history.replaceState) would lose `#id_token=...` and sign-in would stall.
 */
export function captureWebGoogleToken(): void {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash;
  if (!hash) return;
  const params = new URLSearchParams(hash.slice(1));
  const token = params.get('id_token');
  if (token) {
    try {
      window.sessionStorage.setItem(WEB_GOOGLE_TOKEN_KEY, token);
    } catch {
      // sessionStorage unavailable (private mode) — the hash fallback in
      // useGoogleAuth still handles it if the hash survives the redirect.
    }
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

/** Read (and clear) the stashed Google web id_token, if any. */
export function consumeWebGoogleToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.sessionStorage.getItem(WEB_GOOGLE_TOKEN_KEY);
    if (stored) {
      window.sessionStorage.removeItem(WEB_GOOGLE_TOKEN_KEY);
      return stored;
    }
  } catch {
    // sessionStorage unavailable.
  }
  return null;
}

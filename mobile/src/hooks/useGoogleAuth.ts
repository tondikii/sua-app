import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
  type User as GoogleUser,
} from '@react-native-google-signin/google-signin';
import { consumeWebGoogleToken } from '@/lib/webGoogleToken';

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

/**
 * Read the Google web OAuth id_token. It is stashed in sessionStorage by
 * `captureWebGoogleToken()` (called at the root layout, before any route
 * redirect drops the URL hash). If that's unavailable, fall back to reading
 * the hash directly. See src/lib/webGoogleToken.ts.
 */
const pendingWebIdToken: string | null = (() => {
  const stored = consumeWebGoogleToken();
  if (stored) return stored;
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (!hash) return null;
  const params = new URLSearchParams(hash.slice(1));
  const token = params.get('id_token');
  if (token) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  return token;
})();

/**
 * Google Sign-In.
 *
 * Native (Android/iOS): uses @react-native-google-signin/google-signin. The SDK
 * resolves the correct client ID from the app's package name / iOS URL scheme
 * (configured in app.json) — no manual redirect URI, so the browser
 * "invalid_request / Akses diblokir" errors do not apply. `webClientId` lets
 * the SDK return an id_token that the backend validates.
 *
 * Web: redirect-based implicit flow (`response_type=id_token`). Google
 * redirects back to `redirect_uri` with the id_token in the URL hash. The
 * `redirect_uri` MUST be registered as an Authorized redirect URI in Google
 * Cloud (for local dev this is `http://localhost:8081`, already registered).
 * For the production web origin (e.g. pages.dev) add that origin to the
 * Authorized redirect URIs too — see issues.md / README deployment notes.
 */
export function useGoogleAuth() {
  const [idToken, setIdToken] = useState<string | null>(pendingWebIdToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<GoogleUser | null>(null);

  const promptAsync = useCallback(async () => {
    if (Platform.OS === 'web') {
      const redirectUri = process.env.EXPO_PUBLIC_WEB_ORIGIN ?? window.location.origin;
      const nonce = Math.random().toString(36).slice(2);
      window.location.href =
        `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${encodeURIComponent(webClientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=id_token` +
        `&scope=${encodeURIComponent('openid profile email')}` +
        `&nonce=${encodeURIComponent(nonce)}`;
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      await GoogleSignin.hasPlayServices();
      const res = await GoogleSignin.signIn();
      const token = res.data?.idToken ?? null;
      setUser(res.data ?? null);
      setIdToken(token);
      return token;
    } catch (err: any) {
      if (err?.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled — not an error worth surfacing.
        return null;
      }
      if (err?.code === statusCodes.IN_PROGRESS) {
        setError(new Error('Sign-in sudah berjalan. Tunggu sebentar.'));
      } else if (err?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError(new Error('Google Play Services tidak tersedia di perangkat ini.'));
      } else {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { promptAsync, loading, error, user, idToken, configured: !!webClientId };
}

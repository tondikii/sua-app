import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { useAuthRequest } from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const clientId = (() => {
  const isExpoGo = Constants.appOwnership === 'expo';

  if (isExpoGo || Platform.OS === 'web') {
    return process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
  }
  if (Platform.OS === 'ios') {
    return process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
  }
  return process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
})();

const redirectUri = Platform.OS === 'web'
  ? (process.env.EXPO_PUBLIC_WEB_ORIGIN ?? window.location.origin)
  : makeRedirectUri({ scheme: 'aturperjalanan' });

/**
 * Capture the id_token from the URL hash at MODULE LOAD TIME — before Expo
 * Router calls history.pushState/replaceState (which strips the hash).
 */
const pendingWebIdToken: string | null = (() => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (!hash) return null;
  const params = new URLSearchParams(hash.slice(1));
  const token = params.get('id_token');
  if (token) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  return token;
})();

function buildGoogleAuthUrl(): string {
  const nonce = Math.random().toString(36).slice(2);
  return (
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=id_token` +
    `&scope=${encodeURIComponent('openid profile email')}` +
    `&nonce=${encodeURIComponent(nonce)}`
  );
}

/** Native implementation using expo-auth-session. */
function useNativeAuth() {
  const [request, response, promptAsync] = useAuthRequest({
    clientId,
    scopes: ['profile', 'email'],
    redirectUri,
  });

  const idToken = response?.type === 'success' ? (response.authentication?.idToken ?? null) : null;
  const error = response?.type === 'error' ? response.error : null;

  return { promptAsync, loading: !request, idToken, error };
}

/**
 * Web implementation — redirect-based flow.
 *
 * The `id_token` is captured at module load time (pendingWebIdToken) before
 * Expo Router strips the hash. On first render the state is initialised from
 * that captured value. When `promptAsync` is called the page redirects to
 * Google's OAuth endpoint.
 */
function useWebAuth() {
  const [idToken] = useState<string | null>(pendingWebIdToken);
  const [error] = useState<Error | null>(null);

  const promptAsync = useCallback(async () => {
    window.location.href = buildGoogleAuthUrl();
  }, []);

  return { promptAsync, loading: false, idToken, error };
}

export function useGoogleAuth() {
  const native = useNativeAuth();
  const web = useWebAuth();

  const isWeb = Platform.OS === 'web';
  const auth = isWeb ? web : native;

  return {
    ...auth,
    configured: !!clientId,
  };
}

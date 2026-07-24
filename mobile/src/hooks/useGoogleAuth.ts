import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const clientId = (() => {
  // Expo Go uses web-based auth flow — always use Web client ID.
  // Standalone builds (EAS) use platform-specific client IDs.
  const isExpoGo = Constants.appOwnership === 'expo';

  if (isExpoGo || Platform.OS === 'web') {
    return process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
  }
  if (Platform.OS === 'ios') {
    return process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
  }
  // Android standalone
  return process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
})();

const redirectUri = Platform.OS === 'web'
  ? (process.env.EXPO_PUBLIC_WEB_ORIGIN ?? window.location.origin)
  : makeRedirectUri({ scheme: 'aturperjalanan' });

export function useGoogleAuth() {
  const [request, response, promptAsync] = useAuthRequest({
    clientId,
    scopes: ['profile', 'email'],
    redirectUri,
  });

  const idToken = response?.type === 'success' ? (response.authentication?.idToken ?? null) : null;

  return {
    promptAsync,
    loading: !request,
    idToken,
    configured: !!clientId,
  };
}

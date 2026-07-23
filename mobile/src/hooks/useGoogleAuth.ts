import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const clientId = (() => {
  if (Platform.OS === 'web') return process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
  if (Platform.OS === 'ios') return process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';
  return process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '';
})();

export function useGoogleAuth() {
  const [request, response, promptAsync] = useAuthRequest({
    clientId,
    scopes: ['profile', 'email'],
    redirectUri: makeRedirectUri({ scheme: 'aturperjalanan' }),
  });

  const idToken = response?.type === 'success' ? (response.authentication?.idToken ?? null) : null;

  return {
    promptAsync,
    loading: !request,
    idToken,
    configured: !!clientId,
  };
}

import * as SecureStore from 'expo-secure-store';

import type { TokenStorage } from './tokenStorage.types';

const ACCESS_KEY = 'ap_access_token';
const REALTIME_KEY = 'ap_realtime_token';

/**
 * Native implementation — backed by iOS Keychain / Android Keystore via
 * `expo-secure-store`. Tokens are encrypted at rest; never AsyncStorage/MMKV.
 */
export const secureStorage: TokenStorage = {
  getAccessToken: () => SecureStore.getItemAsync(ACCESS_KEY),
  setAccessToken: (token) => SecureStore.setItemAsync(ACCESS_KEY, token),
  removeAccessToken: () => SecureStore.deleteItemAsync(ACCESS_KEY),
  getRealtimeToken: () => SecureStore.getItemAsync(REALTIME_KEY),
  setRealtimeToken: (token) => SecureStore.setItemAsync(REALTIME_KEY, token),
  removeRealtimeToken: () => SecureStore.deleteItemAsync(REALTIME_KEY),
};

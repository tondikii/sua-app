import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'ap_access_token';
const REALTIME_KEY = 'ap_realtime_token';

export const secureStorage = {
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
  async getRealtimeToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REALTIME_KEY);
  },
  async setRealtimeToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(REALTIME_KEY, token);
  },
};

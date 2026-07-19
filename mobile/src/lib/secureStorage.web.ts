import type { TokenStorage } from './tokenStorage.types';

const ACCESS_KEY = 'ap_access_token';
const REALTIME_KEY = 'ap_realtime_token';

const store: Storage | undefined =
  typeof sessionStorage !== 'undefined' ? sessionStorage : undefined;

// In-memory cache (primary) so a same-tab restore is instant and survives
// React hot-reload; sessionStorage mirrors it so a refresh within the tab
// restores the session. Both clear on tab close.
const memory = new Map<string, string>();

function get(key: string): string | null {
  const cached = memory.get(key);
  if (cached != null) return cached;
  const persisted = store?.getItem(key) ?? null;
  if (persisted != null) memory.set(key, persisted);
  return persisted;
}

function set(key: string, value: string): void {
  memory.set(key, value);
  store?.setItem(key, value);
}

function remove(key: string): void {
  memory.delete(key);
  store?.removeItem(key);
}

/** Web implementation — no keystore available; see tokenStorage.types.ts. */
export const secureStorage: TokenStorage = {
  getAccessToken: async () => get(ACCESS_KEY),
  setAccessToken: async (token) => set(ACCESS_KEY, token),
  removeAccessToken: async () => remove(ACCESS_KEY),
  getRealtimeToken: async () => get(REALTIME_KEY),
  setRealtimeToken: async (token) => set(REALTIME_KEY, token),
  removeRealtimeToken: async () => remove(REALTIME_KEY),
};

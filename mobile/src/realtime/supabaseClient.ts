import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Supabase client used ONLY for Realtime subscriptions. All REST calls go
 * through `apiClient` (→ NestJS). Auth is managed by NestJS, so Supabase auth
 * is fully disabled; the Realtime WebSocket is authenticated per-session via
 * `setRealtimeAuthToken()` using the backend-minted Supabase-compatible JWT.
 *
 * The client is created only when both env values are present, so a dev
 * environment without Supabase configured still boots cleanly (subscriptions
 * simply no-op until M14 + real keys). See ARCHITECTURE.md §6.
 */
let _client: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  _client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    realtime: {
      params: { eventsPerSecond: 10 },
    },
  });
}

export const supabase: SupabaseClient | null = _client;

/** Push the backend-minted realtime JWT so RLS `auth.uid()` resolves. */
export function setRealtimeAuthToken(token: string): void {
  if (!_client) return;
  // `setAuth('')` clears the previous JWT on logout; early-return on empty
  // would leave the stale token on the websocket (bug on signOut).
  _client.realtime.setAuth(token ?? '');
}

/** Remove all realtime channels — call on logout to drop stale subscriptions immediately. */
export function disconnectRealtime(): void {
  if (!_client) return;
  try {
    _client.removeAllChannels();
  } catch {}
}

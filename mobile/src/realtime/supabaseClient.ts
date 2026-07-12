import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// This client is used ONLY for Realtime subscriptions.
// All REST API calls go through apiClient (→ NestJS backend).
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // We manage auth via NestJS — disable Supabase auth
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export function setRealtimeAuthToken(token: string) {
  supabase.realtime.setAuth(token);
}

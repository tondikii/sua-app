/**
 * Platform-agnostic auth-token storage contract.
 *
 * Native → `expo-secure-store` (Keychain / Keystore) — secure at rest.
 * Web → in-memory + `sessionStorage` (browsers have no keystore); the realtime
 *       token is JS-readable anyway (Supabase), so the access token follows the
 *       same posture. See ARCHITECTURE.md §5 (web target) for the rationale.
 *
 * Resolved by Metro via file extension: `secureStorage.native.ts` on native,
 * `secureStorage.web.ts` on web. Import the bare path:
 *   import { secureStorage } from '@/lib/secureStorage';
 */
export interface TokenStorage {
  getAccessToken(): Promise<string | null>;
  setAccessToken(token: string): Promise<void>;
  removeAccessToken(): Promise<void>;

  getRealtimeToken(): Promise<string | null>;
  setRealtimeToken(token: string): Promise<void>;
  removeRealtimeToken(): Promise<void>;
}

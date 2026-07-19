import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { AuthResponse, UserProfile } from '@atur-perjalanan/shared-types';

import { apiClient, setOnUnauthorized, setTokenGetter } from '../api/client';
import { secureStorage } from '../lib/secureStorage';
import { setRealtimeAuthToken } from '../realtime/supabaseClient';

interface AuthContextValue {
  user: UserProfile | null;
  accessToken: string | null;
  realtimeToken: string | null;
  /** True once we've finished reading secure storage on cold start. */
  isHydrated: boolean;
  /** True when the user has authenticated but not yet set a username. */
  isNewUser: boolean;
  isAuthenticated: boolean;
  /** Exchange a Google ID token for app + realtime JWTs. */
  signInGoogle: (idToken: string) => Promise<{ isNewUser: boolean }>;
  /** Set the username for a new user; resolves the fresh profile. */
  completeRegistration: (username: string) => Promise<UserProfile>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [realtimeToken, setRealtimeToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Synchronous token mirror so the API client never awaits storage per request.
  const tokenRef = useRef<string | null>(null);
  // Latest signOut, reachable from the module-level 401 handler.
  const signOutRef = useRef<() => void>(() => {});

  const clearAuth = useCallback(async () => {
    tokenRef.current = null;
    await secureStorage.removeAccessToken();
    await secureStorage.removeRealtimeToken();
    setRealtimeAuthToken('');
    setUser(null);
    setAccessToken(null);
    setRealtimeToken(null);
    setIsNewUser(false);
  }, []);

  const signOut = useCallback(async () => {
    await clearAuth();
  }, [clearAuth]);

  useEffect(() => {
    signOutRef.current = signOut;
  }, [signOut]);

  // Wire the API client once: token source + 401 → sign out.
  useEffect(() => {
    setTokenGetter(() => tokenRef.current);
    setOnUnauthorized(() => {
      void signOutRef.current();
    });
  }, []);

  // Hydrate session from secure storage on cold start.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await secureStorage.getAccessToken();
      const rt = await secureStorage.getRealtimeToken();
      if (cancelled) return;

      if (token) {
        tokenRef.current = token;
        setAccessToken(token);
        if (rt) {
          setRealtimeToken(rt);
          setRealtimeAuthToken(rt);
        }
        try {
          const me = await apiClient.get<UserProfile>('/users/me');
          if (!cancelled) setUser(me);
        } catch {
          // Stored token is invalid/expired — drop it and start clean.
          if (!cancelled) await clearAuth();
        }
      }
      if (!cancelled) setIsHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [clearAuth]);

  const signInGoogle = useCallback(
    async (idToken: string) => {
      const res = await apiClient.post<AuthResponse>('/auth/google', { id_token: idToken }, false);
      tokenRef.current = res.access_token;
      await secureStorage.setAccessToken(res.access_token);
      if (res.realtime_token) {
        await secureStorage.setRealtimeToken(res.realtime_token);
        setRealtimeAuthToken(res.realtime_token);
      }
      setAccessToken(res.access_token);
      setRealtimeToken(res.realtime_token || null);
      setIsNewUser(res.is_new_user);

      if (!res.is_new_user) {
        setUser(res.user ?? (await apiClient.get<UserProfile>('/users/me')));
      }
      return { isNewUser: res.is_new_user };
    },
    [],
  );

  const completeRegistration = useCallback(async (username: string) => {
    const { user: me } = await apiClient.post<{ user: UserProfile }>(
      '/auth/complete-registration',
      { username },
    );
    setUser(me);
    setIsNewUser(false);
    return me;
  }, []);

  const value: AuthContextValue = {
    user,
    accessToken,
    realtimeToken,
    isHydrated,
    isNewUser,
    isAuthenticated: !!accessToken,
    signInGoogle,
    completeRegistration,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { AuthResponse, UserProfile } from '@atur-perjalanan/shared-types';

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { apiClient, setOnUnauthorized, setTokenGetter } from '../api/client';
import { secureStorage } from '../lib/secureStorage';
import { disconnectRealtime, setRealtimeAuthToken } from '../realtime/supabaseClient';
import { queryClient } from '../api/queryClient';

interface AuthContextValue {
  user: UserProfile | null;
  accessToken: string | null;
  realtimeToken: string | null;
  /** True once we've finished reading secure storage on cold start. */
  isHydrated: boolean;
  /** True when the user has authenticated but not yet set a username. */
  isNewUser: boolean;
  isAuthenticated: boolean;
  /** True while a sign-out is in flight (state not yet committed). */
  isSigningOut: boolean;
  /** Exchange a Google ID token for app + realtime JWTs. */
  signInGoogle: (idToken: string) => Promise<{ isNewUser: boolean }>;
  /** Set the username for a new user; resolves the fresh profile. */
  completeRegistration: (username: string) => Promise<UserProfile>;
  /** Replace the in-memory user profile (used after profile/avatar updates). */
  setUser: (user: UserProfile | null) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [realtimeToken, setRealtimeToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Synchronous token mirror so the API client never awaits storage per request.
  const tokenRef = useRef<string | null>(null);
  // Latest signOut, reachable from the module-level 401 handler.
  const signOutRef = useRef<() => void>(() => {});

  const clearAuth = useCallback(async () => {
    tokenRef.current = null;
    await secureStorage.removeAccessToken();
    await secureStorage.removeRealtimeToken();
    // Drop realtime auth *and* all subscribed channels before clearing state,
    // otherwise the websocket keeps the old JWT and keeps receiving the previous
    // user's notifications/chat events after logout.
    disconnectRealtime();
    setRealtimeAuthToken('');
    setUser(null);
    setAccessToken(null);
    setRealtimeToken(null);
    setIsNewUser(false);
    // Clear the persisted query cache so no stale user data (trips, profile,
    // wishlist) leaks into the next session after signing out.
    queryClient.clear();
    // Remove the persisted query cache from AsyncStorage as well.
    try {
      await AsyncStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
    } catch {}
    // Clear Google Sign-In cache so next login shows account picker.
    try {
      if (Platform.OS !== 'web') {
        const hasPrev = await GoogleSignin.hasPreviousSignIn();
        if (hasPrev) await GoogleSignin.signOut();
        try { await GoogleSignin.revokeAccess(); } catch {}
      } else if (typeof window !== 'undefined') {
        // Web: clear any gsi/one-tap state and google session hint.
        try { window.sessionStorage.removeItem('ap_google_web_id_token'); } catch {}
        try { window.localStorage.removeItem('g_state'); } catch {}
      }
    } catch {}
  }, []);

  const signOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await clearAuth();
    } finally {
      setIsSigningOut(false);
    }
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

  const signInGoogle = useCallback(async (idToken: string) => {
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
  }, []);

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
    isSigningOut,
    signInGoogle,
    completeRegistration,
    setUser,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

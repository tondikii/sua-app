import { useEffect, type ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Redirect, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '../src/api/queryClient';
import { MOBILE_MAX_WIDTH } from '../src/theme/layout';
import { AuthProvider, useAuth } from '../src/auth/AuthProvider';
import { ToastProvider } from '../src/components/Toast';
import { useNotificationsSubscription } from '../src/realtime/useNotificationsSubscription';
import { usePushNotifications } from '../src/features/notifications/push/usePushNotifications';
import { captureWebGoogleToken } from '../src/lib/webGoogleToken';

// Capture the Google web OAuth id_token from the URL hash at the earliest
// possible moment — before index.tsx's client-side redirect to /(auth)/sign-in
// rewrites the URL and drops the hash. See src/lib/webGoogleToken.ts.
captureWebGoogleToken();

const persister = createAsyncStoragePersister({ storage: AsyncStorage });

/** On web, centres the app at mobile width inside a dark backdrop. */
function MobileContainer({ children, backdropColor }: { children: ReactNode; backdropColor?: string }) {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <View style={[styles.webBackdrop, { backgroundColor: backdropColor ?? '#1A1A2E' }]}>
      <View style={styles.webFrame}>{children}</View>
    </View>
  );
}

/** Shows the branded splash until fonts are ready AND the session has hydrated. */
function RootGate({ children }: { children: ReactNode }) {
  const { isHydrated, isAuthenticated, user } = useAuth();
  const pathname = usePathname();

  // Subscribe to real-time notifications when authenticated
  useNotificationsSubscription(user?.id);
  // Register the device for push notifications (native only)
  usePushNotifications(user?.id);

  if (!isHydrated) return null;

  // Auth guard at the ROOT level — covers screens outside `(tabs)` (settings,
  // notifications, profile, trip) that the tabs layout guard can't reach.
  // `(auth)` routes are exempt so sign-in/onboarding stay reachable.
  const isAuthRoute = pathname.startsWith('/(auth)') || pathname === '/sign-in' || pathname === '/onboarding';
  if (!isAuthenticated && !isAuthRoute) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <MobileContainer backdropColor="#1A1A2E">
      {children}
    </MobileContainer>
  );
}

const styles = StyleSheet.create({
  webBackdrop: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webFrame: {
    width: '100%',
    height: '100%',
    maxWidth: MOBILE_MAX_WIDTH,
    overflow: 'hidden',
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const fontsReady = fontsLoaded || !!fontError;

  // Configure native Google Sign-In once (Android uses webClientId to mint the
  // id_token the backend validates; iOS uses the url scheme from app.json).
  useEffect(() => {
    if (Platform.OS === 'web') return;
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, buster: 'm11' }}>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          {fontsReady && (
            <RootGate>
              <ToastProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="trip" />
                <Stack.Screen name="notifications" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="profile" />
                <Stack.Screen
                  name="trip/create"
                  options={{ presentation: 'modal' }}
                />
              </Stack>
            </ToastProvider>
            </RootGate>
          )}
        </SafeAreaProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}

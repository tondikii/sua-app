import { useEffect, type ReactNode } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ExpoSplashScreen from 'expo-splash-screen';
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
import { AuthProvider, useAuth } from '../src/auth/AuthProvider';
import { SplashScreen } from '../src/components/SplashScreen';

ExpoSplashScreen.preventAutoHideAsync();

const persister = createAsyncStoragePersister({ storage: AsyncStorage });

/** Shows the branded splash until fonts are ready AND the session has hydrated. */
function RootGate({ children }: { children: ReactNode }) {
  const { isHydrated } = useAuth();

  // Fonts are ready by the time RootGate mounts — reveal RN content immediately,
  // then swap to the real app once the session has hydrated.
  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  if (!isHydrated) return <SplashScreen />;
  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const fontsReady = fontsLoaded || !!fontError;

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, buster: 'm11' }}
    >
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          {fontsReady && (
            <RootGate>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="trip" />
              </Stack>
            </RootGate>
          )}
        </SafeAreaProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}

import { useEffect, type ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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

/** On web, centres the app at mobile width inside a dark backdrop. */
function MobileContainer({ children }: { children: ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <View style={styles.webBackdrop}>
      <View style={styles.webFrame}>{children}</View>
    </View>
  );
}

/** Shows the branded splash until fonts are ready AND the session has hydrated. */
function RootGate({ children }: { children: ReactNode }) {
  const { isHydrated } = useAuth();

  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  if (!isHydrated) return <SplashScreen />;
  return <MobileContainer>{children}</MobileContainer>;
}

const MAX_WIDTH = 430;

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
    maxWidth: MAX_WIDTH,
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

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, buster: 'm11' }}>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          {fontsReady && (
            <RootGate>
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
            </RootGate>
          )}
        </SafeAreaProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}

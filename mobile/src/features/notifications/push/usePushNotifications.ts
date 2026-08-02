import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { apiClient } from '@/api/client';
import { registerForPushNotificationsAsync } from './registerForPushNotificationsAsync';
import type { PushTokenPlatform } from '@atur-perjalanan/shared-types';

/**
 * Registers the device's Expo push token with the backend while a user is
 * signed in, unregisters it on sign-out, and deep-links the user to the trip
 * when a notification is tapped (cold start or foreground response).
 *
 * Mounted once at the app root (`RootGate`), alongside the realtime
 * notifications subscription. Web is a no-op.
 */
export function usePushNotifications(userId: string | undefined) {
  const router = useRouter();
  const lastTokenRef = useRef<string | null>(null);

  // Navigate to the trip referenced by a tapped notification.
  const handleNotificationData = (data?: Record<string, unknown>) => {
    const tripId = data?.trip_id;
    if (typeof tripId === 'string') {
      router.push(`/trip/${tripId}`);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        handleNotificationData(response.notification.request.content.data as Record<string, unknown>);
      },
    );

    // Cold start: a notification response from a terminated app.
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNotificationData(response.notification.request.content.data as Record<string, unknown>);
      }
    });

    return () => {
      responseListener.remove();
    };
  }, [router]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    if (!userId) {
      // Signed out — drop any previously-registered token.
      const token = lastTokenRef.current;
      if (token) {
        apiClient.delete(`/push-tokens/${encodeURIComponent(token)}`).catch(() => {});
        lastTokenRef.current = null;
      }
      return;
    }

    let cancelled = false;
    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (cancelled || !token) return;
      lastTokenRef.current = token;
      const platform: PushTokenPlatform = Platform.OS === 'ios' ? 'ios' : 'android';
      apiClient.post('/push-tokens', { token, platform }).catch(() => {
        // Non-fatal — in-app notifications still work without push.
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);
}

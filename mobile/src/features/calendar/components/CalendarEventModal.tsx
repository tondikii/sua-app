import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Modal } from 'react-native';
import { X } from '@/components/icons/X';
import { Calendar } from '@/components/icons/Calendar';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';
import {
  useGetCalendarAuthUrl,
  useCreateCalendarEvent,
  useCalendarStatus,
} from '@/features/calendar/hooks/useGoogleCalendar';
import { useToast } from '@/components/Toast';

interface CalendarEventModalProps {
  visible: boolean;
  tripId: string;
  /** Human-friendly date label, e.g. "15–17 Agu 2026 · Sepanjang hari". */
  dateLabel: string;
  onClose: () => void;
  onAdded: () => void;
}

/**
 * "Tambah ke Google Calendar?" modal (Screen 96). Adds the trip to the user's
 * own calendar:
 * - Already connected: creates the event directly — no Google page opens.
 * - Not connected: opens the OAuth consent once; after the callback returns,
 *   the event is created automatically and a success toast is shown.
 */
export function CalendarEventModal({
  visible,
  tripId,
  dateLabel,
  onClose,
  onAdded,
}: CalendarEventModalProps) {
  const { showToast } = useToast();
  const getAuthUrl = useGetCalendarAuthUrl();
  const getStatus = useCalendarStatus();
  const createEvent = useCreateCalendarEvent(tripId);
  const [adding, setAdding] = useState(false);

  /** Build the post-callback redirect target for this platform. */
  const buildRedirect = useCallback(() => {
    if (Platform.OS === 'web') {
      const origin =
        process.env.EXPO_PUBLIC_WEB_ORIGIN ??
        (typeof window !== 'undefined' ? window.location.origin : 'http://10.224.111.6:8081');
      return `${origin}/trip/${tripId}`;
    }
    // Native: deeplink handled by expo-router. The backend callback redirects
    // here and the app resumes; the event is then created below.
    return `aturperjalanan://trip/${tripId}`;
  }, [tripId]);

  const createEventForTrip = useCallback(async () => {
    await createEvent.mutateAsync({ trip_id: tripId });
    showToast('Ditambahkan ke Google Calendar');
    onAdded();
    onClose();
  }, [createEvent, tripId, showToast, onAdded, onClose]);

  const handleAdd = useCallback(async () => {
    if (adding) return;
    setAdding(true);
    try {
      // 1. If already connected, create directly — no Google page.
      const { connected } = await getStatus.mutateAsync();
      if (connected) {
        await createEventForTrip();
        return;
      }

      // 2. Not connected — open OAuth consent once.
      const redirect = buildRedirect();
      const { auth_url } = await getAuthUrl.mutateAsync({ redirect });

      if (Platform.OS === 'web') {
        window.location.href = auth_url;
        // After the backend callback redirects back to origin/trip/{id}, the
        // screen reloads; we create the event on mount via the pending flag.
        // For simplicity on web we create it after returning via URL param.
        setAdding(false);
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(auth_url, 'aturperjalanan://');
      // Backend already stored the token on the callback redirect; regardless
      // of the session result type, try to create the event now.
      await createEventForTrip();
      if (result.type === 'cancel' || result.type === 'dismiss') {
        showToast('Penambahan ke kalender dibatalkan');
      }
    } catch (err: any) {
      const code = err?.response?.data?.error?.code;
      if (code === 'CALENDAR_NOT_CONNECTED' || code === 'CALENDAR_TOKEN_EXPIRED') {
        showToast('Hubungkan Google Calendar dulu');
      } else {
        showToast('Tidak dapat menambahkan ke kalender');
      }
    } finally {
      setAdding(false);
    }
  }, [adding, getStatus, getAuthUrl, buildRedirect, createEventForTrip, showToast]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={13} color={colors.muted} />
          </TouchableOpacity>

          <View style={styles.iconWrap}>
            <Calendar size={24} color={colors.teal} />
          </View>

          <Text style={styles.title}>Tambah ke Google Calendar?</Text>
          <Text style={styles.description}>{dateLabel} · kalender kamu</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={adding}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, adding && styles.confirmBtnDisabled]}
              onPress={() => void handleAdd()}
              disabled={adding}
              activeOpacity={0.8}
            >
              {adding ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.confirmText}>Tambah</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26,26,46,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  card: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 22,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
    ...shadows.card,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    textAlign: 'center',
    letterSpacing: -0.2,
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  confirmBtnDisabled: { opacity: 0.7 },
  confirmText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
});

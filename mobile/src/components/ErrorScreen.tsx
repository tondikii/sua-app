import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { WifiOff } from '@/components/icons/WifiOff';
import { RefreshCw } from '@/components/icons/RefreshCw';
import { useTheme } from '@/theme';

interface ErrorScreenProps {
  /** Default: "Tidak ada koneksi" (Figma Screen 120). */
  title?: string;
  /** Default: "Periksa internetmu lalu coba lagi." */
  description?: string;
  onRetry?: () => void;
  /** Shows a spinner inside the CTA while a retry is in flight. */
  loading?: boolean;
}

/**
 * Full-screen offline/error state — Figma Screen 120.
 * Coral-tinted icon box, charcoal title, muted body, coral Coba Lagi CTA.
 */
export function ErrorScreen({
  title = 'Tidak ada koneksi',
  description = 'Periksa internetmu lalu coba lagi.',
  onRetry,
  loading = false,
}: ErrorScreenProps) {
  const { colors: c } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: c.white }]}>
      <View style={[styles.iconBox, { backgroundColor: c.coralLight }]}>
        <WifiOff size={32} color={c.coral} />
      </View>

      <Text style={[styles.title, { color: c.charcoal }]}>{title}</Text>

      <Text style={[styles.description, { color: c.muted }]}>{description}</Text>

      {onRetry && (
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: c.coral, shadowColor: c.coral }]}
          onPress={onRetry}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <RefreshCw size={16} color="#FFFFFF" />
              <Text style={styles.retryText}>Coba Lagi</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    textAlign: 'center',
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    letterSpacing: -0.4,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 260,
    marginBottom: 28,
  },
  retryBtn: {
    width: '100%',
    maxWidth: 240,
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.27,
    shadowRadius: 22,
    elevation: 6,
  },
  retryText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
});

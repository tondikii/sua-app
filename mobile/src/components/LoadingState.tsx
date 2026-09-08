import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

interface PageLoaderProps {
  message?: string;
}

/** Full-screen loader — consistent across all screens (coral, centered). */
export function PageLoader({ message = 'Memuat...' }: PageLoaderProps) {
  return (
    <View style={styles.page}>
      <ActivityIndicator size="large" color={colors.coral} />
      {message ? <Text style={styles.pageText}>{message}</Text> : null}
    </View>
  );
}

/** Inline small spinner for list refresh / item actions. */
export function InlineLoader({ color = colors.coral }: { color?: string }) {
  return <ActivityIndicator size="small" color={color} />;
}

/** Footer loader for pagination (FlatList ListFooterComponent). */
export function ListFooterLoader({ loading }: { loading: boolean }) {
  if (!loading) return null;
  return (
    <View style={styles.footer}>
      <ActivityIndicator size="small" color={colors.coral} />
      <Text style={styles.footerText}>Memuat lagi...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
    backgroundColor: colors.light,
  },
  pageText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
});

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/theme';

/**
 * Skeleton shimmer primitives — Figma Screen 118 (Skeleton Loading).
 *
 * React Native has no CSS `@keyframes`, so we animate a translateX sweep of a
 * lighter overlay block across the base track with `Animated.loop` +
 * `useNativeDriver`. Every visual knob (colors, radii) comes from theme tokens
 * to avoid magic values.
 */

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: object;
}

/** Single shimmering block (avatar circle, title bar, chip, etc.). */
export function Skeleton({ width = '100%', height = 16, radius = 8, style }: SkeletonProps) {
  const { colors: c } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 220],
  });

  return (
    <View
      style={[
        styles.skeleton,
        { width, height, borderRadius: radius, backgroundColor: c.shimmerBase },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shine,
          {
            backgroundColor: c.shimmerShine,
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}

/** Trip-card skeleton — cover block + title + tag chips + footer row. */
function TripCardSkeleton() {
  const { colors: c } = useTheme();
  return (
    <View style={[styles.tripCard, { backgroundColor: c.white }]}>
      <Skeleton height={148} radius={0} />
      <View style={styles.cardBody}>
        <Skeleton width="72%" height={15} radius={7} />
        <View style={styles.chipRow}>
          <Skeleton width={64} height={24} radius={20} />
          <Skeleton width={56} height={24} radius={20} />
        </View>
        <View style={styles.cardFooter}>
          <Skeleton width={110} height={11} radius={6} />
          <View style={styles.avatarRow}>
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} width={26} height={26} radius={13} style={j > 1 ? styles.avatarOverlap : undefined} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

/**
 * Home loading skeleton — mirrors `Screen118SkeletonLoading`:
 * bell circle, title bar, 3 tab bars, 2 trip-card skeletons, then the
 * "Memuat perjalananmu..." spinner row.
 */
export function HomeSkeleton() {
  const { colors: c } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.bellRow}>
        <Skeleton width={30} height={30} radius={15} />
      </View>
      <View style={styles.titleRow}>
        <Skeleton width={148} height={20} radius={8} />
      </View>
      <View style={[styles.tabRow, { borderBottomColor: c.border }]}>
        <Skeleton width={78} height={13} radius={6} />
        <Skeleton width={52} height={13} radius={6} />
        <Skeleton width={68} height={13} radius={6} />
      </View>
      <TripCardSkeleton />
      <TripCardSkeleton />
      <View style={styles.loadingRow}>
        <ActivityIndicator size="small" color={c.coral} />
        <Text style={[styles.loadingText, { color: c.muted }]}>Memuat perjalananmu...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
    position: 'relative',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.55,
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
  },
  bellRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 4,
  },
  titleRow: {
    paddingTop: 14,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    alignItems: 'center',
  },
  tripCard: {
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardBody: {
    padding: 14,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarOverlap: {
    marginLeft: -9,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 20,
  },
  loadingText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});

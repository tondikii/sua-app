import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthProvider';
import { TripMembersContent } from '@/features/trips/components/TripMembersContent';
import { useTripDetail } from '@/features/trips/hooks/useTripDetail';
import { goBackSmart } from '@/lib/navigation';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { PageLoader } from '@/components/LoadingState';
import { ErrorScreen } from '@/components/ErrorScreen';
import { colors } from '@/theme/colors';

export default function TripMembersScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: trip, isLoading, isError, refetch } = useTripDetail(tripId);

  const isCreator = trip?.creator?.id === user?.id;

  if (isLoading) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <PageLoader message="Memuat anggota..." />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ErrorScreen onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header (NavHeader — Screen 97) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBackSmart(router)} style={styles.headerBtn}>
          <ChevronLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Anggota Perjalanan</Text>
        <View style={styles.headerBtn} />
      </View>

      <TripMembersContent
        tripId={tripId}
        isCreator={isCreator}
        currentUserId={user?.id ?? ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    textAlign: 'center',
  },
});

import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthProvider';
import { useUserTrips } from '@/features/users/hooks/useUserTrips';
import { EmptyTripsState } from '@/features/home/components/EmptyTripsState';
import { ErrorScreen } from '@/components/ErrorScreen';
import { openExternalLink } from '@/lib/externalLink';
import { Settings } from '@/components/icons/Settings';
import { Globe } from '@/components/icons/Globe';
import { Calendar } from '@/components/icons/Calendar';
import { formatDateRange } from '@/features/trips/components/TripDateUtils';
import { colors, avatarColorFor } from '@/theme/colors';
import { shadows } from '@/theme/shadows';
import type { TripSummary } from '@atur-perjalanan/shared-types';

const GRID_GAP = 12;
const GRID_COLUMNS = 2;

function ProfileTripGridCard({ trip, onPress, cardWidth }: { trip: TripSummary; onPress: () => void; cardWidth: number }) {
  const dateRange = formatDateRange(
    trip.start_date,
    trip.end_date,
    trip.is_all_day,
    trip.start_time,
    trip.end_time,
    trip.status,
  );

  return (
    <TouchableOpacity style={[styles.gridCard, { width: cardWidth }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.gridCardImage}>
        {trip.cover_image_url ? (
          <Image source={{ uri: trip.cover_image_url }} style={styles.gridCardImg} />
        ) : (
          <View style={styles.gridCardPlaceholder} />
        )}
        {trip.tags && trip.tags.length > 0 && (
          <View style={styles.gridTagsOverlay}>
            {trip.tags.slice(0, 2).map((tag, i) => (
              <View key={i} style={styles.gridTagChip}>
                <Text style={styles.gridTagText}>{tag.startsWith('#') ? tag : `#${tag}`}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.gridCardBody}>
        <Text style={styles.gridCardTitle} numberOfLines={1}>{trip.name}</Text>
        <View style={styles.gridCardDateRow}>
          <Calendar size={11} color={colors.muted} />
          <Text style={styles.gridCardDate} numberOfLines={1}>{dateRange}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { width: screenWidth } = useWindowDimensions();
  const {
    data: tripsData,
    isLoading: tripsLoading,
    isError: tripsError,
    refetch: refetchTrips,
  } = useUserTrips(user?.username ?? '');
  const trips = tripsData?.data ?? [];
  const gridCardWidth = (Math.min(screenWidth, 430) - 22 * 2 - GRID_GAP) / GRID_COLUMNS;

  const handleCreateTrip = useCallback(() => {
    router.push('/trip/create');
  }, [router]);

  const handleSettings = useCallback(() => {
    router.push('/settings');
  }, [router]);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>{user?.username ?? 'Profil'}</Text>
        <TouchableOpacity onPress={handleSettings} style={styles.settingsBtn} activeOpacity={0.7}>
          <Settings size={18} color={colors.charcoal} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.profileCardBody}>
            <View style={styles.avatar}>
              {user?.avatar_url ? (
                <Image source={{ uri: user.avatar_url }} style={styles.avatarImg} />
              ) : (
                <View style={[styles.avatarFallback, { backgroundColor: avatarColorFor(user?.username ?? 'x') }]}>
                  <Text style={styles.avatarLetter}>{(user?.name ?? '?').charAt(0).toUpperCase()}</Text>
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name ?? ''}</Text>
              {user?.bio && <Text style={styles.profileBio}>{user.bio}</Text>}
              {user?.website_url && (
                <TouchableOpacity
                  style={styles.websiteRow}
                  onPress={() => openExternalLink(user.website_url!)}
                  activeOpacity={0.7}
                >
                  <Globe size={11} color={colors.teal} />
                  <Text style={styles.profileWebsite} numberOfLines={1}>{user.website_url}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Stats bar inside the card */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trips.length}</Text>
              <Text style={styles.statLabel}>Perjalanan</Text>
            </View>
          </View>
        </View>

        {/* Trips */}
        <Text style={styles.sectionTitle}>Perjalanan</Text>
        {tripsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.coral} />
          </View>
        ) : tripsError ? (
          <ErrorScreen onRetry={() => void refetchTrips()} />
        ) : trips.length === 0 ? (
          <EmptyTripsState
            title="Belum ada perjalanan"
            description="Mulai rencanakan liburan pertamamu bersama teman-teman."
            onPressCta={handleCreateTrip}
            compact
          />
        ) : (
          <View style={styles.tripGrid}>
            {trips.map((trip) => (
              <ProfileTripGridCard
                key={trip.id}
                trip={trip}
                cardWidth={gridCardWidth}
                onPress={() => router.push(`/trip/${trip.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.light },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingTop: 12, paddingBottom: 14 },
  headerSpacer: { width: 40 },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, textAlign: 'center', letterSpacing: -0.3 },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  content: { padding: 22, paddingBottom: 112 },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 16,
    paddingBottom: 14,
    marginBottom: 24,
    ...shadows.card,
  },
  profileCardBody: { flexDirection: 'row', gap: 14, marginBottom: 11 },
  avatar: { width: 64, height: 64, borderRadius: 20, overflow: 'hidden', shadowColor: '#FF6B6B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 6 },
  avatarImg: { width: '100%', height: '100%', borderRadius: 20 },
  avatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  avatarLetter: { fontSize: 24, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  profileInfo: { flex: 1, justifyContent: 'center' },
  profileName: { fontSize: 16, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, letterSpacing: -0.3, marginBottom: 4 },
  profileBio: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal, lineHeight: 17.4, marginBottom: 5 },
  websiteRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  profileWebsite: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.teal },
  statsBar: {
    backgroundColor: colors.light,
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, letterSpacing: -0.4 },
  statLabel: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.muted, marginTop: 3 },
  sectionTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal, marginBottom: 12 },
  tripGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP },
  gridCard: {
    borderRadius: 16,
    backgroundColor: colors.white,
    overflow: 'hidden',
    ...shadows.cardCompact,
  },
  gridCardImage: { height: 96, backgroundColor: '#D8D4CC', position: 'relative' },
  gridCardImg: { width: '100%', height: '100%' },
  gridCardPlaceholder: { width: '100%', height: '100%', backgroundColor: '#D8D4CC' },
  gridTagsOverlay: { position: 'absolute', top: 8, left: 8, right: 8, flexDirection: 'row', gap: 4 },
  gridTagChip: { backgroundColor: colors.tealLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20 },
  gridTagText: { fontSize: 8, fontFamily: 'PlusJakartaSans_700Bold', color: colors.teal },
  gridCardBody: { padding: 9, paddingHorizontal: 10, paddingBottom: 10 },
  gridCardTitle: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal, lineHeight: 15.6 },
  gridCardDateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  gridCardDate: { flex: 1, fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted, lineHeight: 13 },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
});

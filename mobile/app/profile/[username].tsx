import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePublicProfile } from '@/features/users/hooks/usePublicProfile';
import { useUserTrips } from '@/features/users/hooks/useUserTrips';
import { goBackSmart } from '@/lib/navigation';
import { openExternalLink } from '@/lib/externalLink';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { Globe } from '@/components/icons/Globe';
import { TripCard } from '@/features/trips/components/TripCard';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { avatarColorFor } from '@/theme/colors';
import type { TripSummary } from '@atur-perjalanan/shared-types';

export default function PublicProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: profile, isLoading: profileLoading } = usePublicProfile(username);
  const { data: tripsData, isLoading: tripsLoading } = useUserTrips(username);
  const trips = tripsData?.data ?? [];
  const isLoading = profileLoading || tripsLoading;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBackSmart(router)} style={styles.headerBtn}>
          <ChevronLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>@{username}</Text>
        <View style={styles.headerBtn} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.coral} /></View>
      ) : !profile ? (
        <View style={styles.loadingContainer}><Text style={{ color: colors.muted }}>Profil tidak ditemukan</Text></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              {profile.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.profileAvatarImg} />
              ) : (
                <View style={[styles.profileAvatarFallback, { backgroundColor: avatarColorFor(profile.username) }]}>
                  <Text style={styles.profileAvatarLetter}>{profile.name.charAt(0).toUpperCase()}</Text>
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              {profile.bio && <Text style={styles.profileBio}>{profile.bio}</Text>}
              {profile.website_url && (
                <TouchableOpacity
                  style={styles.profileWebsiteRow}
                  onPress={() => openExternalLink(profile.website_url!)}
                  activeOpacity={0.7}
                >
                  <Globe size={11} color={colors.teal} />
                  <Text style={styles.profileWebsite} numberOfLines={1}>{profile.website_url}</Text>
                </TouchableOpacity>
              )}
              <View style={styles.profileStats}>
                <Text style={styles.profileStatNumber}>{profile.trip_count}</Text>
                <Text style={styles.profileStatLabel}> Perjalanan</Text>
              </View>
            </View>
          </View>

          {/* Trips */}
          <Text style={styles.sectionTitle}>Perjalanan</Text>
          {trips.length === 0 ? (
            <Text style={styles.emptyText}>Pengguna ini belum memiliki perjalanan.</Text>
          ) : (
            <View style={styles.tripGrid}>
              {trips.map((trip) => (
                <View key={trip.id} style={styles.tripGridItem}>
                  <TripCard trip={trip} onPress={() => router.push(`/trip/${trip.id}`)} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, textAlign: 'center' },
  content: { padding: 22, paddingBottom: 40 },
  profileCard: { flexDirection: 'row', gap: 14, backgroundColor: colors.white, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 24 },
  profileAvatar: { width: 64, height: 64, borderRadius: 20, overflow: 'hidden' },
  profileAvatarImg: { width: '100%', height: '100%', borderRadius: 20 },
  profileAvatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  profileAvatarLetter: { fontSize: 24, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  profileInfo: { flex: 1, justifyContent: 'center' },
  profileName: { fontSize: 16, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  profileBio: { ...typography.body, color: colors.muted, marginTop: 4 },
  profileWebsiteRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  profileWebsite: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.teal, flex: 1 },
  profileStats: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  profileStatNumber: { fontSize: 18, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  profileStatLabel: { fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted },
  sectionTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal, marginBottom: 12 },
  emptyText: { ...typography.body, color: colors.muted, textAlign: 'center', paddingVertical: 40 },
  tripGrid: { gap: 16 },
  tripGridItem: {},
});

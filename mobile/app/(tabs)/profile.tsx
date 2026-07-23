import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthProvider';
import { useUserTrips } from '@/features/users/hooks/useUserTrips';
import { TripCard } from '@/features/trips/components/TripCard';
import { EmptyTripsState } from '@/features/home/components/EmptyTripsState';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { avatarColorFor } from '@/theme/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { data: tripsData } = useUserTrips(user?.username ?? '');
  const trips = tripsData?.data ?? [];

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
        <TouchableOpacity onPress={handleSettings} style={styles.settingsBtn}>
          <Text style={{ fontSize: 20 }}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={styles.profileCard}>
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
              <Text style={styles.profileWebsite}>🌐 {user.website_url}</Text>
            )}
            <View style={styles.profileStats}>
              <Text style={styles.profileStatNumber}>{user?.trip_count ?? 0}</Text>
              <Text style={styles.profileStatLabel}> Perjalanan</Text>
            </View>
          </View>
        </View>

        {/* Trips */}
        <Text style={styles.sectionTitle}>Perjalanan</Text>
        {trips.length === 0 ? (
          <EmptyTripsState
            title="Belum ada perjalanan"
            description="Buat perjalanan pertamamu!"
            onPressCta={handleCreateTrip}
          />
        ) : (
          <View style={styles.tripList}>
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onPress={() => router.push(`/trip/${trip.id}`)} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingTop: 8, paddingBottom: 12 },
  headerSpacer: { width: 40 },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, textAlign: 'center' },
  settingsBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.light, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 22, paddingBottom: 112 },
  profileCard: { flexDirection: 'row', gap: 14, backgroundColor: colors.white, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 24 },
  avatar: { width: 64, height: 64, borderRadius: 20, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', borderRadius: 20 },
  avatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  avatarLetter: { fontSize: 24, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  profileInfo: { flex: 1, justifyContent: 'center' },
  profileName: { fontSize: 16, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  profileBio: { ...typography.body, color: colors.muted, marginTop: 4 },
  profileWebsite: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.teal, marginTop: 4 },
  profileStats: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  profileStatNumber: { fontSize: 18, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  profileStatLabel: { fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted },
  sectionTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal, marginBottom: 12 },
  tripList: { gap: 12 },
  tripGridRow: { gap: 12, marginBottom: 12 },
});

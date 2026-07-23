import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTripDetail } from '@/features/trips/hooks/useTripDetail';
import { useActivities } from '@/features/activities/hooks/useActivities';
import { ItineraryTimeline } from '@/features/itinerary/components/ItineraryTimeline';
import { ActivityFormSheet } from '@/features/itinerary/components/ActivityFormSheet';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { MoreHorizontal } from '@/components/icons/MoreHorizontal';
import { Calendar } from '@/components/icons/Calendar';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { formatDateRange } from '@/features/trips/components/TripDateUtils';
import type { TripActivity } from '@atur-perjalanan/shared-types';

export default function ItineraryScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: trip, isLoading: tripLoading } = useTripDetail(tripId);
  const { data: activitiesData, isLoading: activitiesLoading } = useActivities(tripId);

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const activities = activitiesData?.data ?? [];
  const isLoading = tripLoading || activitiesLoading;

  const dateRange = trip
    ? formatDateRange(
        trip.start_date,
        trip.end_date,
        trip.is_all_day,
        trip.start_time,
        trip.end_time,
        trip.status,
      )
    : '';

  const handlePressItem = useCallback((activity: TripActivity) => {
    // TODO: Open activity detail sheet (M14 enhancement)
    setMenuOpenId(null);
  }, []);

  const handlePressMenu = useCallback((activity: TripActivity) => {
    setMenuOpenId((prev) => (prev === activity.id ? null : activity.id));
  }, []);

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
  }, []);

  // Tab counters
  const itineraryCount = activities.length;
  const votingCount = 0; // Will be populated from trip detail in M14
  const chatCount = 0;   // Will be populated in M14
  const mediaCount = 0;  // Will be populated in M14

  if (isLoading) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.coral} />
        </View>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Perjalanan tidak ditemukan</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>{trip.name}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{dateRange}</Text>
        </View>
        <TouchableOpacity style={styles.menuBtn} onPress={() => router.push(`/trip/${tripId}/manage`)}>
          <MoreHorizontal size={20} color={colors.charcoal} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={styles.tabTextActive}>Itinerary</Text>
          {itineraryCount > 0 && (
            <View style={styles.tabBadgeActive}>
              <Text style={styles.tabBadgeTextActive}>{itineraryCount}</Text>
            </View>
          )}
          <View style={styles.tabUnderlineActive} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push(`/trip/${tripId}/voting`)}
        >
          <Text style={styles.tabText}>Voting</Text>
          {votingCount > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{votingCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push(`/trip/${tripId}/chat`)}
        >
          <Text style={styles.tabText}>Chat</Text>
          {chatCount > 0 && (
            <View style={styles.tabBadgeUnread}>
              <Text style={styles.tabBadgeTextUnread}>{chatCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push(`/trip/${tripId}/media`)}
        >
          <Text style={styles.tabText}>Media</Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{mediaCount}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ItineraryTimeline
          activities={activities}
          startDate={trip.start_date}
          endDate={trip.end_date}
          tripStatus={trip.status}
          activeDayIndex={activeDayIndex}
          onChangeDay={setActiveDayIndex}
          onPressItem={handlePressItem}
          onPressMenu={handlePressMenu}
          onPressAdd={() => setShowForm(true)}
        />
      </ScrollView>

      {/* Activity Form Sheet */}
      <ActivityFormSheet
        visible={showForm}
        tripId={tripId}
        activityDate={trip.start_date ?? undefined}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.muted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    marginTop: 1,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginTop: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 16,
    paddingBottom: 10,
  },
  tabActive: {
    position: 'relative',
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
  },
  tabTextActive: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.coral,
  },
  tabBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.light,
  },
  tabBadgeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.muted,
  },
  tabBadgeActive: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.coralLight,
  },
  tabBadgeTextActive: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.coral,
  },
  tabBadgeUnread: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.coralLight,
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBadgeTextUnread: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.coral,
  },
  tabUnderlineActive: {
    position: 'absolute',
    bottom: -1.5,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: colors.coral,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
});

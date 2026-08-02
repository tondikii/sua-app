import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTripDetail } from '@/features/trips/hooks/useTripDetail';
import { useActivities } from '@/features/activities/hooks/useActivities';
import { useMembers } from '@/features/trips/hooks/useMembers';
import { useDeleteTrip } from '@/features/trips/hooks/useDeleteTrip';
import { useDeleteActivity } from '@/features/activities/hooks/useDeleteActivity';
import { useAuth } from '@/auth/AuthProvider';
import { ItineraryTimeline } from '@/features/itinerary/components/ItineraryTimeline';
import { ActivityFormSheet } from '@/features/itinerary/components/ActivityFormSheet';
import { ActivityDetailSheet } from '@/features/itinerary/components/ActivityDetailSheet';
import { buildItineraryDays } from '@/features/itinerary/utils/itineraryUtils';
import { VotingTabContent } from './voting';
import { ChatTabContent } from './chat';
import { MediaTabContent } from './media';
import { usePolls } from '@/features/voting/hooks/usePolls';
import { useDocuments } from '@/features/media/hooks/useDocuments';
import { useMessages } from '@/features/chat/hooks/useMessages';
import { goBackSmart } from '@/lib/navigation';
import { ConfirmModal } from '@/components/ConfirmModal';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { MoreHorizontal } from '@/components/icons/MoreHorizontal';
import { Users } from '@/components/icons/Users';
import { Trash2 } from '@/components/icons/Trash2';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { formatDateRange } from '@/features/trips/components/TripDateUtils';
import type { TripActivity } from '@atur-perjalanan/shared-types';

type TabKey = 'itinerary' | 'voting' | 'chat' | 'media';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'itinerary', label: 'Itinerary' },
  { key: 'voting', label: 'Voting' },
  { key: 'chat', label: 'Chat' },
  { key: 'media', label: 'Media' },
];

export default function TripDetailScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const { data: trip, isLoading: tripLoading } = useTripDetail(tripId);
  const { data: activitiesData, isLoading: activitiesLoading } = useActivities(tripId);
  const { data: membersData, isLoading: membersLoading } = useMembers(tripId);
  const { data: pollsData } = usePolls(tripId);
  const { data: documentsData } = useDocuments(tripId);
  const { data: messagesData } = useMessages(tripId);
  const deleteTrip = useDeleteTrip(tripId);
  const deleteActivity = useDeleteActivity(tripId);

  const [activeTab, setActiveTab] = useState<TabKey>('itinerary');
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [detailActivity, setDetailActivity] = useState<TripActivity | null>(null);
  const [editingActivity, setEditingActivity] = useState<TripActivity | null>(null);
  const [deleteActivityTarget, setDeleteActivityTarget] = useState<TripActivity | null>(null);
  const [deletingActivity, setDeletingActivity] = useState(false);

  const activities = activitiesData?.data ?? [];
  const isLoading = tripLoading || activitiesLoading || membersLoading;
  const isCreator = membersData?.is_creator ?? trip?.creator?.id === user?.id;

  // Active day's date for the add/edit form (day-aware instead of trip start).
  const activeDayDate = useMemo(() => {
    if (!trip) return undefined;
    const days = buildItineraryDays(activities, trip.start_date, trip.end_date, trip.status);
    const day = days[activeDayIndex] ?? days[0];
    return day?.date || trip.start_date || undefined;
  }, [trip, activities, activeDayIndex]);

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
    setMenuOpenId(null);
    setDetailActivity(activity);
  }, []);

  const handlePressMenu = useCallback((activity: TripActivity) => {
    setMenuOpenId((prev) => (prev === activity.id ? null : activity.id));
  }, []);

  const handlePressNav = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {});
  }, []);

  const handleEditActivity = useCallback((activity: TripActivity) => {
    setMenuOpenId(null);
    setEditingActivity(activity);
  }, []);

  const handleDeleteActivityPress = useCallback((activity: TripActivity) => {
    setMenuOpenId(null);
    setDeleteActivityTarget(activity);
  }, []);

  const handleConfirmDeleteActivity = useCallback(async () => {
    if (!deleteActivityTarget) return;
    setDeletingActivity(true);
    try {
      await deleteActivity.mutateAsync(deleteActivityTarget.id);
      setDeleteActivityTarget(null);
    } catch {
      Alert.alert('Gagal', 'Tidak dapat menghapus aktivitas');
    } finally {
      setDeletingActivity(false);
    }
  }, [deleteActivity, deleteActivityTarget]);

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setEditingActivity(null);
  }, []);

  const handleDeleteTrip = useCallback(() => {
    setShowMenu(false);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await deleteTrip.mutateAsync();
      setShowDeleteConfirm(false);
      router.replace('/(tabs)');
    } catch {
      setDeleting(false);
      setShowDeleteConfirm(false);
      Alert.alert('Gagal', 'Tidak dapat menghapus perjalanan');
    }
  }, [deleteTrip, router]);

  // Tab counters — itinerary/voting/media selalu tampil; chat hanya unread.
  const itineraryCount = activities.length;
  const votingCount = pollsData?.data?.length ?? 0;
  const mediaCount = documentsData?.data?.length ?? 0;
  const chatCount = messagesData?.pages?.[0]?.unread_count ?? 0;

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
        <TouchableOpacity onPress={() => goBackSmart(router)} style={styles.backBtn}>
          <ChevronLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>{trip.name}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{dateRange}</Text>
        </View>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setShowMenu((v) => !v)}
          activeOpacity={0.7}
        >
          <MoreHorizontal size={20} color={colors.charcoal} />
        </TouchableOpacity>
      </View>

      {/* Kebab popup */}
      {showMenu && (
        <>
          <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowMenu(false)} />
          <View style={styles.menuDropdown}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => { setShowMenu(false); router.push(`/trip/${tripId}/members`); }}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: colors.tealLight }]}>
                <Users size={16} color={colors.teal} />
              </View>
              <Text style={styles.menuItemText}>Daftar Anggota</Text>
            </TouchableOpacity>
            {isCreator && (
              <>
                <View style={styles.menuDivider} />
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => { setShowMenu(false); router.push(`/trip/${tripId}/edit`); }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconBox, { backgroundColor: colors.light }]}>
                    <Text style={{ fontSize: 16, color: colors.muted }}>⚙</Text>
                  </View>
                  <Text style={styles.menuItemText}>Edit Info Perjalanan</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuItem} onPress={handleDeleteTrip} activeOpacity={0.7}>
                  <View style={[styles.menuIconBox, { backgroundColor: colors.dangerLight }]}>
                    <Trash2 size={16} color={colors.danger} />
                  </View>
                  <Text style={[styles.menuItemText, { color: colors.danger }]}>Hapus Perjalanan</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </>
      )}

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          const count = tab.key === 'itinerary' ? itineraryCount
            : tab.key === 'voting' ? votingCount
            : tab.key === 'chat' ? chatCount
            : mediaCount;
          // Chat badge hanya unread; tab lain selalu tampil counternya (termasuk 0).
          const showBadge = tab.key === 'chat' ? count > 0 : true;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={active ? styles.tabTextActive : styles.tabText}>{tab.label}</Text>
              {showBadge && (
                <View style={tab.key === 'chat' ? styles.tabBadgeUnread : active ? styles.tabBadgeActive : styles.tabBadge}>
                  <Text style={tab.key === 'chat' ? styles.tabBadgeTextUnread : active ? styles.tabBadgeTextActive : styles.tabBadgeText}>
                    {count}
                  </Text>
                </View>
              )}
              {active && <View style={styles.tabUnderlineActive} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content — inline tab panels */}
      {activeTab === 'itinerary' && (
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
            onCloseMenu={() => setMenuOpenId(null)}
            menuOpenId={menuOpenId}
            onPressNav={handlePressNav}
            onEditActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivityPress}
            onPressAdd={() => setShowForm(true)}
          />
        </ScrollView>
      )}

      {activeTab === 'voting' && (
        <VotingTabContent tripId={tripId} isCreator={isCreator} />
      )}

      {activeTab === 'chat' && (
        <ChatTabContent tripId={tripId} currentUserId={user?.id ?? ''} />
      )}

      {activeTab === 'media' && (
        <MediaTabContent tripId={tripId} />
      )}

      {/* Activity Form Sheet (day-aware; edit mode when editingActivity set) */}
      <ActivityFormSheet
        visible={showForm || !!editingActivity}
        tripId={tripId}
        activityDate={editingActivity?.activity_date ?? activeDayDate ?? ''}
        editActivity={editingActivity}
        onClose={() => { setShowForm(false); setEditingActivity(null); }}
        onSuccess={handleFormSuccess}
      />

      {/* Activity Detail Sheet */}
      <ActivityDetailSheet
        visible={!!detailActivity}
        activity={detailActivity}
        onClose={() => setDetailActivity(null)}
      />

      {/* Delete activity confirmation */}
      <ConfirmModal
        visible={!!deleteActivityTarget}
        title="Hapus aktivitas?"
        description={
          <>
            <Text style={{ color: colors.charcoal, fontFamily: 'PlusJakartaSans_700Bold' }}>
              {deleteActivityTarget?.place_name ?? ''}
            </Text>{' '}
            akan dihapus dari itinerary.
          </>
        }
        icon={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={22} color={colors.danger} />
          </View>
        }
        confirmLabel="Hapus"
        destructive
        loading={deletingActivity}
        onConfirm={() => void handleConfirmDeleteActivity()}
        onCancel={() => setDeleteActivityTarget(null)}
      />

      {/* Delete trip confirmation modal (Screen 95) */}
      <ConfirmModal
        visible={showDeleteConfirm}
        title="Hapus perjalanan?"
        description={
          <>
            <Text style={{ color: colors.charcoal, fontFamily: 'PlusJakartaSans_700Bold' }}>
              {trip.name}
            </Text>{' '}
            dan semua datanya akan dihapus permanen.
          </>
        }
        icon={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={22} color={colors.danger} />
          </View>
        }
        confirmLabel="Hapus"
        destructive
        loading={deleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setShowDeleteConfirm(false)}
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    marginTop: 1,
    textAlign: 'center',
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 40,
  },
  menuDropdown: {
    position: 'absolute',
    top: 56,
    right: 16,
    width: 210,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 6,
    zIndex: 50,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.charcoal,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
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
    flexGrow: 1,
  },
});

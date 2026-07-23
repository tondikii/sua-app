import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTrips } from '@/features/trips/hooks/useTrips';
import { useInvitations } from '@/features/invitations/hooks/useInvitations';
import { useUnreadCount } from '@/features/notifications/hooks/useUnreadCount';
import { useRespondInvitation } from '@/features/invitations/hooks/useRespondInvitation';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { HomeTabs, type HomeTab } from '@/features/home/components/HomeTabs';
import { TripCard } from '@/features/trips/components/TripCard';
import { InvitationCard } from '@/features/trips/components/InvitationCard';
import { EmptyTripsState } from '@/features/home/components/EmptyTripsState';
import { colors } from '@/theme/colors';
import type { TripSummary, TripInvitation } from '@atur-perjalanan/shared-types';

type ListItem = TripSummary | TripInvitation;

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<HomeTab>('mendatang');

  const upcoming = useTrips('upcoming');
  const completed = useTrips('completed');
  const invitations = useInvitations();
  const { data: unreadData } = useUnreadCount();
  const respondInvitation = useRespondInvitation();

  const unreadCount = unreadData?.unread_count ?? 0;

  const upcomingItems = useMemo(
    () => upcoming.data?.pages.flatMap((p) => p.data) ?? [],
    [upcoming.data],
  );
  const completedItems = useMemo(
    () => completed.data?.pages.flatMap((p) => p.data) ?? [],
    [completed.data],
  );
  const invitationItems = useMemo(
    () => invitations.data?.pages.flatMap((p) => p.data) ?? [],
    [invitations.data],
  );

  const counts = useMemo(
    () => ({
      mendatang: upcomingItems.length,
      selesai: completedItems.length,
      undangan: invitationItems.length,
    }),
    [upcomingItems.length, completedItems.length, invitationItems.length],
  );

  const isRefreshing =
    activeTab === 'mendatang'
      ? upcoming.isRefetching
      : activeTab === 'selesai'
        ? completed.isRefetching
        : invitations.isRefetching;

  const isLoading =
    activeTab === 'mendatang'
      ? upcoming.isLoading
      : activeTab === 'selesai'
        ? completed.isLoading
        : invitations.isLoading;

  const onRefresh = useCallback(() => {
    if (activeTab === 'mendatang') upcoming.refetch();
    else if (activeTab === 'selesai') completed.refetch();
    else invitations.refetch();
  }, [activeTab, upcoming, completed, invitations]);

  const handlePressTrip = useCallback(
    (tripId: string) => {
      router.push(`/trip/${tripId}`);
    },
    [router],
  );

  const handleAccept = useCallback(
    (invitation: TripInvitation) => {
      respondInvitation.mutate({
        tripId: invitation.trip.id,
        invitationId: invitation.id,
        accept: true,
      });
    },
    [respondInvitation],
  );

  const handleDecline = useCallback(
    (invitation: TripInvitation) => {
      respondInvitation.mutate({
        tripId: invitation.trip.id,
        invitationId: invitation.id,
        accept: false,
      });
    },
    [respondInvitation],
  );

  const handlePressBell = useCallback(() => {
    router.push('/notifications');
  }, [router]);

  const handleCreateTrip = useCallback(() => {
    router.push('/trip/create');
  }, [router]);

  const renderTripCard = useCallback(
    ({ item }: { item: TripSummary }) => (
      <TripCard
        trip={item}
        dimmed={activeTab === 'selesai'}
        onPress={() => handlePressTrip(item.id)}
      />
    ),
    [activeTab, handlePressTrip],
  );

  const renderInvitationCard = useCallback(
    ({ item }: { item: TripInvitation }) => (
      <InvitationCard
        invitation={item}
        onPressTrip={() => handlePressTrip(item.trip.id)}
        onAccept={() => handleAccept(item)}
        onDecline={() => handleDecline(item)}
        isResponding={respondInvitation.isPending}
      />
    ),
    [handlePressTrip, handleAccept, handleDecline, respondInvitation.isPending],
  );

  const renderListItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (activeTab === 'undangan') {
        return renderInvitationCard({ item: item as TripInvitation });
      }
      return renderTripCard({ item: item as TripSummary });
    },
    [activeTab, renderTripCard, renderInvitationCard],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.coral} />
          <Text style={styles.loadingText}>Memuat perjalananmu...</Text>
        </View>
      );
    }

    if (activeTab === 'mendatang') {
      return <EmptyTripsState onPressCta={handleCreateTrip} />;
    }

    if (activeTab === 'selesai') {
      return (
        <View style={styles.emptyGeneric}>
          <Text style={styles.emptyText}>Belum ada perjalanan selesai</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyGeneric}>
        <Text style={styles.emptyText}>Tidak ada undangan</Text>
      </View>
    );
  }, [activeTab, isLoading, handleCreateTrip]);

  const data: ListItem[] = activeTab === 'mendatang' ? upcomingItems : activeTab === 'selesai' ? completedItems : invitationItems;

  const handleEndReached = useCallback(() => {
    if (activeTab === 'mendatang' && upcoming.hasNextPage && !upcoming.isFetchingNextPage) {
      upcoming.fetchNextPage();
    } else if (activeTab === 'selesai' && completed.hasNextPage && !completed.isFetchingNextPage) {
      completed.fetchNextPage();
    } else if (activeTab === 'undangan' && invitations.hasNextPage && !invitations.isFetchingNextPage) {
      invitations.fetchNextPage();
    }
  }, [activeTab, upcoming, completed, invitations]);

  return (
    <View style={styles.screen}>
      <HomeHeader unreadCount={unreadCount} onPressBell={handlePressBell} />
      <HomeTabs activeTab={activeTab} counts={counts} onChangeTab={setActiveTab} />

      <FlatList<ListItem>
        data={data}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.coral}
            colors={[colors.coral]}
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 112,
    gap: 16,
    flexGrow: 1,
  },
  separator: {
    height: 0,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
  },
  emptyGeneric: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
  },
});

import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useUnreadCount } from '@/features/notifications/hooks/useUnreadCount';
import { useMarkAsRead } from '@/features/notifications/hooks/useMarkAsRead';
import { useRespondInvitation } from '@/features/invitations/hooks/useRespondInvitation';
import { goBackSmart } from '@/lib/navigation';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { Bell } from '@/components/icons/Bell';
import { Calendar } from '@/components/icons/Calendar';
import { Send } from '@/components/icons/Send';
import { Check } from '@/components/icons/Check';
import { ListChecks } from '@/components/icons/ListChecks';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { shadows } from '@/theme/shadows';
import { avatarColorFor } from '@/theme/colors';
import { formatNotificationTime } from '@/features/trips/components/TripDateUtils';
import type { AppNotification, NotificationType } from '@atur-perjalanan/shared-types';

type NotifIconInfo = { icon: React.ReactNode; bg: string };

function getNotificationIcon(type: NotificationType): NotifIconInfo {
  switch (type) {
    case 'invite':
      return { icon: <Send size={10} color={colors.coral} />, bg: colors.coralLight };
    case 'voting_deadline':
      return { icon: <Check size={10} color={colors.amber} />, bg: colors.amberLight };
    case 'activity_update':
      return { icon: <ListChecks size={10} color={colors.teal} />, bg: colors.tealLight };
    default:
      return { icon: <Bell size={10} color={colors.muted} />, bg: colors.light };
  }
}

function getNotificationText(notification: AppNotification): string {
  const actorName = notification.actor?.name ?? 'Seseorang';
  const tripName = notification.trip?.name ?? 'perjalanan';

  switch (notification.type) {
    case 'invite':
      return `${actorName} mengundangmu ke `;
    case 'voting_deadline':
      return `Voting Tanggal ${tripName} segera berakhir.`;
    case 'activity_update': {
      const destName = (notification.payload?.activity_name as string) ?? 'aktivitas';
      return `${actorName} menambahkan aktivitas ${destName} di ${tripName}.`;
    }
    default:
      return 'Notifikasi baru';
  }
}

function NotificationCard({
  notification,
  onPress,
  onAccept,
  onDecline,
  respondingAction,
  resolved,
}: {
  notification: AppNotification;
  onPress: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  respondingAction?: 'accept' | 'decline' | null;
  resolved?: boolean;
}) {
  const { icon, bg } = getNotificationIcon(notification.type);
  const actor = notification.actor;
  const timeText = formatNotificationTime(notification.created_at);
  const text = getNotificationText(notification);
  const accepted = notification.payload?.accepted === true;
  const isResolved = resolved ?? notification.payload?.resolved === true;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.card, notification.is_read ? styles.cardRead : styles.cardUnread]}
    >
      <View style={styles.cardContent}>
        <View style={styles.avatarContainer}>
          {actor?.avatar_url ? (
            <Image source={{ uri: actor.avatar_url }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarFallback,
                { backgroundColor: avatarColorFor(actor?.username ?? 'x') },
              ]}
            >
              <Text style={styles.avatarLetter}>
                {(actor?.name ?? '?').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={[styles.iconBadge, { backgroundColor: bg }]}>
            {icon}
          </View>
        </View>

        <View style={styles.textContent}>
          <Text style={styles.bodyText}>
            {notification.type === 'invite' ? (
              <>
                <Text style={styles.highlight}>{notification.actor?.name ?? 'Seseorang'}</Text>
                {' mengundangmu ke '}
                <Text style={styles.highlight}>{notification.trip?.name ?? 'perjalanan'}</Text>
              </>
            ) : (
              text
            )}
          </Text>
          <Text style={styles.timeText}>{timeText}</Text>

          {notification.type === 'invite' && onAccept && onDecline && !isResolved && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.acceptBtn, respondingAction === 'accept' && styles.btnDisabled]}
                onPress={onAccept}
                disabled={respondingAction !== null}
                activeOpacity={0.7}
              >
                {respondingAction === 'accept' ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.acceptBtnText}>Terima</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.declineBtn, respondingAction === 'decline' && styles.btnDisabled]}
                onPress={onDecline}
                disabled={respondingAction !== null}
                activeOpacity={0.7}
              >
                {respondingAction === 'decline' ? (
                  <ActivityIndicator size="small" color={colors.muted} />
                ) : (
                  <Text style={styles.declineBtnText}>Tolak</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {notification.type === 'invite' && isResolved && (
            <View style={styles.resolvedBadge}>
              <Text style={[styles.resolvedBadgeText, accepted ? styles.resolvedBadgeAccepted : styles.resolvedBadgeDeclined]}>
                {accepted ? '✓ Undangan diterima' : '✕ Undangan ditolak'}
              </Text>
            </View>
          )}

          {notification.type === 'voting_deadline' && (
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.voteBtn} onPress={onPress} activeOpacity={0.7}>
                <Text style={styles.voteBtnText}>Vote Sekarang →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {!notification.is_read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isLoading, refetch, isRefetching } = useNotifications();
  const { data: unreadData } = useUnreadCount();
  const { markOne, markAll } = useMarkAsRead();
  const respondInvitation = useRespondInvitation();
  const [responding, setResponding] = useState<{ id: string; action: 'accept' | 'decline' } | null>(null);

  const notifications = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  const handlePressNotification = useCallback(
    (notification: AppNotification) => {
      if (!notification.is_read) {
        markOne.mutate(notification.id);
      }
      if (notification.trip) {
        router.push(`/trip/${notification.trip.id}`);
      }
    },
    [markOne, router],
  );

  const handleAcceptInvite = useCallback(
    (notification: AppNotification) => {
      if (!notification.is_read) {
        markOne.mutate(notification.id);
      }
      const tripId = notification.trip?.id;
      const invitationId = notification.payload?.invitation_id as string | undefined;
      if (tripId && invitationId) {
        setResponding({ id: notification.id, action: 'accept' });
        respondInvitation.mutate(
          { tripId, invitationId, accept: true },
          { onSettled: () => setResponding(null) },
        );
      }
    },
    [markOne, respondInvitation],
  );

  const handleDeclineInvite = useCallback(
    (notification: AppNotification) => {
      if (!notification.is_read) {
        markOne.mutate(notification.id);
      }
      const tripId = notification.trip?.id;
      const invitationId = notification.payload?.invitation_id as string | undefined;
      if (tripId && invitationId) {
        setResponding({ id: notification.id, action: 'decline' });
        respondInvitation.mutate(
          { tripId, invitationId, accept: false },
          { onSettled: () => setResponding(null) },
        );
      }
    },
    [markOne, respondInvitation],
  );

  const handleMarkAllRead = useCallback(() => {
    markAll.mutate();
  }, [markAll]);

  const renderItem = useCallback(
    ({ item }: { item: AppNotification }) => (
      <NotificationCard
        notification={item}
        onPress={() => handlePressNotification(item)}
        onAccept={item.type === 'invite' ? () => handleAcceptInvite(item) : undefined}
        onDecline={item.type === 'invite' ? () => handleDeclineInvite(item) : undefined}
        respondingAction={responding?.id === item.id ? responding.action : null}
      />
    ),
    [handlePressNotification, handleAcceptInvite, handleDeclineInvite, responding],
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBackSmart(router)} style={styles.backButton}>
          <ChevronLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllButton}>
          <Text style={styles.markAllText}>Tandai semua dibaca</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.coral} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Bell size={40} color={colors.mutedLight} />
              <Text style={styles.emptyText}>Belum ada notifikasi</Text>
            </View>
          }
          refreshing={isRefetching}
          onRefresh={refetch}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: colors.light,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.cardCompact,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    textAlign: 'center',
  },
  markAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markAllText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.coral,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 10,
  },
  separator: {
    height: 0,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    ...typography.body,
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    paddingHorizontal: 16,
    ...shadows.card,
  },
  cardRead: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardUnread: {
    borderWidth: 1.5,
    borderColor: `${colors.coral}30`,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  iconBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  bodyText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.charcoal,
    lineHeight: 18,
  },
  highlight: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.mutedLight,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  resolvedBadge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.light,
  },
  resolvedBadgeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  resolvedBadgeAccepted: {
    color: colors.teal,
  },
  resolvedBadgeDeclined: {
    color: colors.danger,
  },
  acceptBtn: {
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.coral,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  declineBtn: {
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  voteBtn: {
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.amberLight,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.amber,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coral,
    marginLeft: 8,
    marginTop: 4,
  },
});

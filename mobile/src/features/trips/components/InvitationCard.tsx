import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import type { TripInvitation } from '@atur-perjalanan/shared-types';
import { Calendar } from '@/components/icons/Calendar';
import { formatDateRange } from './TripDateUtils';
import { useTheme, avatarColorFor } from '@/theme';
import { typography } from '@/theme/typography';
import { shadows } from '@/theme/shadows';

interface InvitationCardProps {
  invitation: TripInvitation;
  onPressTrip: () => void;
  onAccept: () => void;
  onDecline: () => void;
  isResponding?: boolean;
}

export function InvitationCard({
  invitation,
  onPressTrip,
  onAccept,
  onDecline,
  isResponding,
}: InvitationCardProps) {
  const { colors: c } = useTheme();
  const trip = invitation.trip;
  const inviter = invitation.inviter;

  const dateRange = formatDateRange(
    trip.start_date,
    trip.end_date,
    trip.is_all_day,
    trip.start_time,
    trip.end_time,
    trip.status,
  );

  return (
    <TouchableOpacity onPress={onPressTrip} activeOpacity={0.8} style={[styles.card, { backgroundColor: c.white }]}>
      <View style={styles.imageContainer}>
        {trip.cover_image_url ? (
          <Image source={{ uri: trip.cover_image_url }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: c.light }]}>
            <Calendar size={32} color={c.mutedLight} />
          </View>
        )}
        <View style={styles.overlay}>
          <View style={styles.inviterRow}>
            {inviter.avatar_url ? (
              <Image source={{ uri: inviter.avatar_url }} style={styles.inviterAvatar} />
            ) : (
              <View style={[styles.inviterAvatarFallback, { backgroundColor: avatarColorFor(inviter.username) }]}>
                <Text style={styles.inviterLetter}>{inviter.name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <Text style={styles.inviterText}>
              Diundang oleh <Text style={styles.inviterName}>@{inviter.username}</Text>
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, { color: c.charcoal }]} numberOfLines={1}>{trip.name}</Text>

        <View style={styles.dateRow}>
          <Calendar size={13} color={c.muted} />
          <Text style={[styles.dateText, { color: c.muted }]} numberOfLines={1}>{dateRange}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.acceptButton, { backgroundColor: c.coral }]}
            onPress={onAccept}
            disabled={isResponding}
            activeOpacity={0.7}
          >
            {isResponding ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.acceptText}>Terima</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.declineButton, { backgroundColor: c.light, borderColor: c.border }]}
            onPress={onDecline}
            disabled={isResponding}
            activeOpacity={0.7}
          >
            {isResponding ? (
              <ActivityIndicator size="small" color={c.muted} />
            ) : (
              <Text style={[styles.declineText, { color: c.muted }]}>Tolak</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.card,
  },
  imageContainer: {
    height: 120,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  inviterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inviterAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  inviterAvatarFallback: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviterLetter: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
  inviterText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#FFFFFF',
  },
  inviterName: {
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  body: {
    padding: 14,
    paddingBottom: 16,
  },
  title: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  dateText: {
    ...typography.caption,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  acceptButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
  declineButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});

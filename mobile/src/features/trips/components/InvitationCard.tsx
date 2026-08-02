import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import type { TripInvitation } from '@atur-perjalanan/shared-types';
import { Calendar } from '@/components/icons/Calendar';
import { formatDateRange } from './TripDateUtils';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { shadows } from '@/theme/shadows';
import { avatarColorFor } from '@/theme/colors';

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
    <TouchableOpacity onPress={onPressTrip} activeOpacity={0.8} style={styles.card}>
      <View style={styles.imageContainer}>
        {trip.cover_image_url ? (
          <Image source={{ uri: trip.cover_image_url }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Calendar size={32} color={colors.mutedLight} />
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
        <Text style={styles.title} numberOfLines={1}>{trip.name}</Text>

        <View style={styles.dateRow}>
          <Calendar size={13} color={colors.muted} />
          <Text style={styles.dateText} numberOfLines={1}>{dateRange}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={onAccept}
            disabled={isResponding}
            activeOpacity={0.7}
          >
            {isResponding ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.acceptText}>Terima</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={onDecline}
            disabled={isResponding}
            activeOpacity={0.7}
          >
            {isResponding ? (
              <ActivityIndicator size="small" color={colors.muted} />
            ) : (
              <Text style={styles.declineText}>Tolak</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
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
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingHorizontal: 14,
    paddingBottom: 10,
    // gradient overlay via linear-gradient would be ideal, using simple dark overlay
    // approximating: linear-gradient(to top, rgba(26,26,46,0.55), transparent 55%)
    // For RN simplicity, use a semi-transparent bottom section
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
    color: colors.white,
  },
  inviterText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.white,
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
    color: colors.charcoal,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  dateText: {
    ...typography.caption,
    color: colors.muted,
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
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  declineButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
});

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { TripSummary } from '@atur-perjalanan/shared-types';
import { TripTags } from './TripTags';
import { Calendar } from '@/components/icons/Calendar';
import { formatDateRange } from './TripDateUtils';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { shadows } from '@/theme/shadows';
import { avatarColorFor } from '@/theme/colors';

interface TripCardProps {
  trip: TripSummary;
  dimmed?: boolean;
  onPress: () => void;
}

const MAX_AVATARS = 4;
const AVATAR_SIZE = 26;
const AVATAR_OVERLAP = 9;

export function TripCard({ trip, dimmed, onPress }: TripCardProps) {
  const dateRange = formatDateRange(
    trip.start_date,
    trip.end_date,
    trip.is_all_day,
    trip.start_time,
    trip.end_time,
    trip.status,
  );

  const avatars = trip.participants_preview.slice(0, MAX_AVATARS);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.card, dimmed && styles.cardDimmed]}>
      <View style={styles.imageContainer}>
        {trip.cover_image_url ? (
          <Image
            source={{ uri: trip.cover_image_url }}
            style={[styles.image, dimmed && styles.imageDimmed]}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.imagePlaceholder, dimmed && styles.imageDimmed]}>
            <Calendar size={32} color={colors.mutedLight} />
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{trip.name}</Text>

        {trip.tags.length > 0 && (
          <View style={styles.tagsRow}>
            <TripTags tags={trip.tags} maxVisible={3} />
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.dateRow}>
            <Calendar size={13} color={colors.muted} />
            <Text style={styles.dateText} numberOfLines={1}>{dateRange}</Text>
          </View>

          {avatars.length > 0 && (
            <View style={styles.avatarStack}>
              {avatars.map((user, i) => (
                <View
                  key={user.id}
                  style={[
                    styles.avatar,
                    { marginLeft: i > 0 ? -AVATAR_OVERLAP : 0, zIndex: MAX_AVATARS - i },
                  ]}
                >
                  {user.avatar_url ? (
                    <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
                  ) : (
                    <View style={[styles.avatarFallback, { backgroundColor: avatarColorFor(user.username) }]}>  
                      <Text style={styles.avatarLetter}>{user.name.charAt(0).toUpperCase()}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
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
  cardDimmed: {
    opacity: 0.92,
  },
  imageContainer: {
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageDimmed: {
    // grayscale approximation
    opacity: 0.8,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 14,
    paddingBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    letterSpacing: -0.3,
  },
  tagsRow: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  dateText: {
    ...typography.caption,
    color: colors.muted,
    flex: 1,
  },
  avatarStack: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.white,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarLetter: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
});

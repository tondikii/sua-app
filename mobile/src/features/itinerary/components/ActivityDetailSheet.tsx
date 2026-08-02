import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ItemDetailSheet } from '@/components/ItemDetailSheet';
import { getCoverIconMeta } from '@/features/itinerary/utils/coverIcons';
import { resolveItineraryTimeState } from '@/features/itinerary/utils/itineraryUtils';
import { colors } from '@/theme/colors';
import type { TripActivity } from '@atur-perjalanan/shared-types';

interface Props {
  visible: boolean;
  activity: TripActivity | null;
  onClose: () => void;
}

/** Detail aktivitas — reuses the shared ItemDetailSheet so it stays identical to wishlist detail. */
export function ActivityDetailSheet({ visible, activity, onClose }: Props) {
  if (!visible || !activity) return null;

  const iconMeta = getCoverIconMeta(activity.cover_icon);
  const Icon = iconMeta.icon;
  const hasImage = Boolean(activity.thumbnail_url);
  const hasCoverIcon = activity.cover_source === 'icon' && activity.cover_icon;
  const timeState = resolveItineraryTimeState(
    activity.start_time,
    activity.end_time,
    activity.activity_date,
    'fixed',
    new Date(),
  );

  return (
    <ItemDetailSheet
      visible={visible}
      item={{
        place_name: activity.place_name,
        location_label: activity.location_label,
        thumbnail_url: activity.thumbnail_url,
        start_time: activity.start_time,
        end_time: activity.end_time,
        description: activity.description,
        maps_link: activity.maps_link,
        ref_links: activity.ref_links,
      }}
      onClose={onClose}
      imageFallback={
        hasCoverIcon && !hasImage ? (
          <View style={[styles.iconCover, { backgroundColor: iconMeta.bg }]}>
            <Icon size={34} color={iconMeta.color} />
          </View>
        ) : null
      }
      timeExtra={
        timeState === 'present' ? (
          <View style={styles.nowBadge}>
            <Text style={styles.nowBadgeText}>Sekarang</Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  iconCover: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nowBadge: {
    marginLeft: 8,
    backgroundColor: colors.coralLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  nowBadgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.coral,
  },
});

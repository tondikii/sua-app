import React, { useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from '@/components/icons/X';
import { Clock } from '@/components/icons/Clock';
import { Navigation } from '@/components/icons/Navigation';
import { Link2 } from '@/components/icons/Link2';
import { getCoverIconMeta } from '@/features/itinerary/utils/coverIcons';
import { colors } from '@/theme/colors';
import type { TripActivity } from '@atur-perjalanan/shared-types';

interface Props {
  visible: boolean;
  activity: TripActivity | null;
  onClose: () => void;
}

/** Detail aktivitas — sheet ringkas, tautan sebagai baris (Figma Screen 51-53). */
export function ActivityDetailSheet({ visible, activity, onClose }: Props) {
  const openLink = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {});
  }, []);

  if (!visible || !activity) return null;

  const iconMeta = getCoverIconMeta(activity.cover_icon);
  const Icon = iconMeta.icon;
  const hasImage = Boolean(activity.thumbnail_url);

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title} numberOfLines={2}>{activity.place_name}</Text>
              {activity.location_label ? (
                <Text style={styles.subtitle} numberOfLines={1}>{activity.location_label}</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={colors.charcoal} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {hasImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: activity.thumbnail_url! }} style={styles.image} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(26,26,46,0.35)']}
                  style={styles.imageGradient}
                />
                <View style={styles.timeBadge}>
                  <Clock size={12} color={colors.muted} />
                  <Text style={styles.timeBadgeText}>{activity.start_time} – {activity.end_time}</Text>
                </View>
              </View>
            ) : (
              <View style={[styles.iconCover, { backgroundColor: iconMeta.bg }]}>
                <Icon size={34} color={iconMeta.color} />
                <View style={styles.iconCoverTimeRow}>
                  <Clock size={12} color={colors.muted} />
                  <Text style={styles.timeBadgeText}>{activity.start_time} – {activity.end_time}</Text>
                </View>
              </View>
            )}

            {/* Time (when no cover image) already shown; when image present show under too for consistency */}
            {!hasImage && activity.cover_source === 'none' && (
              <View style={styles.timeRow}>
                <Clock size={14} color={colors.muted} />
                <Text style={styles.timeText}>{activity.start_time} – {activity.end_time}</Text>
              </View>
            )}

            {activity.description ? (
              <Text style={styles.description}>{activity.description}</Text>
            ) : null}

            {(activity.maps_link || activity.ref_links.length > 0) && (
              <View style={styles.linksSection}>
                <Text style={styles.linksLabel}>TAUTAN</Text>
                {activity.maps_link && (
                  <TouchableOpacity
                    style={styles.linkRow}
                    onPress={() => openLink(activity.maps_link!)}
                    activeOpacity={0.7}
                  >
                    <Navigation size={15} color={colors.teal} />
                    <Text style={styles.linkText}>Buka di Google Maps</Text>
                  </TouchableOpacity>
                )}
                {activity.ref_links.map((ref, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.linkRow}
                    onPress={() => openLink(ref.url)}
                    activeOpacity={0.7}
                  >
                    <Link2 size={15} color={colors.teal} />
                    <View style={styles.linkBody}>
                      {ref.label?.trim() ? (
                        <Text style={styles.linkTitle} numberOfLines={1}>{ref.label}</Text>
                      ) : null}
                      <Text style={styles.linkUrl} numberOfLines={1}>{ref.url}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26,26,46,0.45)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '85%',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 20,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: { flex: 1, paddingRight: 12 },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: 16, paddingBottom: 40, gap: 10 },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 4,
  },
  image: { width: '100%', height: '100%' },
  imageGradient: { ...StyleSheet.absoluteFill as object },
  iconCover: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconCoverTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  timeBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  timeBadgeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  description: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    lineHeight: 20.15,
  },
  linksSection: { marginTop: 6 },
  linksLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 6,
  },
  linkBody: { flex: 1, gap: 2 },
  linkTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.charcoal,
  },
  linkUrl: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.muted,
  },
  linkText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.teal,
    flex: 1,
  },
});

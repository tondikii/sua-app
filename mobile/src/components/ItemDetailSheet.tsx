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
import { X } from '@/components/icons/X';
import { Clock } from '@/components/icons/Clock';
import { Navigation } from '@/components/icons/Navigation';
import { Link2 } from '@/components/icons/Link2';
import { MapPin } from '@/components/icons/MapPin';
import { colors } from '@/theme/colors';
import { bottomSheetFrame } from '@/theme/layout';
import type { RefLink } from '@atur-perjalanan/shared-types';

export interface ItemDetailData {
  place_name: string;
  location_label?: string | null;
  thumbnail_url?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  description?: string | null;
  maps_link?: string | null;
  ref_links?: RefLink[];
  tags?: string[];
}

interface Props {
  visible: boolean;
  item: ItemDetailData | null;
  onClose: () => void;
  /** Optional footer (e.g. "Jadikan Perjalanan" button) rendered below the scroll. */
  footer?: React.ReactNode;
  /** Optional badge rendered on the cover image (e.g. priority). */
  imageBadge?: React.ReactNode;
  /** Optional content rendered in place of the image when there is no thumbnail. */
  imageFallback?: React.ReactNode;
  /** Extra content after the time row (e.g. "Sekarang" badge). */
  timeExtra?: React.ReactNode;
}

/**
 * Reusable bottom-sheet detail used by both activity detail and wishlist detail
 * so both stay visually identical. Content: header (title + location + close),
 * cover image, time row, tags, description, and TAUTAN links.
 */
export function ItemDetailSheet({
  visible,
  item,
  onClose,
  footer,
  imageBadge,
  imageFallback,
  timeExtra,
}: Props) {
  const openLink = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {});
  }, []);

  if (!visible || !item) return null;

  const hasTime = Boolean(item.start_time || item.end_time);
  const timeText = item.start_time && item.end_time
    ? `${item.start_time} – ${item.end_time}`
    : (item.start_time ?? item.end_time);
  const links = item.ref_links ?? [];
  const tags = item.tags ?? [];

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Header — title + location left, close right */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle} numberOfLines={1}>{item.place_name}</Text>
              {item.location_label ? (
                <View style={styles.headerLocationRow}>
                  <MapPin size={11} color={colors.muted} />
                  <Text style={styles.headerLocationText} numberOfLines={1}>{item.location_label}</Text>
                </View>
              ) : null}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={colors.charcoal} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {/* Cover image (if present) — full width */}
            {item.thumbnail_url ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.thumbnail_url }} style={styles.image} resizeMode="cover" />
                {imageBadge ? <View style={styles.imageBadge}>{imageBadge}</View> : null}
              </View>
            ) : imageFallback ? (
              <View style={styles.imageContainer}>{imageFallback}</View>
            ) : null}

            {/* Time row */}
            {hasTime ? (
              <View style={styles.timeRow}>
                <Clock size={14} color={colors.charcoal} />
                <Text style={styles.timeText}>{timeText}</Text>
                {timeExtra ? timeExtra : null}
              </View>
            ) : null}

            {/* Tags (wishlist) */}
            {tags.length > 0 ? (
              <View style={styles.tagsRow}>
                {tags.slice(0, 3).map((tag, i) => (
                  <View key={i} style={styles.tagChip}>
                    <Text style={styles.tagChipText}>{tag.startsWith('#') ? tag : `#${tag}`}</Text>
                  </View>
                ))}
                {tags.length > 3 ? (
                  <View style={styles.tagChipOverflow}>
                    <Text style={styles.tagChipTextOverflow}>+{tags.length - 3}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            {/* Description */}
            {item.description ? <Text style={styles.description}>{item.description}</Text> : null}

            {/* Links section */}
            {item.maps_link || links.length > 0 ? (
              <View style={styles.linksSection}>
                <Text style={styles.linksLabel}>TAUTAN</Text>
                {item.maps_link ? (
                  <TouchableOpacity
                    style={styles.linkRow}
                    onPress={() => openLink(item.maps_link!)}
                    activeOpacity={0.7}
                  >
                    <Navigation size={15} color={colors.teal} />
                    <Text style={styles.linkText}>Buka di Google Maps</Text>
                  </TouchableOpacity>
                ) : null}
                {links.map((ref, i) => (
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
            ) : null}
          </ScrollView>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
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
    ...bottomSheetFrame,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 4,
  },
  headerTitleWrap: { flex: 1, gap: 2 },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    letterSpacing: -0.2,
  },
  headerLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerLocationText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingBottom: 40 },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 4,
  },
  image: { width: '100%', height: '100%' },
  imageBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.charcoal,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  tagChip: {
    backgroundColor: colors.tealLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagChipText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.teal,
  },
  tagChipOverflow: {
    backgroundColor: colors.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagChipTextOverflow: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.muted,
  },
  description: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.charcoal,
    lineHeight: 20.15,
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  linksSection: {
    marginTop: 14,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
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
  footer: {
    padding: 16,
    paddingHorizontal: 22,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

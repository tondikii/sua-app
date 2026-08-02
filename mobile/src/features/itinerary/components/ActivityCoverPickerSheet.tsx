import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { X } from '@/components/icons/X';
import { Check } from '@/components/icons/Check';
import { ListChecks } from '@/components/icons/ListChecks';
import { Settings } from '@/components/icons/Settings';
import { useDocuments } from '@/features/media/hooks/useDocuments';
import { COVER_ICON_OPTIONS } from '@/features/itinerary/utils/coverIcons';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';
import { bottomSheetFrame } from '@/theme/layout';
import type { TripActivity } from '@atur-perjalanan/shared-types';

type Section = 'trip_media' | 'icon';

export interface CoverSelection {
  cover_source: 'trip_media' | 'icon';
  cover_icon?: string;
  thumbnail_url?: string;
  cover_document_id?: string;
}

interface Props {
  visible: boolean;
  tripId: string;
  current?: TripActivity | null;
  onClose: () => void;
  onSelect: (selection: CoverSelection) => void;
}

/** Pilih cover aktivitas — Media perjalanan atau Ilustrasi (Figma Screen 49-50). */
export function ActivityCoverPickerSheet({ visible, tripId, current, onClose, onSelect }: Props) {
  const [section, setSection] = useState<Section>('trip_media');
  const { data: docsData, isLoading } = useDocuments(tripId);
  const docs = docsData?.data ?? [];

  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(
    current?.cover_document_id ?? null,
  );
  const [selectedIcon, setSelectedIcon] = useState<string | null>(current?.cover_icon ?? null);

  if (!visible) return null;

  const photos = docs.filter((d) => d.media_type === 'photo');

  const handleUse = () => {
    if (section === 'trip_media') {
      const doc = photos.find((d) => d.id === selectedMediaId);
      if (doc) {
        onSelect({
          cover_source: 'trip_media',
          cover_document_id: doc.id,
          thumbnail_url: doc.url,
        });
      }
    } else {
      if (selectedIcon) {
        onSelect({ cover_source: 'icon', cover_icon: selectedIcon });
      }
    }
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Pilih Cover</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={18} color={colors.charcoal} />
          </TouchableOpacity>
        </View>

        {/* Source selector */}
        <View style={styles.sourceSelector}>
          <TouchableOpacity
            style={[styles.sourceRow, section === 'trip_media' && styles.sourceRowActive]}
            onPress={() => setSection('trip_media')}
            activeOpacity={0.7}
          >
            <View style={[styles.sourceIconBox, section === 'trip_media' && styles.sourceIconBoxActive]}>
              <ListChecks size={15} color={section === 'trip_media' ? colors.coral : colors.muted} />
            </View>
            <View style={styles.sourceTextWrap}>
              <Text style={styles.sourceLabel}>Media perjalanan</Text>
              <Text style={styles.sourceHint}>Foto di tab Media</Text>
            </View>
            {section === 'trip_media' && <Check size={16} color={colors.coral} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sourceRow, section === 'icon' && styles.sourceRowActive]}
            onPress={() => setSection('icon')}
            activeOpacity={0.7}
          >
            <View style={[styles.sourceIconBox, section === 'icon' && styles.sourceIconBoxActive]}>
              <Settings size={15} color={section === 'icon' ? colors.coral : colors.muted} />
            </View>
            <View style={styles.sourceTextWrap}>
              <Text style={styles.sourceLabel}>Ilustrasi</Text>
              <Text style={styles.sourceHint}>Icon untuk aktivitas</Text>
            </View>
            {section === 'icon' && <Check size={16} color={colors.coral} />}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {section === 'trip_media' && (
            <>
              {isLoading ? (
                <ActivityIndicator size="large" color={colors.coral} style={styles.loading} />
              ) : photos.length === 0 ? (
                <Text style={styles.emptyText}>Belum ada foto di Media perjalanan.</Text>
              ) : (
                <View style={styles.mediaGrid}>
                  {photos.map((doc) => {
                    const selected = doc.id === selectedMediaId;
                    return (
                      <TouchableOpacity
                        key={doc.id}
                        style={[styles.mediaTile, selected && styles.mediaTileSelected]}
                        onPress={() => setSelectedMediaId(doc.id)}
                        activeOpacity={0.8}
                      >
                        <Image source={{ uri: doc.url }} style={styles.mediaImage} resizeMode="cover" />
                        {selected && (
                          <View style={styles.checkBadge}>
                            <Check size={10} color={colors.white} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </>
          )}

          {section === 'icon' && (
            <View style={styles.iconGrid}>
              {COVER_ICON_OPTIONS.map((opt) => {
                const selected = opt.id === selectedIcon;
                const Icon = opt.icon;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.iconTile, selected && styles.iconTileSelected]}
                    onPress={() => setSelectedIcon(opt.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconTileInner, { backgroundColor: opt.bg }]}>
                      <Icon size={17} color={opt.color} />
                    </View>
                    <Text style={styles.iconTileLabel} numberOfLines={1}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.useBtn} onPress={handleUse} activeOpacity={0.8}>
            <Text style={styles.useBtnText}>Gunakan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill as object,
    zIndex: 50,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill as object,
    backgroundColor: 'rgba(26,26,46,0.45)',
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
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceSelector: { padding: 16, gap: 6 },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  sourceRowActive: {
    borderWidth: 1.5,
    borderColor: colors.coral,
    backgroundColor: colors.coralLight,
  },
  sourceIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceIconBoxActive: { backgroundColor: colors.white },
  sourceTextWrap: { flex: 1 },
  sourceLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
  },
  sourceHint: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.muted,
    marginTop: 1,
  },
  body: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  loading: { paddingVertical: 32 },
  emptyText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 32,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mediaTile: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  mediaTileSelected: { borderWidth: 2, borderColor: colors.coral },
  mediaImage: { width: '100%', height: '100%' },
  checkBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconTile: {
    width: '23%',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  iconTileSelected: {
    borderWidth: 2,
    borderColor: colors.coral,
    backgroundColor: colors.coralLight,
  },
  iconTileInner: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTileLabel: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  useBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  useBtnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.white,
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import type { TripActivity, ActivityKind } from '@atur-perjalanan/shared-types';
import {
  buildItineraryDays,
  buildTimelineSegments,
  resolveItineraryTimeState,
  KIND_META,
  TIME_STATE_META,
  type TimeState,
} from '../utils/itineraryUtils';
import { getCoverIconMeta } from '../utils/coverIcons';
import { ActivityItemMenu } from './ActivityItemMenu';
import { MapPin } from '@/components/icons/MapPin';
import { MoreHorizontal } from '@/components/icons/MoreHorizontal';
import { ExternalLink } from '@/components/icons/ExternalLink';
import { Users } from '@/components/icons/Users';
import { Train } from '@/components/icons/Train';
import { UtensilsCrossed } from '@/components/icons/UtensilsCrossed';
import { Compass } from '@/components/icons/Compass';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

interface ItineraryTimelineProps {
  activities: TripActivity[];
  startDate: string | null;
  endDate: string | null;
  tripStatus: string;
  activeDayIndex: number;
  onChangeDay: (index: number) => void;
  onPressItem: (activity: TripActivity) => void;
  onPressMenu: (activity: TripActivity) => void;
  onCloseMenu: () => void;
  menuOpenId: string | null;
  onPressNav: (url: string) => void;
  onEditActivity: (activity: TripActivity) => void;
  onDeleteActivity: (activity: TripActivity) => void;
  onPressAdd: () => void;
  referenceNow?: Date;
}

/** Format "HH:MM" in 24-hour wall-clock (e.g. "19:00" stays "19:00"). */
function formatTime24(time: string): string {
  return time;
}

function DayTabs({ days, activeIndex, onChange }: {
  days: { dayLabel: string; dayIndex: number }[];
  activeIndex: number;
  onChange: (i: number) => void;
}) {
  if (days.length <= 1) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayTabs} contentContainerStyle={styles.dayTabsContent}>
      {days.map((day, i) => (
        <TouchableOpacity
          key={day.dayIndex}
          style={[styles.dayTab, i === activeIndex && styles.dayTabActive]}
          onPress={() => onChange(i)}
          activeOpacity={0.7}
        >
          <Text style={[styles.dayTabText, i === activeIndex && styles.dayTabTextActive]}>
            Hari {day.dayIndex + 1}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function ActivityItemRow({
  activity,
  timeState,
  menuOpen,
  onPress,
  onPressMenu,
  onPressNav,
  onEdit,
  onDelete,
}: {
  activity: TripActivity;
  timeState: TimeState;
  menuOpen: boolean;
  onPress: () => void;
  onPressMenu: () => void;
  onPressNav: (url: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const stateMeta = TIME_STATE_META[timeState];
  const kindMeta = KIND_META[activity.kind] ?? KIND_META.activity;
  const iconMeta = getCoverIconMeta(activity.cover_icon);
  const CoverIcon = iconMeta.icon;
  const hasThumb = Boolean(activity.thumbnail_url);
  const hasCoverIcon = Boolean(activity.cover_icon);

  return (
    <View style={[styles.itemRow, { opacity: stateMeta.opacity }]}>
      {/* Timeline dot */}
      <View style={styles.dotColumn}>
        <View style={[styles.dotRing, { backgroundColor: stateMeta.ringColor }]}>
          <View style={[styles.dot, { backgroundColor: stateMeta.dotColor }]} />
        </View>
        <View style={[styles.verticalLine, { backgroundColor: stateMeta.cardBorderColor }]} />
      </View>

      {/* Card */}
      <View style={[styles.itemCardWrap, menuOpen && styles.itemCardWrapMenuOpen]}>
        <TouchableOpacity
          style={[styles.itemCard, { borderColor: stateMeta.cardBorderColor }]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.itemHeader}>
            <Text style={[styles.itemTime, { color: stateMeta.timeColor }]}>
              {formatTime24(activity.start_time)} – {formatTime24(activity.end_time)}
            </Text>
            {timeState === 'present' && (
              <View style={styles.nowBadge}>
                <Text style={styles.nowBadgeText}>Sekarang</Text>
              </View>
            )}
            <TouchableOpacity onPress={onPressMenu} style={styles.menuBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <MoreHorizontal size={16} color={menuOpen ? colors.coral : colors.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.itemContent}>
            {/* Thumbnail */}
            {hasThumb ? (
              <Image source={{ uri: activity.thumbnail_url! }} style={styles.thumbnail} resizeMode="cover" />
            ) : hasCoverIcon ? (
              <View style={[styles.thumbnail, { backgroundColor: iconMeta.bg, alignItems: 'center', justifyContent: 'center' }]}>
                <CoverIcon size={18} color={iconMeta.color} />
              </View>
            ) : (
              <View style={[styles.thumbnailPlaceholder, { backgroundColor: kindMeta.bgColor }]}>
                <KindThumb kind={activity.kind} />
              </View>
            )}

            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={1}>{activity.place_name}</Text>
              {activity.location_label && (
                <View style={styles.locationRow}>
                  <MapPin size={11} color={colors.muted} />
                  <Text style={styles.locationText} numberOfLines={1}>{activity.location_label}</Text>
                </View>
              )}
            </View>

            {(activity.kind === 'destination' || activity.kind === 'activity') && activity.maps_link && (
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => onPressNav(activity.maps_link!)}
                activeOpacity={0.7}
              >
                <ExternalLink size={14} color={colors.teal} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>

        {menuOpen && (
          <ActivityItemMenu onEdit={onEdit} onDelete={onDelete} />
        )}
      </View>
    </View>
  );
}

function GapRow({ startTime, endTime }: { startTime: string; endTime: string }) {
  return (
    <View style={styles.gapRow}>
      <View style={styles.gapDotColumn}>
        <View style={styles.gapDot} />
        <View style={[styles.verticalLine, { backgroundColor: colors.border }]} />
      </View>
      <Text style={styles.gapText}>
        {formatTime24(startTime)} – {formatTime24(endTime)} · Tidak ada aktivitas
      </Text>
    </View>
  );
}

function KindThumb({ kind }: { kind: ActivityKind }) {
  const Icon =
    kind === 'gather' ? Users
    : kind === 'transport' ? Train
    : kind === 'meal' ? UtensilsCrossed
    : kind === 'destination' ? MapPin
    : Compass;
  return <Icon size={16} color={colors.muted} />;
}

export function ItineraryTimeline({
  activities,
  startDate,
  endDate,
  tripStatus,
  activeDayIndex,
  onChangeDay,
  onPressItem,
  onPressMenu,
  onCloseMenu,
  menuOpenId,
  onPressNav,
  onEditActivity,
  onDeleteActivity,
  onPressAdd,
  referenceNow = new Date(),
}: ItineraryTimelineProps) {
  const days = buildItineraryDays(activities, startDate, endDate, tripStatus);
  const currentDay = days[activeDayIndex] ?? days[0];

  // True empty state — no activities at all (regardless of dates) → centered.
  if (activities.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <MapPin size={32} color={colors.coral} />
          </View>
          <Text style={styles.emptyTitle}>Belum ada aktivitas</Text>
          <Text style={styles.emptyDesc}>
            Susun aktivitas per hari — titik kumpul, transport, kuliner, dan destinasi. Warna timeline
            mengikuti status waktu, bukan jenis aktivitas.
          </Text>
        </View>
        <View style={styles.emptyCtaWrap}>
          <TouchableOpacity style={styles.addButton} onPress={onPressAdd} activeOpacity={0.8}>
            <Text style={styles.addButtonText}>Buat Aktivitas Pertama</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!currentDay) {
    return null;
  }

  const segments = buildTimelineSegments(currentDay);
  const totalActivities = activities.length;
  const totalDays = days.filter((d) => d.items.length > 0 || d.date).length;
  const hasItems = segments.length > 0;

  return (
    <View style={[styles.container, hasItems ? styles.containerWithItems : styles.containerEmpty]}>
      <View>
        {/* Summary */}
        <Text style={styles.summary}>
          {totalActivities} aktivitas · {totalDays} hari
        </Text>

        {/* Day tabs */}
        <DayTabs days={days} activeIndex={activeDayIndex} onChange={onChangeDay} />

        {/* Day header */}
        <Text style={styles.dayHeader}>{currentDay.dayLabel}</Text>
        <Text style={styles.windowBadge}>
          {formatTime24(currentDay.windowStart)} – {formatTime24(currentDay.windowEnd)}
        </Text>

        {/* Timeline */}
        {hasItems ? (
          <View style={styles.timeline}>
            {segments.map((seg, i) => {
              if (seg.type === 'gap') {
                return <GapRow key={`gap-${i}`} startTime={seg.startTime} endTime={seg.endTime} />;
              }

              const activity = seg.activity!;
              const timeState = resolveItineraryTimeState(
                activity.start_time,
                activity.end_time,
                activity.activity_date,
                tripStatus,
                referenceNow,
              );
              const isMenuOpen = activity.id === menuOpenId;

              return (
                <View key={activity.id} style={[styles.itemWrap, isMenuOpen && styles.itemWrapMenuOpen]}>
                  {isMenuOpen && (
                    <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={onCloseMenu} />
                  )}
                  <ActivityItemRow
                    activity={activity}
                    timeState={timeState}
                    menuOpen={isMenuOpen}
                    onPress={() => onPressItem(activity)}
                    onPressMenu={() => onPressMenu(activity)}
                    onPressNav={onPressNav}
                    onEdit={() => onEditActivity(activity)}
                    onDelete={() => onDeleteActivity(activity)}
                  />
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyDay}>
            <Text style={styles.emptyDayText}>Tidak ada aktivitas di hari ini</Text>
          </View>
        )}

        {/* Footer CTA — when empty, sits right after the empty text (pushed to center) */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton} onPress={onPressAdd} activeOpacity={0.8}>
            <Text style={styles.addButtonText}>Tambah Aktivitas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerWithItems: {
    justifyContent: 'space-between',
  },
  containerEmpty: {
    justifyContent: 'center',
  },
  summary: {
    ...typography.caption,
    color: colors.muted,
    marginBottom: 12,
  },
  dayTabs: {
    marginBottom: 12,
  },
  dayTabsContent: {
    gap: 8,
  },
  dayTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayTabActive: {
    backgroundColor: colors.coralLight,
    borderColor: colors.coral,
  },
  dayTabText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  dayTabTextActive: {
    color: colors.coral,
  },
  dayHeader: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
    marginBottom: 2,
  },
  windowBadge: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.mutedLight,
    marginBottom: 16,
  },
  timeline: {
    gap: 0,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  itemWrap: {
    flex: 1,
    position: 'relative',
  },
  itemWrapMenuOpen: {
    zIndex: 50,
  },
  menuOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 40,
  },
  dotColumn: {
    width: 28,
    alignItems: 'center',
  },
  dotRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    minHeight: 16,
  },
  itemCard: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    backgroundColor: colors.white,
  },
  itemCardWrap: {
    flex: 1,
    position: 'relative',
  },
  itemCardWrapMenuOpen: {
    zIndex: 30,
    overflow: 'visible',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTime: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  nowBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.coralLight,
  },
  nowBadgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.coral,
  },
  menuBtn: {
    marginLeft: 'auto',
    padding: 4,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 10,
  },
  thumbnailPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    letterSpacing: -0.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  locationText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    flex: 1,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  gapRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gapDotColumn: {
    width: 28,
    alignItems: 'center',
  },
  gapDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.mutedLight,
  },
  gapText: {
    marginLeft: 10,
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.mutedLight,
    marginBottom: 12,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyCtaWrap: {
    paddingBottom: 8,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.coralLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    marginBottom: 8,
  },
  emptyDesc: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyDay: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyDayText: {
    ...typography.body,
    color: colors.muted,
  },
  footer: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  addButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.coral,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
});

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
import { Navigation } from '@/components/icons/Navigation';
import { Users } from '@/components/icons/Users';
import { Train } from '@/components/icons/Train';
import { UtensilsCrossed } from '@/components/icons/UtensilsCrossed';
import { Compass } from '@/components/icons/Compass';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';
import { typography } from '@/theme/typography';
import { MONTH_NAMES_FULL } from '@/features/trips/components/TripDateUtils';

interface ItineraryTimelineProps {
  activities: TripActivity[];
  startDate: string | null;
  endDate: string | null;
  tripStatus: string;
  /** Trip-level wall-clock start/end (HH:MM) — used for the day window badge. */
  tripStartTime?: string | null;
  tripEndTime?: string | null;
  /** Trip is all-day — the day window badge shows "00:00 – 24:00". */
  tripIsAllDay?: boolean;
  activeDayIndex: number;
  onChangeDay: (index: number) => void;
  onPressItem: (activity: TripActivity) => void;
  onPressMenu: (activity: TripActivity) => void;
  onCloseMenu: () => void;
  menuOpenId: string | null;
  onPressNav: (url: string) => void;
  onEditActivity: (activity: TripActivity) => void;
  onDeleteActivity: (activity: TripActivity) => void;
  referenceNow?: Date;
}

function formatTime24(time: string): string {
  return time;
}

function parseDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  return new Date(+parts[0], +parts[1] - 1, +parts[2]);
}

function formatDateForHeader(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseDate(dateStr);
  const dayName = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][d.getDay()];
  return `${dayName}, ${d.getDate()} ${MONTH_NAMES_FULL[d.getMonth()]} ${d.getFullYear()}`;
}

function DayTabs({ days, activeIndex, onChange }: {
  days: { dayNumber: number; label: string }[];
  activeIndex: number;
  onChange: (i: number) => void;
}) {
  if (days.length <= 1) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayTabs} contentContainerStyle={styles.dayTabsContent}>
      {days.map((day, i) => (
        <TouchableOpacity
          key={day.dayNumber}
          style={[styles.dayTab, i === activeIndex && styles.dayTabActive]}
          onPress={() => onChange(i)}
          activeOpacity={0.7}
        >
          <Text style={[styles.dayTabText, i === activeIndex && styles.dayTabTextActive]}>
            Hari {day.dayNumber}
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
  const isPresent = timeState === 'present';

  return (
    <View style={[styles.itemRow, { opacity: stateMeta.opacity }]}>
      <View style={styles.dotColumn}>
        <View style={[styles.dotRing, { backgroundColor: stateMeta.ringColor }]}>
          <View
            style={[
              styles.dot,
              isPresent && styles.dotPresent,
              { backgroundColor: stateMeta.dotColor },
            ]}
          />
        </View>
        <View style={[styles.verticalLine, { backgroundColor: stateMeta.cardBorderColor }]} />
      </View>

      <View style={[styles.itemCardWrap, menuOpen && styles.itemCardWrapMenuOpen]}>
        <TouchableOpacity
          style={[
            styles.itemCard,
            { borderColor: stateMeta.cardBorderColor },
            isPresent && styles.itemCardPresent,
          ]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.itemHeader}>
            <Text style={[styles.itemTime, { color: stateMeta.timeColor }]}>
              {formatTime24(activity.start_time)} – {formatTime24(activity.end_time)}
            </Text>
            {isPresent && (
              <View style={styles.nowBadge}>
                <Text style={styles.nowBadgeText}>Sekarang</Text>
              </View>
            )}
            <TouchableOpacity onPress={onPressMenu} style={styles.menuBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <MoreHorizontal size={16} color={menuOpen ? colors.coral : colors.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.itemContent}>
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
                style={[styles.navButton, isPresent && styles.navButtonPresent]}
                onPress={() => onPressNav(activity.maps_link!)}
                activeOpacity={0.7}
              >
                <Navigation size={15} color={isPresent ? colors.coral : colors.teal} />
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
  tripStartTime,
  tripEndTime,
  tripIsAllDay = false,
  activeDayIndex,
  onChangeDay,
  onPressItem,
  onPressMenu,
  onCloseMenu,
  menuOpenId,
  onPressNav,
  onEditActivity,
  onDeleteActivity,
  referenceNow = new Date(),
}: ItineraryTimelineProps) {
  const days = buildItineraryDays(activities, startDate, endDate, tripStatus, tripStartTime, tripEndTime, tripIsAllDay);
  const currentDay = days[activeDayIndex] ?? days[0];

  if (!currentDay) {
    return null;
  }

  const segments = buildTimelineSegments(currentDay, tripIsAllDay);
  const hasItems = segments.length > 0;

  // Date for the header (computed from startDate + dayNumber - 1)
  const dateForHeader = currentDay.date ? formatDateForHeader(currentDay.date) : 'Tanggal belum ditentukan';

  // Tab data
  const tabData = days.map((d) => ({ dayNumber: d.dayNumber, label: `Hari ${d.dayNumber}` }));

  return (
    <View style={styles.container}>
      <View>
        {/* Day tabs */}
        <DayTabs days={tabData} activeIndex={activeDayIndex} onChange={onChangeDay} />

        {/* Day header — date left, time badge right */}
        <View style={styles.dayHeaderRow}>
          <View style={styles.dayHeaderTexts}>
            <Text style={styles.dayDate}>{dateForHeader}</Text>
          </View>
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>
              {formatTime24(currentDay.windowStart)} – {formatTime24(currentDay.windowEnd)}
            </Text>
          </View>
        </View>

        {/* Timeline or empty state */}
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
                activity.activity_date ?? currentDay.date,
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
          <View style={styles.emptyStateWrap}>
            <View style={styles.emptyStateIconBox}>
              <MapPin size={32} color={colors.coral} />
            </View>
            <Text style={styles.emptyStateTitle}>Belum ada aktivitas</Text>
            <Text style={styles.emptyStateDesc}>
              Susun aktivitas per hari — titik kumpul, transport, kuliner, dan destinasi. Warna timeline
              mengikuti status waktu, bukan jenis aktivitas.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dayTabs: {
    marginBottom: 8,
  },
  dayTabsContent: {
    gap: 6,
  },
  dayTab: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayTabActive: {
    backgroundColor: colors.coralLight,
    borderColor: colors.coral,
  },
  dayTabText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
  },
  dayTabTextActive: {
    color: colors.coral,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  // Day header — row with date left, time badge right
  dayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  dayHeaderTexts: {
    flex: 1,
  },
  dayDate: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
  },
  timeBadge: {
    backgroundColor: colors.light,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  timeBadgeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.muted,
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
  dotPresent: {
    width: 14,
    height: 14,
    borderRadius: 7,
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
    ...shadows.card,
  },
  itemCardPresent: {
    shadowColor: colors.coral,
    shadowOpacity: 0.13,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
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
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
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
  navButtonPresent: {
    backgroundColor: colors.coralLight,
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
  // Empty state (below day header)
  emptyStateWrap: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 32,
  },
  emptyStateIconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.coralLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    marginBottom: 8,
  },
  emptyStateDesc: {
    ...typography.body,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

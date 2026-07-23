import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import type { TripActivity, ActivityKind } from '@atur-perjalanan/shared-types';
import {
  buildItineraryDays,
  buildTimelineSegments,
  resolveItineraryTimeState,
  KIND_META,
  TIME_STATE_META,
  type TimeState,
} from '../utils/itineraryUtils';
import { MapPin } from '@/components/icons/MapPin';
import { MoreHorizontal } from '@/components/icons/MoreHorizontal';
import { ExternalLink } from '@/components/icons/ExternalLink';
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
  onPressAdd: () => void;
  referenceNow?: Date;
}

function formatTime12(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${String(m).padStart(2, '0')}`;
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
  onPress,
  onPressMenu,
}: {
  activity: TripActivity;
  timeState: TimeState;
  onPress: () => void;
  onPressMenu: () => void;
}) {
  const stateMeta = TIME_STATE_META[timeState];
  const kindMeta = KIND_META[activity.kind] ?? KIND_META.activity;

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
      <TouchableOpacity
        style={[styles.itemCard, { borderColor: stateMeta.cardBorderColor }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.itemHeader}>
          <Text style={[styles.itemTime, { color: stateMeta.timeColor }]}>
            {formatTime12(activity.start_time)} – {formatTime12(activity.end_time)}
          </Text>
          {timeState === 'present' && (
            <View style={styles.nowBadge}>
              <Text style={styles.nowBadgeText}>Sekarang</Text>
            </View>
          )}
          <TouchableOpacity onPress={onPressMenu} style={styles.menuBtn}>
            <MoreHorizontal size={16} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.itemContent}>
          {/* Thumbnail */}
          {activity.thumbnail_url ? (
            <Image source={{ uri: activity.thumbnail_url }} style={styles.thumbnail} />
          ) : (
            <View style={[styles.thumbnailPlaceholder, { backgroundColor: kindMeta.bgColor }]}>
              <Text style={{ fontSize: 18 }}>{getKindEmoji(activity.kind)}</Text>
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
            <TouchableOpacity style={styles.navButton}>
              <ExternalLink size={14} color={colors.teal} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
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
        {formatTime12(startTime)} – {formatTime12(endTime)} · Tidak ada aktivitas
      </Text>
    </View>
  );
}

function getKindEmoji(kind: ActivityKind): string {
  switch (kind) {
    case 'gather': return '🤝';
    case 'transport': return '🚌';
    case 'meal': return '🍽️';
    case 'activity': return '🎯';
    case 'destination': return '📍';
    default: return '📌';
  }
}

import { ScrollView } from 'react-native';

export function ItineraryTimeline({
  activities,
  startDate,
  endDate,
  tripStatus,
  activeDayIndex,
  onChangeDay,
  onPressItem,
  onPressMenu,
  onPressAdd,
  referenceNow = new Date(),
}: ItineraryTimelineProps) {
  const days = buildItineraryDays(activities, startDate, endDate, tripStatus);
  const currentDay = days[activeDayIndex] ?? days[0];

  if (!currentDay) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBox}>
          <Text style={{ fontSize: 28 }}>📋</Text>
        </View>
        <Text style={styles.emptyTitle}>Belum ada aktivitas</Text>
        <Text style={styles.emptyDesc}>Tambahkan aktivitas pertama untuk memulai itinerary.</Text>
        <TouchableOpacity style={styles.addButton} onPress={onPressAdd} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>Buat Aktivitas Pertama</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const segments = buildTimelineSegments(currentDay);
  const totalActivities = activities.length;
  const totalDays = days.filter((d) => d.items.length > 0 || d.date).length;

  return (
    <View style={styles.container}>
      {/* Summary */}
      <Text style={styles.summary}>
        {totalActivities} aktivitas · {totalDays} hari
      </Text>

      {/* Day tabs */}
      <DayTabs days={days} activeIndex={activeDayIndex} onChange={onChangeDay} />

      {/* Day header */}
      <Text style={styles.dayHeader}>{currentDay.dayLabel}</Text>
      <Text style={styles.windowBadge}>
        {formatTime12(currentDay.windowStart)} – {formatTime12(currentDay.windowEnd)}
      </Text>

      {/* Timeline */}
      {segments.length === 0 ? (
        <View style={styles.emptyDay}>
          <Text style={styles.emptyDayText}>Tidak ada aktivitas di hari ini</Text>
        </View>
      ) : (
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

            return (
              <ActivityItemRow
                key={activity.id}
                activity={activity}
                timeState={timeState}
                onPress={() => onPressItem(activity)}
                onPressMenu={() => onPressMenu(activity)}
              />
            );
          })}
        </View>
      )}

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={onPressAdd} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>Tambah Aktivitas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingHorizontal: 40,
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

import type { TripActivity, ActivityKind } from '@atur-perjalanan/shared-types';
import { getDaysInRange, getDayLabel } from '@/features/trips/components/TripDateUtils';

export type TimeState = 'past' | 'present' | 'future' | 'scheduled';

export interface ItineraryDay {
  date: string;
  dayLabel: string;
  dayIndex: number;
  windowStart: string;
  windowEnd: string;
  items: TripActivity[];
}

export interface TimelineSegment {
  type: 'item' | 'gap';
  startTime: string;
  endTime: string;
  activity?: TripActivity;
}

const DEFAULT_WINDOW_START = '07:00';
const DEFAULT_WINDOW_END = '20:00';

export function resolveItineraryTimeState(
  startTime: string,
  endTime: string,
  activityDate: string | null,
  tripStatus: string,
  referenceNow: Date,
): TimeState {
  if (tripStatus === 'voting_pending' || !activityDate) {
    return 'scheduled';
  }

  const now = referenceNow;
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  if (activityDate < todayStr) return 'past';
  if (activityDate > todayStr) return 'future';

  // Same day — check time
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) return 'present';
  if (nowMinutes > endMinutes) return 'past';
  return 'future';
}

export function buildItineraryDays(
  activities: TripActivity[],
  startDate: string | null,
  endDate: string | null,
  tripStatus: string,
): ItineraryDay[] {
  if (!startDate || !endDate) {
    // No dates (voting pending) — group all activities as a single day
    const sorted = [...activities].sort((a, b) => a.start_time.localeCompare(b.start_time));
    return [{
      date: '',
      dayLabel: 'Tanggal sedang divoting',
      dayIndex: 0,
      windowStart: DEFAULT_WINDOW_START,
      windowEnd: DEFAULT_WINDOW_END,
      items: sorted,
    }];
  }

  const days = getDaysInRange(startDate, endDate);
  return days.map((date, i) => {
    const dayActivities = activities
      .filter((a) => a.activity_date === date)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    return {
      date,
      dayLabel: getDayLabel(date, i),
      dayIndex: i,
      windowStart: DEFAULT_WINDOW_START,
      windowEnd: DEFAULT_WINDOW_END,
      items: dayActivities,
    };
  });
}

export function buildTimelineSegments(day: ItineraryDay): TimelineSegment[] {
  const segments: TimelineSegment[] = [];
  const items = day.items;

  if (items.length === 0) return segments;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Check gap before this item
    if (i === 0 && item.start_time > day.windowStart) {
      segments.push({
        type: 'gap',
        startTime: day.windowStart,
        endTime: item.start_time,
      });
    } else if (i > 0) {
      const prevEnd = items[i - 1].end_time;
      if (item.start_time > prevEnd) {
        segments.push({
          type: 'gap',
          startTime: prevEnd,
          endTime: item.start_time,
        });
      }
    }

    segments.push({
      type: 'item',
      startTime: item.start_time,
      endTime: item.end_time,
      activity: item,
    });
  }

  return segments;
}

export const KIND_META: Record<ActivityKind, { label: string; color: string; bgColor: string }> = {
  gather: { label: 'Kumpul', color: '#8B7CF6', bgColor: '#EEF0FA' },
  transport: { label: 'Transportasi', color: '#5B6ABF', bgColor: '#EEF0FA' },
  meal: { label: 'Makan', color: '#E09B3D', bgColor: '#FFF6E8' },
  activity: { label: 'Aktivitas', color: '#4ECDC4', bgColor: '#EDF9F8' },
  destination: { label: 'Destinasi', color: '#FF6B6B', bgColor: '#FFF0F0' },
};

export const TIME_STATE_META: Record<TimeState, {
  dotColor: string;
  ringColor: string;
  timeColor: string;
  cardBorderColor: string;
  opacity: number;
}> = {
  past: {
    dotColor: '#B8B9C6',
    ringColor: '#F7F7FB',
    timeColor: '#9091A0',
    cardBorderColor: '#EBEBF2',
    opacity: 0.72,
  },
  present: {
    dotColor: '#FF6B6B',
    ringColor: '#FFF0F0',
    timeColor: '#FF6B6B',
    cardBorderColor: 'rgba(255,107,107,0.34)',
    opacity: 1,
  },
  future: {
    dotColor: '#4ECDC4',
    ringColor: '#EDF9F8',
    timeColor: '#4ECDC4',
    cardBorderColor: 'rgba(78,205,196,0.22)',
    opacity: 1,
  },
  scheduled: {
    dotColor: '#9091A0',
    ringColor: '#F7F7FB',
    timeColor: '#9091A0',
    cardBorderColor: '#EBEBF2',
    opacity: 1,
  },
};

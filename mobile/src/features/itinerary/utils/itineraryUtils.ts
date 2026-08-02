import type { TripActivity, ActivityKind } from '@atur-perjalanan/shared-types';
import { getDaysInRange, getDayLabel } from '@/features/trips/components/TripDateUtils';

export type TimeState = 'past' | 'present' | 'future' | 'scheduled';

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  dayLabel: string;
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
  // Group activities by day_number
  const dayMap = new Map<number, TripActivity[]>();
  for (const activity of activities) {
    const dn = activity.day_number ?? 1;
    if (!dayMap.has(dn)) dayMap.set(dn, []);
    dayMap.get(dn)!.push(activity);
  }

  // Compute total trip days from date range (for fixed trips)
  let tripDays = 1;
  if (startDate && endDate) {
    const days = getDaysInRange(startDate, endDate);
    tripDays = days.length;
  }

  // Max day_number from activities (at least 1)
  const maxActivityDay = dayMap.size > 0 ? Math.max(...dayMap.keys()) : 1;

  // Total days = max of trip duration or highest activity day_number
  const totalDays = Math.max(tripDays, maxActivityDay);

  // Build day entries
  const result: ItineraryDay[] = [];
  const daysRange = startDate ? getDaysInRange(startDate, endDate ?? startDate) : null;

  for (let i = 0; i < totalDays; i++) {
    const dayNumber = i + 1;
    const items = (dayMap.get(dayNumber) ?? []).sort((a, b) =>
      a.start_time.localeCompare(b.start_time),
    );

    const date = daysRange?.[i] ?? '';
    const dayLabel = tripStatus === 'voting_pending' || !date
      ? `Hari ${dayNumber}`
      : getDayLabel(date, i);

    // Window: extend to 24:00 when a next day exists, start at 00:00 when a previous day exists.
    const hasNextDay = dayNumber < totalDays;
    const hasPrevDay = dayNumber > 1;
    const windowStart = hasPrevDay ? '00:00' : DEFAULT_WINDOW_START;
    const windowEnd = hasNextDay ? '24:00' : DEFAULT_WINDOW_END;

    result.push({
      dayNumber,
      date,
      dayLabel,
      windowStart,
      windowEnd,
      items,
    });
  }

  // If no activities and no dates, show a single day
  if (result.length === 0) {
    result.push({
      dayNumber: 1,
      date: '',
      dayLabel: tripStatus === 'voting_pending' ? 'Hari 1' : 'Hari 1',
      windowStart: DEFAULT_WINDOW_START,
      windowEnd: DEFAULT_WINDOW_END,
      items: [],
    });
  }

  return result;
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

  // Trailing gap: after the last activity until the day window ends.
  const lastItem = items[items.length - 1];
  if (lastItem.end_time < day.windowEnd) {
    segments.push({
      type: 'gap',
      startTime: lastItem.end_time,
      endTime: day.windowEnd,
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
    timeColor: '#1A1A2E',
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

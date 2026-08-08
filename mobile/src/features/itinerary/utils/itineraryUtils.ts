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

/** Parse "HH:MM" into minutes since midnight. */
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** True when an activity's end time is earlier than its start time (spans midnight). */
function spansMidnight(activity: TripActivity): boolean {
  return toMinutes(activity.end_time) < toMinutes(activity.start_time);
}

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

  // Activity spans midnight (e.g. 13:00 -> 12:00 the next day): "now" is within
  // the activity from start until midnight, and from midnight until end.
  if (endMinutes < startMinutes) {
    if (nowMinutes >= startMinutes) return 'present';
    if (nowMinutes < endMinutes) return 'present';
    return 'past';
  }

  if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) return 'present';
  if (nowMinutes > endMinutes) return 'past';
  return 'future';
}

export function buildItineraryDays(
  activities: TripActivity[],
  startDate: string | null,
  endDate: string | null,
  tripStatus: string,
  tripStartTime?: string | null,
  tripEndTime?: string | null,
  tripIsAllDay = false,
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

    // Window: start at the earliest activity start (default 07:00 when empty),
    // end at the latest activity end. For multi-day trips the window extends to
    // midnight so an activity spanning midnight (e.g. 13:00 -> 12:00) isn't
    // clamped to the default 07:00–20:00 window.
    const hasNextDay = dayNumber < totalDays;
    const hasPrevDay = dayNumber > 1;

    // Window basis: all-day trips span the full day; otherwise trip-level times
    // when provided (e.g. "14:00 – 12:00"), else the default day window.
    // Activities may still widen the window.
    let windowStart = tripIsAllDay ? '00:00' : tripStartTime || DEFAULT_WINDOW_START;
    let windowEnd = tripIsAllDay ? '24:00' : tripEndTime || DEFAULT_WINDOW_END;
    if (hasPrevDay) windowStart = '00:00';
    if (hasNextDay) windowEnd = '24:00';

    for (const item of items) {
      const startMin = toMinutes(item.start_time);
      if (startMin < toMinutes(windowStart)) windowStart = item.start_time;
      if (spansMidnight(item)) {
        // Spans into the next day — keep the window open to midnight so the
        // activity isn't cut off by the default end.
        windowEnd = '24:00';
      } else {
        const endMin = toMinutes(item.end_time);
        if (endMin > toMinutes(windowEnd)) windowEnd = item.end_time;
      }
    }

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
      windowStart: tripIsAllDay ? '00:00' : DEFAULT_WINDOW_START,
      windowEnd: tripIsAllDay ? '24:00' : DEFAULT_WINDOW_END,
      items: [],
    });
  }

  return result;
}

export function buildTimelineSegments(day: ItineraryDay, isAllDay = false): TimelineSegment[] {
  const segments: TimelineSegment[] = [];
  const items = day.items;

  if (items.length === 0) return segments;

  // Sort: activities that don't span midnight by start time first, then
  // midnight-spanning ones (they're the "last" event of the day).
  const sorted = [...items].sort((a, b) => {
    const aSpans = spansMidnight(a);
    const bSpans = spansMidnight(b);
    if (aSpans !== bSpans) return aSpans ? 1 : -1;
    return toMinutes(a.start_time) - toMinutes(b.start_time);
  });

  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];

    // Gap before this item. Skipped for all-day trips — the window spans the
    // whole day, so a leading "00:00 – 09:00 · Tidak ada aktivitas" is noise.
    if (i === 0) {
      const prevEnd = day.windowStart;
      const startMin = toMinutes(item.start_time);
      if (!isAllDay && !spansMidnight(item) && startMin > toMinutes(prevEnd)) {
        segments.push({
          type: 'gap',
          startTime: prevEnd,
          endTime: item.start_time,
        });
      }
    } else {
      const prev = sorted[i - 1];
      const prevEnd = prev.end_time;
      const startMin = toMinutes(item.start_time);
      // If the previous item spans midnight (ends "tomorrow"), no gap — this
      // item would overlap the day start; also skip when the item itself spans
      // midnight (it's last, nothing after it).
      if (!spansMidnight(prev) && !spansMidnight(item) && startMin > toMinutes(prevEnd)) {
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

  // Trailing gap: after the last activity until the day window ends — but only
  // when the last item doesn't span midnight (those end "tomorrow", past the
  // window) and the trip isn't all-day (full-day window makes this gap noise).
  const lastItem = sorted[sorted.length - 1];
  if (!isAllDay && !spansMidnight(lastItem) && toMinutes(lastItem.end_time) < toMinutes(day.windowEnd)) {
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

import type { ReactNode } from 'react';
import {
  Plus,
  Users,
  Train,
  UtensilsCrossed,
  MapPin,
  Navigation,
  MoreHorizontal,
} from 'lucide-react';
import { C, FONT } from '../colors';
import { DestinationThumbnail } from './DestinationParts';
import {
  ActivityTimelineThumb,
  ActivityItemMenuSheet,
  type ActivityCoverIcon,
} from './ActivityParts';
import { TRIP_IMAGES } from '../tripImages';

export type ItineraryItemKind = 'gather' | 'transport' | 'meal' | 'activity' | 'destination';

/** Status waktu aktivitas di timeline — bukan warna pilihan user */
export type ItineraryTimeState = 'past' | 'present' | 'future' | 'scheduled';

export type ItineraryReferenceNow = {
  dayId: number;
  time: string;
};

export type ItineraryCoverIcon = ActivityCoverIcon;

export type ItineraryItem = {
  id: number;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  location?: string;
  kind?: ItineraryItemKind;
  gmapsThumbUrl?: string;
  coverIcon?: ItineraryCoverIcon;
  /** Override demo — default dihitung dari jam sekarang trip */
  timeState?: ItineraryTimeState;
};

export type ItineraryDay = {
  id: number;
  dateLabel: string;
  dayLabel?: string;
  windowStart: string;
  windowEnd: string;
  items: ItineraryItem[];
};

const KIND_META: Record<ItineraryItemKind, { icon: typeof MapPin }> = {
  gather: { icon: Users },
  transport: { icon: Train },
  meal: { icon: UtensilsCrossed },
  activity: { icon: MapPin },
  destination: { icon: MapPin },
};

export const ITINERARY_TIME_STATE_META: Record<
  ItineraryTimeState,
  {
    label: string;
    dotColor: string;
    dotRing: string;
    timeColor: string;
    cardBorder: string;
    cardOpacity: number;
  }
> = {
  past: {
    label: 'Selesai',
    dotColor: C.mutedLight,
    dotRing: C.light,
    timeColor: C.muted,
    cardBorder: C.border,
    cardOpacity: 0.72,
  },
  present: {
    label: 'Berlangsung',
    dotColor: C.coral,
    dotRing: C.coralLight,
    timeColor: C.coral,
    cardBorder: `${C.coral}55`,
    cardOpacity: 1,
  },
  future: {
    label: 'Akan datang',
    dotColor: C.teal,
    dotRing: C.tealLight,
    timeColor: C.teal,
    cardBorder: `${C.teal}35`,
    cardOpacity: 1,
  },
  scheduled: {
    label: 'Terjadwal',
    dotColor: C.muted,
    dotRing: C.light,
    timeColor: C.muted,
    cardBorder: C.border,
    cardOpacity: 1,
  },
};

export function getItineraryKindIcon(kind?: ItineraryItemKind) {
  return KIND_META[kind ?? 'activity'].icon;
}

export function resolveItineraryTimeState(
  item: ItineraryItem,
  dayId: number,
  options: { datePending?: boolean; referenceNow?: ItineraryReferenceNow },
): ItineraryTimeState {
  if (item.timeState) return item.timeState;
  if (options.datePending) return 'scheduled';

  const referenceNow = options.referenceNow;
  if (!referenceNow) return 'scheduled';

  if (dayId < referenceNow.dayId) return 'past';
  if (dayId > referenceNow.dayId) return 'future';

  const now = timeToMinutes(referenceNow.time);
  const start = timeToMinutes(item.startTime);
  const end = timeToMinutes(item.endTime);
  if (end <= now) return 'past';
  if (start > now) return 'future';
  return 'present';
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export type ItineraryTimelineSegment =
  { kind: 'gap'; startTime: string; endTime: string } | { kind: 'item'; item: ItineraryItem };

export function buildItineraryTimeline(day: ItineraryDay): ItineraryTimelineSegment[] {
  const segments: ItineraryTimelineSegment[] = [];
  const windowStart = timeToMinutes(day.windowStart);
  const windowEnd = timeToMinutes(day.windowEnd);
  const sorted = [...day.items].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
  );

  let cursor = windowStart;
  for (const item of sorted) {
    const itemStart = timeToMinutes(item.startTime);
    const itemEnd = timeToMinutes(item.endTime);
    if (itemStart > cursor) {
      segments.push({
        kind: 'gap',
        startTime: minutesToTime(cursor),
        endTime: minutesToTime(itemStart),
      });
    }
    segments.push({ kind: 'item', item });
    cursor = Math.max(cursor, itemEnd);
  }
  if (cursor < windowEnd) {
    segments.push({
      kind: 'gap',
      startTime: minutesToTime(cursor),
      endTime: minutesToTime(windowEnd),
    });
  }
  return segments;
}

/** Itinerary Lombok — tanggal belum ditentukan (voting berjalan) */
export const LOMBOK_ITINERARY_PENDING_DAY: ItineraryDay = {
  id: 1,
  dateLabel: 'Tanggal belum ditentukan',
  dayLabel: 'Hari 1',
  windowStart: '07:00',
  windowEnd: '20:00',
  items: [
    {
      id: 1,
      startTime: '07:00',
      endTime: '08:30',
      title: 'Berkumpul di Bandara Lombok',
      location: 'Praya, NTB',
      kind: 'gather',
    },
    {
      id: 2,
      startTime: '09:00',
      endTime: '11:00',
      title: 'Perjalanan ke penginapan',
      description: 'Van sewa',
      kind: 'transport',
      coverIcon: 'bus',
    },
    {
      id: 3,
      startTime: '13:00',
      endTime: '16:00',
      title: 'Pantai Tiga Warna',
      location: 'Lombok Timur, NTB',
      kind: 'destination',
      gmapsThumbUrl: TRIP_IMAGES.giliBeach,
    },
    {
      id: 4,
      startTime: '16:30',
      endTime: '18:30',
      title: 'Bukit Merese',
      location: 'Lombok Tengah, NTB',
      kind: 'destination',
    },
  ],
};

/** Itinerary Lombok — hari 1 (tanggal sudah pasti) */
export const LOMBOK_ITINERARY_DAY_1: ItineraryDay = {
  id: 1,
  dateLabel: '12 Juni 2026',
  dayLabel: 'Hari 1',
  windowStart: '07:00',
  windowEnd: '20:00',
  items: [
    {
      id: 1,
      startTime: '07:00',
      endTime: '08:30',
      title: 'Berkumpul di Bandara Lombok',
      location: 'Praya, NTB',
      kind: 'gather',
    },
    {
      id: 2,
      startTime: '09:00',
      endTime: '11:00',
      title: 'Perjalanan ke penginapan',
      description: 'Van sewa',
      kind: 'transport',
      coverIcon: 'bus',
    },
    {
      id: 3,
      startTime: '13:00',
      endTime: '16:00',
      title: 'Pantai Tiga Warna',
      location: 'Malang / alternatif: Pink Beach',
      kind: 'destination',
      gmapsThumbUrl: TRIP_IMAGES.giliBeach,
    },
    {
      id: 4,
      startTime: '16:30',
      endTime: '18:30',
      title: 'Bukit Merese',
      location: 'Lombok Tengah',
      kind: 'destination',
    },
  ],
};

export const LOMBOK_ITINERARY_DAY_2: ItineraryDay = {
  id: 2,
  dateLabel: '13 Juni 2026',
  dayLabel: 'Hari 2',
  windowStart: '08:00',
  windowEnd: '18:00',
  items: [
    { id: 5, startTime: '08:30', endTime: '10:00', title: 'Sarapan & check-out', kind: 'meal' },
    {
      id: 6,
      startTime: '10:30',
      endTime: '14:00',
      title: 'Air Terjun Benang Stokel',
      location: 'Lombok Tengah',
      kind: 'destination',
    },
  ],
};

/** Judul & kandidat voting aktivitas itinerary */
export const ITINERARY_VOTING_TITLE = 'Kulineran siang · Hari 1';
export const ITINERARY_VOTING_CANDIDATES = [
  'Warung Plecing Arjuna',
  'Bebek Sinjay Doyok',
  'Coto Makassar Bang Ipul',
];

function ItineraryGapRow({ startTime, endTime }: { startTime: string; endTime: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
      <div style={{ width: 44, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            border: `2px dashed ${C.mutedLight}`,
            backgroundColor: C.white,
            flexShrink: 0,
          }}
        />
      </div>
      <p style={{ fontSize: 11, color: C.mutedLight, margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
        <span style={{ fontWeight: 700, color: C.muted }}>
          {startTime} – {endTime}
        </span>
        {' · '}
        Tidak ada aktivitas
      </p>
    </div>
  );
}

function ItineraryTimeStateLegend() {
  const states: ItineraryTimeState[] = ['past', 'present', 'future'];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
      {states.map((state) => {
        const meta = ITINERARY_TIME_STATE_META[state];
        return (
          <span
            key={state}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 10,
              fontWeight: 600,
              color: C.muted,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: meta.dotColor,
                boxShadow: `0 0 0 2px ${meta.dotRing}`,
                flexShrink: 0,
              }}
            />
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}

function ItineraryItemRow({
  item,
  timeState,
  menuOpen = false,
}: {
  item: ItineraryItem;
  timeState: ItineraryTimeState;
  menuOpen?: boolean;
}) {
  const kind = item.kind ?? 'activity';
  const stateMeta = ITINERARY_TIME_STATE_META[timeState];
  const isPresent = timeState === 'present';

  return (
    <div style={{ display: 'flex', gap: 12, opacity: stateMeta.cardOpacity }}>
      <div
        style={{
          width: 44,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: isPresent ? 14 : 12,
            height: isPresent ? 14 : 12,
            borderRadius: '50%',
            backgroundColor: stateMeta.dotColor,
            boxShadow: `0 0 0 3px ${stateMeta.dotRing}`,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, width: 2, backgroundColor: C.border, marginTop: 4 }} />
      </div>

      <div
        style={{
          flex: 1,
          marginBottom: 12,
          backgroundColor: C.white,
          borderRadius: 16,
          padding: '12px 14px',
          border: `1.5px solid ${stateMeta.cardBorder}`,
          boxShadow: isPresent ? `0 6px 20px ${C.coral}22` : `0 4px 16px ${C.shadow}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <ActivityTimelineThumb item={item} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 3,
                flexWrap: 'wrap',
              }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, color: stateMeta.timeColor, margin: 0 }}>
                {item.startTime} – {item.endTime}
              </p>
              {isPresent && (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: C.coral,
                    backgroundColor: C.coralLight,
                    padding: '2px 7px',
                    borderRadius: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.3,
                  }}
                >
                  Sekarang
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: C.charcoal,
                margin: 0,
                letterSpacing: -0.2,
              }}
            >
              {item.title}
            </p>
            {item.description && (
              <p style={{ fontSize: 11, color: C.muted, margin: '3px 0 0', fontWeight: 500 }}>
                {item.description}
              </p>
            )}
            {item.location && (
              <p style={{ fontSize: 11, color: C.muted, margin: '3px 0 0', fontWeight: 500 }}>
                {item.location}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {(kind === 'destination' || kind === 'activity') && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: isPresent ? C.coralLight : C.light,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Navigation size={14} color={isPresent ? C.coral : C.muted} strokeWidth={2.5} />
              </div>
            )}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: menuOpen ? C.coralLight : C.light,
                  border: menuOpen ? `1.5px solid ${C.coral}` : '1.5px solid transparent',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: menuOpen ? `0 2px 8px ${C.coral}25` : 'none',
                }}
              >
                <MoreHorizontal size={14} color={menuOpen ? C.coral : C.muted} />
              </div>
              {menuOpen && <ActivityItemMenuSheet />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ItineraryDayTimelineProps = {
  day: ItineraryDay;
  datePending?: boolean;
  menuOpenItemId?: number;
  referenceNow?: ItineraryReferenceNow;
  showStateLegend?: boolean;
};

export function ItineraryDayTimeline({
  day,
  datePending = false,
  menuOpenItemId,
  referenceNow,
  showStateLegend = false,
}: ItineraryDayTimelineProps) {
  const segments = buildItineraryTimeline(day);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
          gap: 8,
        }}
      >
        <div>
          {day.dayLabel && (
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.coral,
                margin: '0 0 2px',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {day.dayLabel}
            </p>
          )}
          {!datePending && (
            <p
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: C.charcoal,
                margin: 0,
              }}
            >
              {day.dateLabel}
            </p>
          )}
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: C.muted,
            backgroundColor: C.light,
            padding: '5px 10px',
            borderRadius: 10,
            whiteSpace: 'nowrap',
          }}
        >
          {day.windowStart} – {day.windowEnd}
        </span>
      </div>

      {showStateLegend && !datePending && <ItineraryTimeStateLegend />}

      <div>
        {segments.map((segment, idx) =>
          segment.kind === 'gap' ? (
            <ItineraryGapRow
              key={`gap-${segment.startTime}-${idx}`}
              startTime={segment.startTime}
              endTime={segment.endTime}
            />
          ) : (
            <ItineraryItemRow
              key={segment.item.id}
              item={segment.item}
              timeState={resolveItineraryTimeState(segment.item, day.id, {
                datePending,
                referenceNow,
              })}
              menuOpen={segment.item.id === menuOpenItemId}
            />
          ),
        )}
      </div>
    </div>
  );
}

type ItineraryDayTabsProps = {
  days: ItineraryDay[];
  activeDayId: number;
};

export function ItineraryDayTabs({ days, activeDayId }: ItineraryDayTabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        marginBottom: 16,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      {days.map((day) => {
        const active = day.id === activeDayId;
        return (
          <div
            key={day.id}
            style={{
              padding: '8px 14px',
              borderRadius: 12,
              backgroundColor: active ? C.coralLight : C.light,
              border: active ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: active ? 700 : 600,
                color: active ? C.coral : C.muted,
                margin: 0,
              }}
            >
              {day.dayLabel ?? day.dateLabel}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function AddItineraryItemButton({ label = 'Tambah Aktivitas' }: { label?: string }) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        height: 50,
        backgroundColor: C.coral,
        color: 'white',
        border: 'none',
        borderRadius: 14,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: `0 8px 22px ${C.coral}45`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        fontFamily: FONT,
        marginTop: 4,
        flexShrink: 0,
      }}
    >
      <Plus size={16} strokeWidth={2.5} />
      {label}
    </button>
  );
}

type ItineraryTabBodyProps = {
  days: ItineraryDay[];
  activeDayId: number;
  footer?: ReactNode;
  datePending?: boolean;
  menuOpenItemId?: number;
  referenceNow?: ItineraryReferenceNow;
  showStateLegend?: boolean;
};

export function ItineraryTabBody({
  days,
  activeDayId,
  footer,
  datePending = false,
  menuOpenItemId,
  referenceNow,
  showStateLegend = false,
}: ItineraryTabBodyProps) {
  const activeDay = days.find((d) => d.id === activeDayId) ?? days[0];
  const itemCount = days.reduce((sum, d) => sum + d.items.length, 0);

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px 0',
        overflow: 'hidden',
      }}
    >
      <p
        style={{ fontSize: 12, color: C.muted, margin: '0 0 12px', fontWeight: 600, flexShrink: 0 }}
      >
        {itemCount} aktivitas · {days.length} hari
      </p>

      {days.length > 1 && <ItineraryDayTabs days={days} activeDayId={activeDayId} />}

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: 12 }}>
        {activeDay && (
          <ItineraryDayTimeline
            day={activeDay}
            datePending={datePending}
            menuOpenItemId={menuOpenItemId}
            referenceNow={referenceNow}
            showStateLegend={showStateLegend}
          />
        )}
      </div>

      {footer && <div style={{ padding: '0 20px 32px', flexShrink: 0 }}>{footer}</div>}
    </div>
  );
}

export function ItineraryEmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 12px 0',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 22,
          backgroundColor: C.coralLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <MapPin size={32} color={C.coral} strokeWidth={2.5} />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: C.charcoal, margin: '0 0 8px' }}>
        Belum ada aktivitas
      </h3>
      <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
        Susun aktivitas per hari — titik kumpul, transport, kuliner, dan destinasi. Warna timeline
        mengikuti status waktu, bukan jenis aktivitas.
      </p>
    </div>
  );
}

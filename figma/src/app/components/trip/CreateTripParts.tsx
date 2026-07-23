import type { ReactNode } from 'react';
import { X, ChevronLeft, ChevronRight, AlertCircle, Clock, Calendar, Info } from 'lucide-react';
import { AddCandidateButton } from '../ui/AddCandidateButton';
import { C, FONT } from '../colors';
import { SHEET_FOOTER_PADDING } from '../ui/BottomSheet';

export const ERROR_RED = C.danger;

export function formatTripTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

/** State awal waktu — mulai sekarang, selesai +9 jam */
export function getDefaultTripTimes() {
  const now = new Date();
  const end = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return { startTime: formatTripTime(now), endTime: formatTripTime(end) };
}

/** Data draft konsisten di seluruh flow buat perjalanan (layar 12–14) */
export const TRIP_DRAFT = {
  name: 'Lombok Petualangan 2026',
  tags: ['#Pantai', '#Alam', '#Indonesia'] as string[],
  dateStart: 12,
  dateEnd: 15,
  monthLabel: 'Juni 2026',
};

/** Kandidat tanggal multi-range — Juni 2026 (weekend panjang Jumat–Senin) */
export type TripDateCandidate = {
  id: number;
  start: number;
  end: number;
  range: string;
  days: string;
  weekdays: string;
  timeLabel: string;
};

export const TRIP_DATE_CANDIDATES: TripDateCandidate[] = [
  {
    id: 1,
    start: 12,
    end: 15,
    range: '12 – 15 Jun 2026',
    days: '4 hari',
    weekdays: 'Jumat – Senin',
    timeLabel: 'Sepanjang hari',
  },
  {
    id: 2,
    start: 19,
    end: 22,
    range: '19 – 22 Jun 2026',
    days: '4 hari',
    weekdays: 'Jumat – Senin',
    timeLabel: '08:00 – 17:00',
  },
  {
    id: 3,
    start: 26,
    end: 29,
    range: '26 – 29 Jun 2026',
    days: '4 hari',
    weekdays: 'Jumat – Senin',
    timeLabel: '08:00 – 17:00',
  },
];

/** Tanggal perjalanan saat ini — kandidat default awal voting tanggal */
export const TRIP_CURRENT_DATE_CANDIDATE = TRIP_DATE_CANDIDATES[0];

export function candidateMetaLine(cand: TripDateCandidate) {
  return `${cand.days} · ${cand.weekdays} · ${cand.timeLabel}`;
}

/** Tanggal resmi setelah voting tanggal dikunci */
export const TRIP_LOCKED_DATES = {
  start: 19,
  end: 22,
  label: '19 – 22 Jun 2026',
  timeLabel: '08:00 – 17:00',
  subtitle: '19 – 22 Jun 2026 · 08:00 – 17:00',
  allDay: false,
  startTime: '08:00',
  endTime: '17:00',
};

/** Subtitle trip saat voting tanggal masih berjalan */
export const TRIP_DATE_PENDING = 'Tanggal sedang divoting';

export const VOTING_DATE_CANDIDATES = [
  {
    id: 1,
    range: TRIP_DATE_CANDIDATES[0].range,
    days: candidateMetaLine(TRIP_DATE_CANDIDATES[0]),
    votes: 2,
    avatars: ['R', 'B'],
    voted: false,
  },
  {
    id: 2,
    range: TRIP_DATE_CANDIDATES[1].range,
    days: candidateMetaLine(TRIP_DATE_CANDIDATES[1]),
    votes: 4,
    avatars: ['R', 'B', 'A', 'D'],
    voted: true,
  },
  {
    id: 3,
    range: TRIP_DATE_CANDIDATES[2].range,
    days: candidateMetaLine(TRIP_DATE_CANDIDATES[2]),
    votes: 1,
    avatars: ['S'],
    voted: false,
  },
];

export const DAY_HEADERS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export const JUNE_DAYS: (number | null)[][] = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, null, null, null, null, null],
];

export function CreateTripModalHeader({ title = 'Buat Perjalanan' }: { title?: string }) {
  return (
    <>
      <div style={{ height: 60 }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 20px 0',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            backgroundColor: C.light,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} color={C.charcoal} strokeWidth={2.5} />
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: C.charcoal, margin: 0 }}>{title}</h2>
        <div style={{ width: 36 }} />
      </div>
    </>
  );
}

type TripNameFieldProps = {
  value?: string;
  placeholder?: string;
  error?: string;
  label?: string;
};

export function TripNameField({
  value,
  placeholder = 'Masukkan nama perjalanan...',
  error,
  label = 'Nama Perjalanan',
}: TripNameFieldProps) {
  const hasError = Boolean(error);
  const isEmpty = !value;

  return (
    <div>
      <label
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: hasError ? ERROR_RED : C.charcoal,
          display: 'block',
          marginBottom: 8,
        }}
      >
        {label} <span style={{ color: hasError ? ERROR_RED : C.coral }}>*</span>
      </label>
      <div
        style={{
          backgroundColor: hasError ? '#FFF5F5' : C.light,
          borderRadius: 14,
          padding: '13px 14px',
          border: hasError ? `2px solid ${ERROR_RED}` : `1.5px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: hasError ? `0 0 0 4px ${C.dangerLight}` : 'none',
        }}
      >
        <span
          style={{
            fontSize: 15,
            color: isEmpty ? C.mutedLight : C.charcoal,
            fontWeight: isEmpty ? 400 : 500,
            flex: 1,
          }}
        >
          {value || placeholder}
        </span>
        {hasError && <AlertCircle size={17} color={ERROR_RED} strokeWidth={2.5} />}
      </div>
      {error && (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, paddingLeft: 2 }}
        >
          <AlertCircle size={12} color={ERROR_RED} strokeWidth={2.5} />
          <span style={{ fontSize: 12, color: ERROR_RED, fontWeight: 600 }}>{error}</span>
        </div>
      )}
    </div>
  );
}

type TripTagsFieldProps = {
  tags?: string[];
  error?: string;
  compact?: boolean;
};

export function TripTagsField({ tags = [], error, compact = false }: TripTagsFieldProps) {
  const hasError = Boolean(error);
  const padding = compact ? '10px 14px' : '12px 14px';
  const gap = compact ? 6 : 8;
  const tagFontSize = compact ? 11 : 12;
  const tagPadding = compact ? '4px 9px' : '5px 10px';

  return (
    <div>
      <label
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: hasError ? ERROR_RED : C.charcoal,
          display: 'block',
          marginBottom: 8,
        }}
      >
        Tags
      </label>
      <div
        style={{
          backgroundColor: hasError ? '#FFF5F5' : C.light,
          borderRadius: 14,
          padding,
          border: hasError ? `2px solid ${ERROR_RED}` : `1.5px solid ${C.border}`,
          display: 'flex',
          flexWrap: 'wrap',
          gap,
          alignItems: 'center',
          minHeight: compact ? 44 : 50,
          boxShadow: hasError ? `0 0 0 4px ${C.dangerLight}` : 'none',
        }}
      >
        {tags.map((tag) => (
          <div
            key={tag}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              backgroundColor: C.tealLight,
              color: C.teal,
              fontSize: tagFontSize,
              fontWeight: 700,
              padding: tagPadding,
              borderRadius: 20,
            }}
          >
            {tag}
            <X size={11} strokeWidth={2.5} />
          </div>
        ))}
        <span style={{ fontSize: 13, color: C.mutedLight }}>+ Tambah tag...</span>
      </div>
      {error && (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 7, paddingLeft: 2 }}
        >
          <AlertCircle size={12} color={ERROR_RED} strokeWidth={2.5} />
          <span style={{ fontSize: 12, color: ERROR_RED, fontWeight: 600 }}>{error}</span>
        </div>
      )}
    </div>
  );
}

type TripCalendarProps = {
  selectedStart?: number;
  selectedEnd?: number;
  size?: 'normal' | 'compact';
  muted?: boolean;
};

export function TripCalendar({
  selectedStart,
  selectedEnd,
  size = 'normal',
  muted = false,
}: TripCalendarProps) {
  const isCompact = size === 'compact';
  const cellH = isCompact ? 30 : 34;
  const daySize = isCompact ? 26 : 30;
  const dayRadius = isCompact ? 8 : 10;
  const navSize = isCompact ? 28 : 30;
  const navRadius = isCompact ? 9 : 10;
  const headerSize = isCompact ? 9 : 10;
  const monthSize = isCompact ? 13 : 14;
  const dayFont = isCompact ? 11 : 13;
  const padding = isCompact ? '12px 12px 8px' : '14px 14px 10px';

  return (
    <div
      style={{
        backgroundColor: C.white,
        borderRadius: 18,
        border: `1.5px solid ${C.border}`,
        padding,
        boxShadow: `0 3px 14px ${C.shadow}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isCompact ? 12 : 14,
          padding: '0 2px',
        }}
      >
        <div
          style={{
            width: navSize,
            height: navSize,
            backgroundColor: C.light,
            borderRadius: navRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={isCompact ? 14 : 16} color={C.muted} />
        </div>
        <span style={{ fontSize: monthSize, fontWeight: 800, color: C.charcoal }}>
          {TRIP_DRAFT.monthLabel}
        </span>
        <div
          style={{
            width: navSize,
            height: navSize,
            backgroundColor: C.light,
            borderRadius: navRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronRight size={isCompact ? 14 : 16} color={C.muted} />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          marginBottom: isCompact ? 4 : 6,
        }}
      >
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: 'center',
              fontSize: headerSize,
              fontWeight: 700,
              color: C.muted,
              paddingBottom: isCompact ? 3 : 4,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {JUNE_DAYS.map((week, wi) => (
        <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {week.map((day, di) => {
            if (!day) return <div key={di} />;
            const isStart = selectedStart !== undefined && day === selectedStart;
            const isEnd = selectedEnd !== undefined && day === selectedEnd;
            const isInRange =
              selectedStart !== undefined &&
              selectedEnd !== undefined &&
              day > selectedStart &&
              day < selectedEnd;
            const isSelected = isStart || isEnd;

            if (muted) {
              return (
                <div
                  key={di}
                  style={{
                    height: cellH - 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{ fontSize: isCompact ? 11 : 12, fontWeight: 500, color: C.mutedLight }}
                  >
                    {day}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={di}
                style={{
                  height: cellH,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backgroundColor: isInRange ? C.coralLight : 'transparent',
                  borderRadius: isStart
                    ? `${dayRadius}px 0 0 ${dayRadius}px`
                    : isEnd
                      ? `0 ${dayRadius}px ${dayRadius}px 0`
                      : 0,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: daySize,
                    height: daySize,
                    borderRadius: dayRadius,
                    backgroundColor: isSelected ? C.coral : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isSelected ? `0 4px 12px ${C.coral}45` : 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: dayFont,
                      fontWeight: isSelected || isInRange ? 700 : 500,
                      color: isSelected
                        ? 'white'
                        : isInRange
                          ? C.coral
                          : day === 7
                            ? C.muted
                            : C.charcoal,
                    }}
                  >
                    {day}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export type TripDateMode = 'fixed' | 'candidates';

const DATE_CANDIDATE_INFO_TEXT =
  'Tamnbah kandidat tanggal jika tanggal belum pasti. Kandidat Tanggal akan menjadi voting di detail perjalanan.';

export function AddCandidateDateButton({
  compact = false,
  highlighted = false,
  infoTooltipOpen = false,
}: {
  compact?: boolean;
  highlighted?: boolean;
  infoTooltipOpen?: boolean;
}) {
  return (
    <div style={{ position: 'relative', marginTop: 10 }}>
      {infoTooltipOpen && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 'calc(100% + 6px)',
            backgroundColor: C.white,
            color: C.charcoal,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: '10px 12px',
            fontSize: 11,
            lineHeight: 1.45,
            fontWeight: 500,
            boxShadow: `0 8px 24px rgba(26,26,46,0.10), 0 0 0 1px ${C.border}`,
            zIndex: 20,
          }}
        >
          {DATE_CANDIDATE_INFO_TEXT}
        </div>
      )}
      <button
        type="button"
        style={{
          width: '100%',
          height: compact ? 44 : 46,
          backgroundColor: highlighted ? C.coralLight : 'transparent',
          border: highlighted ? `2px dashed ${C.coral}` : `2px dashed ${C.border}`,
          borderRadius: compact ? 12 : 14,
          fontSize: compact ? 12 : 14,
          fontWeight: highlighted ? 700 : 600,
          color: highlighted ? C.coral : C.muted,
          cursor: 'pointer',
          fontFamily: FONT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '0 14px',
        }}
      >
        <span>+ Tambah Kandidat Tanggal</span>
        <Info
          size={15}
          color={highlighted ? C.coral : C.muted}
          strokeWidth={2.5}
          style={{ flexShrink: 0 }}
        />
      </button>
    </div>
  );
}

type TripVotingDeadlineFieldProps = {
  value?: string;
  placeholder?: string;
};

/** Tenggat voting tanggal — opsional, sama seperti buat voting */
export function TripVotingDeadlineField({
  value,
  placeholder = 'Pilih tanggal & waktu...',
}: TripVotingDeadlineFieldProps) {
  const filled = Boolean(value);

  return (
    <div>
      <label
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: C.charcoal,
          display: 'block',
          marginBottom: 8,
        }}
      >
        Tenggat voting tanggal
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginLeft: 4 }}>
          (opsional)
        </span>
      </label>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: filled ? C.light : C.white,
          borderRadius: 14,
          padding: '13px 16px',
          border: `1.5px solid ${C.border}`,
          fontSize: filled ? 15 : 14,
          fontWeight: filled ? 500 : 400,
          color: filled ? C.charcoal : C.mutedLight,
        }}
      >
        <Calendar size={16} color={C.muted} strokeWidth={2.5} />
        <span style={{ flex: 1 }}>{value || placeholder}</span>
      </div>
      <p
        style={{
          fontSize: 10,
          color: C.mutedLight,
          margin: '4px 0 0',
          lineHeight: 1.4,
          fontWeight: 500,
        }}
      >
        Opsional — kosongkan jika voting hanya dikunci manual.
      </p>
    </div>
  );
}

type TripDateCandidateListProps = {
  /** Kandidat yang sudah dikonfirmasi (secondary coral) */
  savedCandidates?: TripDateCandidate[];
  /** Rentang sedang dipilih di kalender, belum dikonfirmasi (coral aktif) */
  activeCandidate?: TripDateCandidate;
  showEmptySlot?: boolean;
  hideLabel?: boolean;
};

function DateCandidateRow({
  cand,
  variant,
}: {
  cand: TripDateCandidate;
  variant: 'saved' | 'active';
}) {
  const isActive = variant === 'active';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        backgroundColor: isActive ? C.coralLight : C.white,
        borderRadius: 14,
        padding: '12px 14px',
        border: isActive ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          backgroundColor: isActive ? C.coral : C.coralLight,
          borderRadius: 9,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 800, color: isActive ? 'white' : C.coral }}>
          {cand.id}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: isActive ? C.coral : C.charcoal,
            margin: 0,
          }}
        >
          Kandidat {cand.id}: {cand.range}
        </p>
        <p
          style={{
            fontSize: 11,
            color: isActive ? `${C.coral}99` : C.muted,
            margin: '2px 0 0',
            fontWeight: 500,
          }}
        >
          {candidateMetaLine(cand)}
        </p>
      </div>
    </div>
  );
}

/** Daftar kandidat tanggal — saved=secondary coral, active=coral penuh */
export function TripDateCandidateList({
  savedCandidates = [],
  activeCandidate,
  showEmptySlot = false,
  hideLabel = false,
}: TripDateCandidateListProps) {
  const activeAlreadySaved = activeCandidate
    ? savedCandidates.some((c) => c.id === activeCandidate.id)
    : false;

  return (
    <div>
      {!hideLabel && (
        <label
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.charcoal,
            display: 'block',
            marginBottom: 8,
          }}
        >
          Kandidat Tanggal
          {savedCandidates.length > 0 && (
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginLeft: 6 }}>
              {savedCandidates.length} tersimpan
            </span>
          )}
        </label>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {savedCandidates.map((cand) => (
          <DateCandidateRow key={cand.id} cand={cand} variant="saved" />
        ))}

        {activeCandidate && !activeAlreadySaved && (
          <DateCandidateRow cand={activeCandidate} variant="active" />
        )}

        {showEmptySlot && !activeCandidate && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              backgroundColor: C.white,
              borderRadius: 14,
              padding: '12px 14px',
              border: `2px dashed ${C.border}`,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                backgroundColor: C.light,
                borderRadius: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, color: C.muted }}>
                {savedCandidates.length + 1}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.mutedLight, margin: 0 }}>
                Kandidat {savedCandidates.length + 1}: Pilih tanggal...
              </p>
              <p style={{ fontSize: 11, color: C.border, margin: '2px 0 0', fontWeight: 500 }}>
                Ketuk kalender di atas
              </p>
            </div>
            <Calendar size={16} color={C.mutedLight} strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
}

type TripTimeFieldsProps = {
  allDay?: boolean;
  startTime?: string;
  endTime?: string;
  /** Picker waktu mulai terbuka — jam sebelum sekarang tidak bisa dipilih */
  startPickerOpen?: boolean;
};

function TripTimePickerColumn({
  label,
  options,
  selected,
}: {
  label: string;
  options: { value: string; disabled?: boolean }[];
  selected: string;
}) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <span
        style={{ fontSize: 10, fontWeight: 700, color: C.muted, display: 'block', marginBottom: 6 }}
      >
        {label}
      </span>
      <div
        style={{
          maxHeight: 140,
          overflow: 'hidden',
          borderRadius: 10,
          backgroundColor: C.light,
        }}
      >
        {options.map((opt) => {
          const isSelected = opt.value === selected;
          return (
            <div
              key={opt.value}
              style={{
                padding: '8px 4px',
                fontSize: 15,
                fontWeight: isSelected ? 800 : 500,
                color: opt.disabled ? C.border : isSelected ? C.coral : C.charcoal,
                opacity: opt.disabled ? 0.45 : 1,
                cursor: opt.disabled ? 'not-allowed' : 'pointer',
              }}
            >
              {opt.value}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildHourOptions(nowHour: number) {
  return Array.from({ length: 24 }, (_, h) => {
    const value = h.toString().padStart(2, '0');
    return { value, disabled: h < nowHour };
  });
}

function buildMinuteOptions() {
  return ['00', '15', '30', '45'].map((value) => ({ value }));
}

/** Waktu perjalanan — seperti Google Calendar: all-day default, bisa set jam */
export function TripTimeFields({
  allDay = false,
  startTime = '08:00',
  endTime = '17:00',
  startPickerOpen = false,
}: TripTimeFieldsProps) {
  const [startHour, startMinute] = startTime.split(':');
  const now = new Date();
  const nowHour = now.getHours();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal }}>Waktu</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: allDay ? C.coral : C.muted }}>
            Sepanjang hari
          </span>
          <div
            style={{
              width: 44,
              height: 26,
              backgroundColor: allDay ? C.coral : C.border,
              borderRadius: 20,
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                backgroundColor: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: 2,
                left: allDay ? 20 : 2,
                boxShadow: `0 2px 6px ${C.shadow}`,
              }}
            />
          </div>
        </div>
      </div>
      {!allDay && (
        <>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Mulai', value: startTime, active: startPickerOpen },
              { label: 'Selesai', value: endTime, active: false },
            ].map((field) => (
              <div key={field.label} style={{ flex: 1 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.muted,
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  {field.label}
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: field.active ? C.coralLight : C.light,
                    borderRadius: 12,
                    padding: '11px 14px',
                    border: field.active ? `2px solid ${C.coral}` : `1.5px solid ${C.border}`,
                  }}
                >
                  <Clock size={14} color={field.active ? C.coral : C.muted} strokeWidth={2.5} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.charcoal }}>
                    {field.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {startPickerOpen && (
            <div
              style={{
                marginTop: 10,
                padding: '12px 10px',
                backgroundColor: C.white,
                borderRadius: 14,
                border: `1.5px solid ${C.border}`,
                boxShadow: `0 8px 24px ${C.shadow}`,
              }}
            >
              <div style={{ display: 'flex', gap: 8 }}>
                <TripTimePickerColumn
                  label="Jam"
                  selected={startHour}
                  options={buildHourOptions(nowHour)}
                />
                <TripTimePickerColumn
                  label="Menit"
                  selected={startMinute}
                  options={buildMinuteOptions()}
                />
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: C.muted,
                  margin: '8px 0 0',
                  lineHeight: 1.4,
                  fontWeight: 500,
                  textAlign: 'center',
                }}
              >
                Jam sebelum {formatTripTime(now)} tidak bisa dipilih
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

type TripDateSectionProps = {
  selectedStart?: number;
  selectedEnd?: number;
  muted?: boolean;
  error?: string;
  showAddButton?: boolean;
  highlightAddButton?: boolean;
  compact?: boolean;
  showTime?: boolean;
  allDay?: boolean;
  startTime?: string;
  endTime?: string;
  startPickerOpen?: boolean;
  dateMode?: TripDateMode;
  candidateInfoOpen?: boolean;
  dateLabel?: string;
};

/** Blok kalender — fixed: tanggal pasti + waktu · candidates: opsi tambah kandidat */
export function TripDateSection({
  selectedStart,
  selectedEnd,
  muted = false,
  error,
  showAddButton = false,
  highlightAddButton = false,
  compact = false,
  showTime = true,
  allDay = false,
  startTime,
  endTime,
  startPickerOpen,
  dateMode = 'fixed',
  candidateInfoOpen = false,
  dateLabel,
}: TripDateSectionProps) {
  const hasError = Boolean(error);
  const isFixed = dateMode === 'fixed';
  const label = dateLabel ?? (isFixed ? 'Tanggal Perjalanan' : 'Pilih Tanggal');

  return (
    <div>
      <label
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: hasError ? ERROR_RED : C.charcoal,
          display: 'block',
          marginBottom: 8,
        }}
      >
        {label} <span style={{ color: hasError ? ERROR_RED : C.coral }}>*</span>
      </label>
      <div style={{ position: 'relative' }}>
        <TripCalendar
          selectedStart={selectedStart}
          selectedEnd={selectedEnd}
          muted={muted}
          size={compact ? 'compact' : 'normal'}
        />
        {hasError && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 18,
              border: `2px solid ${ERROR_RED}`,
              pointerEvents: 'none',
              boxShadow: '0 0 0 4px rgba(249,65,65,0.08)',
            }}
          />
        )}
      </div>
      {error && (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, paddingLeft: 2 }}
        >
          <AlertCircle size={12} color={ERROR_RED} strokeWidth={2.5} />
          <span style={{ fontSize: 12, color: ERROR_RED, fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {showTime && (
        <div style={{ marginTop: 10 }}>
          <TripTimeFields
            allDay={allDay}
            startTime={startTime}
            endTime={endTime}
            startPickerOpen={startPickerOpen}
          />
        </div>
      )}

      {showAddButton && (
        <AddCandidateDateButton
          compact={compact}
          highlighted={highlightAddButton}
          infoTooltipOpen={candidateInfoOpen}
        />
      )}
    </div>
  );
}

export type CreateTripFormBodyProps = {
  name?: string;
  tags?: string[];
  tagsCompact?: boolean;
  nameError?: string;
  calendarStart?: number;
  calendarEnd?: number;
  dateMuted?: boolean;
  dateError?: string;
  savedCandidates?: TripDateCandidate[];
  activeCandidate?: TripDateCandidate;
  showCandidateList?: boolean;
  showEmptySlot?: boolean;
  showAddButton?: boolean;
  highlightAddButton?: boolean;
  compact?: boolean;
  showTime?: boolean;
  allDay?: boolean;
  startTime?: string;
  endTime?: string;
  startPickerOpen?: boolean;
  /** fixed = tanggal pasti · candidates = beberapa opsi → voting */
  dateMode?: TripDateMode;
  candidateInfoOpen?: boolean;
  /** Jangan tampilkan rentang terpilih di kalender */
  noDateSelected?: boolean;
  votingDeadline?: string;
};

/** Isi form buat perjalanan — reusable di semua state flow §5 */
export function CreateTripFormBody({
  name = TRIP_DRAFT.name,
  tags = TRIP_DRAFT.tags,
  tagsCompact = false,
  nameError,
  calendarStart,
  calendarEnd,
  dateMuted = false,
  dateError,
  savedCandidates = [],
  activeCandidate,
  showCandidateList = false,
  showEmptySlot = false,
  showAddButton = true,
  highlightAddButton = false,
  compact = false,
  showTime = true,
  allDay = false,
  startTime,
  endTime,
  startPickerOpen,
  dateMode = 'fixed',
  candidateInfoOpen = false,
  noDateSelected = false,
  votingDeadline,
}: CreateTripFormBodyProps) {
  const resolvedStart = calendarStart ?? (noDateSelected ? undefined : TRIP_DRAFT.dateStart);
  const resolvedEnd = calendarEnd ?? (noDateSelected ? undefined : TRIP_DRAFT.dateEnd);
  const isCandidates = dateMode === 'candidates';
  const hasSavedCandidates = savedCandidates.length > 0;
  const showTenggat = isCandidates && hasSavedCandidates;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tagsCompact ? 10 : 14 }}>
        <TripNameField value={name} error={nameError} />
        <TripTagsField tags={tags} compact={tagsCompact} />
      </div>

      <TripDateSection
        selectedStart={resolvedStart}
        selectedEnd={resolvedEnd}
        muted={dateMuted}
        error={dateError}
        showAddButton={showAddButton}
        highlightAddButton={highlightAddButton}
        compact={compact}
        showTime={showTime}
        allDay={allDay}
        startTime={startTime}
        endTime={endTime}
        startPickerOpen={startPickerOpen}
        dateMode={dateMode}
        candidateInfoOpen={candidateInfoOpen}
      />

      {isCandidates && showCandidateList && (
        <TripDateCandidateList
          savedCandidates={savedCandidates}
          activeCandidate={activeCandidate}
          showEmptySlot={showEmptySlot}
        />
      )}

      {showTenggat && <TripVotingDeadlineField value={votingDeadline} />}
    </div>
  );
}

type CreateTripFooterProps = {
  disabled?: boolean;
  loading?: boolean;
  errorSummary?: string;
  errors?: string[];
  label?: string;
};

export function CreateTripFooter({
  disabled = false,
  loading = false,
  errorSummary,
  errors,
  label = 'Buat Perjalanan',
}: CreateTripFooterProps) {
  const errorList = errors ?? (errorSummary ? [errorSummary] : []);
  const summary =
    errorList.length > 1 ? `${errorList.length} hal wajib belum lengkap` : errorList[0];
  const isDisabled = disabled || loading;
  const buttonLabel = loading ? 'Membuat...' : label;

  return (
    <div
      style={{
        padding: SHEET_FOOTER_PADDING,
        backgroundColor: C.white,
        borderTop: `1px solid ${C.border}`,
        flexShrink: 0,
      }}
    >
      {errorList.length > 0 && (
        <div
          style={{
            backgroundColor: C.dangerLight,
            border: `1px solid ${C.dangerBorder}`,
            borderRadius: 12,
            padding: '10px 14px',
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <AlertCircle
              size={14}
              color={ERROR_RED}
              strokeWidth={2.5}
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: ERROR_RED, fontWeight: 700, margin: '0 0 4px' }}>
                {summary}
              </p>
              {errorList.length > 1 && (
                <ul style={{ margin: 0, padding: '0 0 0 14px' }}>
                  {errorList.map((e) => (
                    <li
                      key={e}
                      style={{ fontSize: 11, color: ERROR_RED, fontWeight: 500, lineHeight: 1.5 }}
                    >
                      {e}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        disabled={isDisabled}
        style={{
          width: '100%',
          height: 54,
          backgroundColor: isDisabled ? '#C8C8D4' : C.coral,
          color: 'white',
          border: 'none',
          borderRadius: 16,
          fontSize: 16,
          fontWeight: 800,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          boxShadow: isDisabled ? 'none' : `0 10px 28px ${C.coral}45`,
          fontFamily: FONT,
          opacity: loading ? 0.85 : 1,
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export function CreateTripShell({
  children,
  footer,
  title = 'Buat Perjalanan',
}: {
  children: ReactNode;
  footer: ReactNode;
  title?: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: C.white,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <CreateTripModalHeader title={title} />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '16px 16px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {children}
      </div>
      {footer}
    </div>
  );
}

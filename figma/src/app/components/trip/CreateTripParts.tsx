import type { ReactNode } from 'react';
import { X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { C, FONT } from '../colors';

export const ERROR_RED = '#E53935';

/** Data draft konsisten di seluruh flow buat perjalanan (layar 12–14) */
export const TRIP_DRAFT = {
  name: 'Lombok Petualangan 2026',
  tags: ['#Pantai', '#Alam', '#Indonesia'] as string[],
  dateStart: 15,
  dateEnd: 18,
  monthLabel: 'Juni 2026',
};

export const DAY_HEADERS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export const JUNE_DAYS: (number | null)[][] = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, null, null, null, null, null],
];

export function CreateTripModalHeader() {
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
        <h2 style={{ fontSize: 17, fontWeight: 800, color: C.charcoal, margin: 0 }}>Buat Perjalanan</h2>
        <div style={{ width: 36 }} />
      </div>
    </>
  );
}

type TripNameFieldProps = {
  value?: string;
  placeholder?: string;
  error?: string;
};

export function TripNameField({ value, placeholder = 'Masukkan nama perjalanan...', error }: TripNameFieldProps) {
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
        Nama Perjalanan {hasError && <span style={{ color: ERROR_RED }}>*</span>}
      </label>
      <div
        style={{
          backgroundColor: hasError ? '#FFF5F5' : C.light,
          borderRadius: 14,
          padding: '14px 16px',
          border: hasError ? `2px solid ${ERROR_RED}` : `1.5px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: hasError ? `0 0 0 4px rgba(229,57,53,0.08)` : 'none',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 7, paddingLeft: 2 }}>
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
  const isEmpty = tags.length === 0;

  if (compact && !isEmpty) {
    return (
      <div>
        <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
          Tags
        </label>
        <div
          style={{
            backgroundColor: C.light,
            borderRadius: 14,
            padding: '10px 14px',
            border: `1.5px solid ${C.border}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            alignItems: 'center',
          }}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                backgroundColor: C.tealLight,
                color: C.teal,
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 9px',
                borderRadius: 20,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

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
          padding: '12px 14px',
          border: hasError ? `2px solid ${ERROR_RED}` : `1.5px solid ${C.border}`,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
          minHeight: 50,
          boxShadow: hasError ? `0 0 0 4px rgba(229,57,53,0.08)` : 'none',
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
              fontSize: 12,
              fontWeight: 700,
              padding: '5px 10px',
              borderRadius: 20,
            }}
          >
            {tag}
            <X size={11} strokeWidth={2.5} />
          </div>
        ))}
        {isEmpty ? (
          <span style={{ fontSize: 13, color: C.mutedLight }}>+ Tambah tag...</span>
        ) : (
          <span style={{ fontSize: 13, color: C.mutedLight }}>+ Tambah tag...</span>
        )}
      </div>
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 7, paddingLeft: 2 }}>
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
        <span style={{ fontSize: monthSize, fontWeight: 800, color: C.charcoal }}>{TRIP_DRAFT.monthLabel}</span>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: isCompact ? 4 : 6 }}>
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
                <div key={di} style={{ height: cellH - 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: isCompact ? 11 : 12, fontWeight: 500, color: C.mutedLight }}>{day}</span>
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
                  borderRadius: isStart ? `${dayRadius}px 0 0 ${dayRadius}px` : isEnd ? `0 ${dayRadius}px ${dayRadius}px 0` : 0,
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
                      color: isSelected ? 'white' : isInRange ? C.coral : day === 7 ? C.muted : C.charcoal,
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

export function AddCandidateDateButton({ compact = false }: { compact?: boolean }) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        height: compact ? 44 : 46,
        backgroundColor: 'transparent',
        border: `2px dashed ${C.border}`,
        borderRadius: 14,
        fontSize: compact ? 13 : 14,
        fontWeight: 600,
        color: compact ? C.mutedLight : C.muted,
        cursor: 'pointer',
        marginTop: compact ? 10 : 12,
        fontFamily: FONT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      + Tambah Kandidat Tanggal
    </button>
  );
}

type CreateTripFooterProps = {
  disabled?: boolean;
  errorSummary?: string;
};

export function CreateTripFooter({ disabled = false, errorSummary }: CreateTripFooterProps) {
  return (
    <div style={{ padding: '16px 20px 28px', backgroundColor: C.white, borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
      {errorSummary && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#FFF5F5',
            border: `1px solid rgba(229,57,53,0.25)`,
            borderRadius: 12,
            padding: '10px 14px',
            marginBottom: 12,
          }}
        >
          <AlertCircle size={14} color={ERROR_RED} strokeWidth={2.5} />
          <span style={{ fontSize: 12, color: ERROR_RED, fontWeight: 600 }}>{errorSummary}</span>
        </div>
      )}
      <button
        type="button"
        disabled={disabled}
        style={{
          width: '100%',
          height: 54,
          backgroundColor: disabled ? '#C8C8D4' : C.coral,
          color: 'white',
          border: 'none',
          borderRadius: 16,
          fontSize: 16,
          fontWeight: 800,
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: disabled ? 'none' : `0 10px 28px ${C.coral}45`,
          fontFamily: FONT,
        }}
      >
        Buat Perjalanan
      </button>
    </div>
  );
}

export function CreateTripShell({ children, footer }: { children: ReactNode; footer: ReactNode }) {
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
      <CreateTripModalHeader />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '20px 20px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {children}
      </div>
      {footer}
    </div>
  );
}

import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { C, FONT } from '../colors';

type IllustrationProps = { width?: number; height?: number };

export function EmptyTripsIllustration({ width = 190, height = 168 }: IllustrationProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 190 168" fill="none">
      <circle cx="95" cy="84" r="72" fill="#EDF9F8" />
      <circle cx="95" cy="84" r="52" fill="white" stroke="#E0F5F4" strokeWidth="2" />
      <ellipse
        cx="95"
        cy="84"
        rx="52"
        ry="22"
        fill="none"
        stroke="#4ECDC4"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        opacity="0.5"
      />
      <line
        x1="95"
        y1="32"
        x2="95"
        y2="136"
        stroke="#4ECDC4"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        opacity="0.5"
      />
      <line
        x1="43"
        y1="84"
        x2="147"
        y2="84"
        stroke="#4ECDC4"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        opacity="0.5"
      />
      <path
        d="M60 95 Q95 55 130 78"
        stroke="#FF6B6B"
        strokeWidth="2"
        strokeDasharray="4 3"
        fill="none"
        opacity="0.8"
      />
      <circle cx="60" cy="95" r="5" fill="#FF6B6B" opacity="0.5" />
      <path
        d="M130 78 C130 70, 138 62, 138 62 C138 62, 146 70, 146 78 C146 86, 138 92, 138 92 C138 92, 130 86, 130 78Z"
        fill="#FF6B6B"
      />
      <circle cx="138" cy="78" r="4" fill="white" />
      <g transform="translate(90, 65) rotate(-30)">
        <path d="M0 0 L14 -5 L14 0 L8 3Z" fill="#FF6B6B" />
        <path d="M0 0 L5 7 L3 10" fill="#FF6B6B" opacity="0.6" />
      </g>
      <circle cx="42" cy="56" r="3.5" fill="#FFB347" />
      <circle cx="156" cy="52" r="3" fill="#4ECDC4" />
      <circle cx="162" cy="106" r="2.5" fill="#FF6B6B" opacity="0.6" />
      <circle cx="35" cy="112" r="2.5" fill="#4ECDC4" opacity="0.7" />
      <path
        d="M162 56 L163.5 59 L167 59 L164 61 L165 65 L162 63 L159 65 L160 61 L157 59 L160.5 59Z"
        fill="#FFB347"
        opacity="0.6"
      />
    </svg>
  );
}

type EmptyTripsStateProps = {
  description: string;
  cta?: ReactNode;
  /** default = Beranda penuh · profile = kompak di tab Profil */
  size?: 'default' | 'profile';
};

const SIZE = {
  default: {
    padding: '0 36px 80px',
    illW: 190,
    illH: 168,
    titleSize: 20,
    titleMargin: '20px 0 10px',
    descSize: 14,
    descMarginCta: '0 0 28px',
    descMargin: 0,
    flex: 1 as const,
    justify: 'center' as const,
  },
  profile: {
    padding: '4px 18px 16px',
    illW: 120,
    illH: 106,
    titleSize: 15,
    titleMargin: '10px 0 6px',
    descSize: 12,
    descMarginCta: '0 0 14px',
    descMargin: 0,
    flex: undefined,
    justify: 'flex-start' as const,
  },
};

/** Empty state perjalanan — dipakai di Beranda & Profil */
export function EmptyTripsState({ description, cta, size = 'default' }: EmptyTripsStateProps) {
  const s = SIZE[size];

  return (
    <div
      style={{
        flex: s.flex,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: s.justify,
        padding: s.padding,
        textAlign: 'center',
      }}
    >
      <EmptyTripsIllustration width={s.illW} height={s.illH} />
      <h3
        style={{
          fontSize: s.titleSize,
          fontWeight: 800,
          color: C.charcoal,
          margin: s.titleMargin,
          letterSpacing: -0.3,
        }}
      >
        Belum ada perjalanan
      </h3>
      <p
        style={{
          fontSize: s.descSize,
          color: C.muted,
          margin: cta ? s.descMarginCta : s.descMargin,
          lineHeight: 1.55,
          fontWeight: 500,
          maxWidth: size === 'profile' ? 260 : undefined,
        }}
      >
        {description}
      </p>
      {cta}
    </div>
  );
}

type ProfileEmptyTripCtaProps = { compact?: boolean };

export function ProfileEmptyTripCta({ compact = false }: ProfileEmptyTripCtaProps) {
  return (
    <button
      type="button"
      style={{
        height: compact ? 40 : 52,
        padding: compact ? '0 18px' : '0 28px',
        backgroundColor: C.coral,
        color: 'white',
        border: 'none',
        borderRadius: compact ? 12 : 16,
        fontSize: compact ? 13 : 15,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: `0 8px 20px ${C.coral}40`,
        fontFamily: FONT,
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 6 : 8,
      }}
    >
      <Plus size={compact ? 15 : 18} strokeWidth={2.5} />
      Buat Perjalanan Baru
    </button>
  );
}

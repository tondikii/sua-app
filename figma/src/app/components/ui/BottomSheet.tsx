import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { C, FONT } from '../colors';

export const SHEET_SAFE_TOP = 54;
export const SHEET_FOOTER_PADDING = '16px 20px 32px';

export function SheetHandle() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 14,
        paddingBottom: 6,
        flexShrink: 0,
      }}
    >
      <div style={{ width: 40, height: 5, backgroundColor: C.border, borderRadius: 20 }} />
    </div>
  );
}

export function SheetPrimaryButton({ label }: { label: string }) {
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
        fontSize: 15,
        fontWeight: 800,
        cursor: 'pointer',
        fontFamily: FONT,
        boxShadow: `0 8px 24px ${C.coral}40`,
      }}
    >
      {label}
    </button>
  );
}

type BottomSheetProps = {
  title: string;
  subtitle?: string;
  onBack?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  /** Konten tetap di atas — hanya children yang scroll saat height=fixed */
  bodyPinned?: ReactNode;
  /** auto = tinggi ikut konten; fixed = tinggi penuh area aman, body scrollable */
  height?: 'auto' | 'fixed';
  zIndex?: number;
  bodyGap?: number;
};

/** Bottom sheet reusable — selaras voting sheet & form aktivitas */
export function BottomSheet({
  title,
  subtitle,
  onBack,
  children,
  footer,
  bodyPinned,
  height = 'auto',
  zIndex = 20,
  bodyGap = 16,
}: BottomSheetProps) {
  const isFixed = height === 'fixed';
  const hasFooter = Boolean(footer);
  const bodyScrolls = isFixed || hasFooter;

  return (
    <div
      style={{
        position: 'absolute',
        top: SHEET_SAFE_TOP,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex,
        fontFamily: FONT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          backgroundColor: C.white,
          borderRadius: '26px 26px 0 0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: isFixed ? '100%' : undefined,
          maxHeight: '100%',
          pointerEvents: 'auto',
          boxShadow: '0 -10px 40px rgba(26,26,46,0.14)',
        }}
      >
        <SheetHandle />

        <div
          style={{
            padding: onBack ? '4px 16px 12px' : '6px 16px 12px',
            borderBottom: `1px solid ${C.border}`,
            flexShrink: 0,
          }}
        >
          {onBack && (
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                padding: '0 0 8px',
                cursor: 'pointer',
                fontFamily: FONT,
                color: C.muted,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
              Kembali
            </button>
          )}
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.charcoal, margin: 0 }}>{title}</h2>
          {subtitle && (
            <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 0', lineHeight: 1.45 }}>
              {subtitle}
            </p>
          )}
        </div>

        {bodyPinned ? (
          <div
            style={{
              flex: bodyScrolls ? 1 : undefined,
              minHeight: bodyScrolls ? 0 : undefined,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div style={{ flexShrink: 0, padding: '16px 16px 0' }}>{bodyPinned}</div>
            <div
              style={{
                flex: bodyScrolls ? 1 : undefined,
                minHeight: bodyScrolls ? 0 : undefined,
                overflowY: bodyScrolls ? 'auto' : undefined,
                WebkitOverflowScrolling: 'touch',
                padding: '16px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: bodyGap,
              }}
            >
              {children}
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: bodyScrolls ? 1 : undefined,
              minHeight: bodyScrolls ? 0 : undefined,
              overflowY: bodyScrolls ? 'auto' : undefined,
              WebkitOverflowScrolling: 'touch',
              padding: '16px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: bodyGap,
            }}
          >
            {children}
          </div>
        )}

        {footer && (
          <div
            style={{
              padding: SHEET_FOOTER_PADDING,
              borderTop: `1px solid ${C.border}`,
              flexShrink: 0,
              backgroundColor: C.white,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

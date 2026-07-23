import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { C, FONT } from '../colors';

/** Tinggi spacer di bawah dynamic island — konsisten di seluruh layar */
export const SAFE_AREA_TOP = 60;

export function SafeAreaTop() {
  return <div style={{ height: SAFE_AREA_TOP, flexShrink: 0 }} />;
}

export function BackButton({ onLight = true }: { onLight?: boolean }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        backgroundColor: onLight ? C.light : C.white,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        boxShadow: onLight ? 'none' : `0 2px 10px ${C.shadow}`,
      }}
    >
      <ArrowLeft size={18} color={C.charcoal} strokeWidth={2.5} />
    </div>
  );
}

type NavHeaderProps = {
  title: string;
  right?: ReactNode;
  onLight?: boolean;
  border?: boolean;
};

/** Header navigasi: back · judul tengah · aksi kanan (Edit Profil, Profil Publik, dll.) */
export function NavHeader({ title, right, onLight = true, border = true }: NavHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '12px 22px 14px',
        borderBottom: border ? `1px solid ${C.border}` : 'none',
        backgroundColor: onLight ? C.white : C.light,
        flexShrink: 0,
      }}
    >
      <BackButton onLight={onLight} />
      <h1
        style={{
          flex: 1,
          fontSize: 17,
          fontWeight: 800,
          color: C.charcoal,
          margin: 0,
          letterSpacing: -0.3,
          textAlign: 'center',
        }}
      >
        {title}
      </h1>
      <div style={{ width: 36, display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
        {right ?? <span />}
      </div>
    </div>
  );
}

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  background?: string;
};

/** Header halaman: back + judul besar kiri (Beranda, Pengaturan, Cari) */
export function PageHeader({ title, subtitle, right, background = C.white }: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '12px 22px 14px',
        backgroundColor: background,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        <BackButton onLight={background !== C.light} />
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: C.charcoal,
              margin: 0,
              letterSpacing: -0.4,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 12, color: C.muted, margin: '3px 0 0', fontWeight: 500 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

export function HeaderTextButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: 15,
        fontWeight: 700,
        color: C.coral,
        cursor: 'pointer',
        fontFamily: FONT,
        padding: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

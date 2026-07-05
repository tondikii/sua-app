import type { ReactNode } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { TRIP_DRAFT } from './CreateTripParts';

export type InviteUser = {
  id: number;
  name: string;
  username?: string | null;
  email?: string | null;
  initial: string;
  color: string;
  invited?: boolean;
};

type InviteShellProps = {
  searchValue?: string;
  searchPlaceholder?: string;
  children?: ReactNode;
  footer?: ReactNode;
  showSuccessHeader?: boolean;
  /** Banner opsional di bawah header sukses (mis. info wishlist dihapus) */
  banner?: ReactNode;
  tripName?: string;
};

export function InviteShell({
  searchValue,
  searchPlaceholder = 'Cari username / email...',
  children,
  footer,
  showSuccessHeader = true,
  banner,
  tripName = TRIP_DRAFT.name,
}: InviteShellProps) {
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
      }}
    >
      <div style={{ height: 60 }} />

      {showSuccessHeader && (
        <div style={{ padding: '8px 22px 16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                backgroundColor: C.tealLight,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CheckCircle2 size={22} color={C.teal} strokeWidth={2.5} />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.3 }}>
                Perjalanan berhasil dibuat!
              </h2>
              <p style={{ fontSize: 12, color: C.muted, margin: '3px 0 0', fontWeight: 600 }}>{tripName}</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            Ajak teman untuk merencanakan bareng. Kamu bisa lewati dulu dan undang nanti lewat menu ⋮ → Daftar Anggota.
          </p>
        </div>
      )}

      {banner && <div style={{ padding: '0 22px 16px', flexShrink: 0 }}>{banner}</div>}

      <div style={{ padding: '0 22px', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: C.light,
            borderRadius: 14,
            padding: '12px 16px',
            border: `1.5px solid ${searchValue ? C.coral : C.border}`,
            boxShadow: searchValue ? `0 0 0 3px ${C.coralLight}` : 'none',
            marginBottom: 12,
          }}
        >
          <Search size={16} color={searchValue ? C.coral : C.muted} />
          <span
            style={{
              fontSize: 14,
              color: searchValue ? C.charcoal : C.mutedLight,
              fontWeight: searchValue ? 600 : 400,
              flex: 1,
            }}
          >
            {searchValue ?? searchPlaceholder}
          </span>
        </div>
      </div>

      {children && (
        <div style={{ flex: 1, padding: '0 22px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      )}

      {footer && (
        <div
          style={{
            padding: '16px 22px 28px',
            borderTop: `1px solid ${C.border}`,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

export function InvitePrimaryButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        height: 54,
        backgroundColor: C.coral,
        color: 'white',
        border: 'none',
        borderRadius: 16,
        fontSize: 16,
        fontWeight: 800,
        cursor: 'pointer',
        boxShadow: `0 10px 28px ${C.coral}45`,
        fontFamily: FONT,
      }}
    >
      {label}
    </button>
  );
}

export function InviteUserRow({
  user,
  actionLabel = 'Undang',
  cancelable = false,
}: {
  user: InviteUser;
  actionLabel?: string;
  /** Jika invited, tampilkan tombol Batalkan alih-alih badge Terundang */
  cancelable?: boolean;
}) {
  const subtitle = user.username ?? user.email ?? '';
  const invited = user.invited;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 0',
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          backgroundColor: user.color,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 800,
          color: 'white',
          flexShrink: 0,
        }}
      >
        {user.initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, margin: '0 0 2px' }}>{user.name}</p>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, fontWeight: 500 }}>{subtitle}</p>
      </div>
      {invited && cancelable ? (
        <button
          type="button"
          style={{
            height: 34,
            padding: '0 12px',
            backgroundColor: 'transparent',
            color: C.danger,
            border: `1.5px solid ${C.danger}40`,
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: FONT,
            flexShrink: 0,
          }}
        >
          Batalkan
        </button>
      ) : invited ? (
        <span style={{ fontSize: 12, fontWeight: 700, color: C.teal, flexShrink: 0 }}>✓ Terundang</span>
      ) : (
        <button
          type="button"
          style={{
            height: 34,
            padding: '0 16px',
            backgroundColor: C.coral,
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: FONT,
            flexShrink: 0,
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/** Baris user yang sudah diundang — tap Batalkan untuk membatalkan undangan */
export function InviteInvitedRow({ user }: { user: InviteUser }) {
  const subtitle = user.username ?? user.email ?? '';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 0',
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          backgroundColor: user.color,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 800,
          color: 'white',
          flexShrink: 0,
        }}
      >
        {user.initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, margin: '0 0 2px' }}>{user.name}</p>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, fontWeight: 500 }}>{subtitle}</p>
      </div>
      <button
        type="button"
        style={{
          height: 34,
          padding: '0 12px',
          backgroundColor: 'transparent',
          color: C.danger,
          border: `1.5px solid ${C.danger}40`,
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: FONT,
          flexShrink: 0,
        }}
      >
        Batalkan
      </button>
    </div>
  );
}

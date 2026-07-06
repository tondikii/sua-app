import type { ReactNode } from 'react';
import { CheckCircle2, Mail, Send, Smartphone } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { SearchInput } from '../search/SearchParts';
import { TRIP_DRAFT } from './CreateTripParts';

/** Contoh email untuk mock layar undang via email */
export const EXAMPLE_INVITE_EMAIL = 'sari.lestari@gmail.com';

export type EmailInviteStatus = 'not_registered' | 'email_sent' | 'pending_accept';

export type EmailInvite = {
  email: string;
  status: EmailInviteStatus;
  /** Terisi setelah penerima download & registrasi */
  name?: string;
  username?: string;
  initial?: string;
  color?: string;
};

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
  searchPlaceholder = 'Cari username atau email...',
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
            Ajak teman merencanakan bareng. Lewati dulu dan undang nanti lewat ⋮ → Anggota.
          </p>
        </div>
      )}

      {banner && <div style={{ padding: '0 22px 16px', flexShrink: 0 }}>{banner}</div>}

      <div style={{ padding: '0 22px', flexShrink: 0 }}>
        <div style={{ marginBottom: 12 }}>
          <SearchInput value={searchValue} placeholder={searchPlaceholder} />
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
  isLast = false,
}: {
  user: InviteUser;
  actionLabel?: string;
  /** Jika invited, tampilkan tombol Batalkan alih-alih badge Terundang */
  cancelable?: boolean;
  isLast?: boolean;
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
        borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
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

/** Hasil cari email — belum punya akun Atur Perjalanan */
export function EmailInviteSearchResult({ email }: { email: string }) {
  return (
    <div
      style={{
        backgroundColor: C.light,
        borderRadius: 18,
        padding: '16px',
        border: `1.5px solid ${C.border}`,
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            backgroundColor: C.white,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: `1px solid ${C.border}`,
          }}
        >
          <Mail size={20} color={C.muted} strokeWidth={2.5} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: C.charcoal, margin: '0 0 4px', wordBreak: 'break-all' }}>
            {email}
          </p>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            Belum punya akun. Kami kirim undangan lewat email beserta link unduh app.
          </p>
        </div>
      </div>
      <button
        type="button"
        style={{
          width: '100%',
          height: 44,
          backgroundColor: C.coral,
          color: 'white',
          border: 'none',
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: FONT,
          boxShadow: `0 6px 18px ${C.coral}40`,
        }}
      >
        Undang lewat Email
      </button>
    </div>
  );
}

/** Konfirmasi kirim undangan email */
export function EmailInviteConfirmCard({
  email,
  tripName = TRIP_DRAFT.name,
  inviterName = 'Budi',
}: {
  email: string;
  tripName?: string;
  inviterName?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          backgroundColor: C.tealLight,
          borderRadius: 16,
          padding: '14px 16px',
          border: `1px solid ${C.teal}30`,
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Send size={18} color={C.teal} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.teal, margin: '0 0 6px', wordBreak: 'break-all' }}>{email}</p>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              <strong style={{ color: C.charcoal }}>{inviterName}</strong> mengundang ke{' '}
              <strong style={{ color: C.charcoal }}>{tripName}</strong> · link Play Store disertakan.
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: C.light,
          borderRadius: 14,
          padding: '12px 14px',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <Smartphone size={18} color={C.muted} strokeWidth={2} />
        <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
          Setelah daftar, undangan muncul di tab Undangan beranda.
        </p>
      </div>

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
        Kirim Email
      </button>
    </div>
  );
}

/** Banner sukses setelah email undangan terkirim */
export function EmailInviteSentBanner({ email }: { email: string }) {
  return (
    <div
      style={{
        backgroundColor: C.tealLight,
        borderRadius: 16,
        padding: '14px 16px',
        border: `1px solid ${C.teal}35`,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          backgroundColor: C.white,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <CheckCircle2 size={20} color={C.teal} strokeWidth={2.5} />
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 800, color: C.charcoal, margin: '0 0 4px' }}>Email terkirim</p>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
          Undangan dikirim ke <strong style={{ color: C.charcoal }}>{email}</strong>. Tunggu unduh app lalu terima dari
          beranda.
        </p>
      </div>
    </div>
  );
}

const EMAIL_INVITE_STATUS: Record<EmailInviteStatus, { label: string; color: string; bg: string }> = {
  not_registered: { label: 'Belum daftar', color: C.muted, bg: C.light },
  email_sent: { label: 'Email terkirim', color: '#60A5FA', bg: '#EFF6FF' },
  pending_accept: { label: 'Menunggu', color: C.coral, bg: C.coralLight },
};

/** Baris undangan via email — di daftar terundang atau anggota */
export function EmailInvitedRow({
  invite,
  cancelable = true,
  isLast = false,
}: {
  invite: EmailInvite;
  cancelable?: boolean;
  isLast?: boolean;
}) {
  const statusMeta = EMAIL_INVITE_STATUS[invite.status];
  const displayName = invite.name ?? invite.email;
  const subtitle =
    invite.status === 'pending_accept' && invite.username
      ? invite.username
      : invite.status === 'email_sent'
        ? 'Belum daftar app'
        : invite.email;
  const initial = invite.initial ?? invite.email.charAt(0).toUpperCase();
  const avatarBg = invite.color ?? C.muted;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 0',
        borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
      }}
    >
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div
          style={{
            width: 44,
            height: 44,
            backgroundColor: invite.status === 'email_sent' ? C.light : avatarBg,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: invite.status === 'email_sent' ? undefined : 16,
            fontWeight: 800,
            color: invite.status === 'email_sent' ? undefined : 'white',
            border: invite.status === 'email_sent' ? `1px solid ${C.border}` : 'none',
          }}
        >
          {invite.status === 'email_sent' ? (
            <Mail size={20} color={C.muted} strokeWidth={2.5} />
          ) : (
            initial
          )}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, margin: '0 0 2px' }}>{displayName}</p>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, fontWeight: 500 }}>{subtitle}</p>
      </div>
      {invite.status === 'pending_accept' ? (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: statusMeta.color,
            backgroundColor: statusMeta.bg,
            padding: '4px 10px',
            borderRadius: 20,
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {statusMeta.label}
        </span>
      ) : cancelable ? (
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
      ) : (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: statusMeta.color,
            backgroundColor: statusMeta.bg,
            padding: '4px 10px',
            borderRadius: 20,
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {statusMeta.label}
        </span>
      )}
    </div>
  );
}

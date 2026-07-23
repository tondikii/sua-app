import type { ReactNode } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { SearchInput } from '../search/SearchParts';
import { TRIP_DRAFT } from './CreateTripParts';

/** Contoh email untuk mock layar undang via email */
export const EXAMPLE_INVITE_EMAIL = 'sari.lestari@gmail.com';

export type EmailInviteStatus = 'email_sent' | 'pending_accept' | 'rejected';

export type EmailInvite = {
  id: string;
  status: EmailInviteStatus;
  email?: string;
  /** Terisi setelah penerima download & registrasi */
  name?: string;
  username?: string;
  initial?: string;
  color?: string;
};

/** Alias semantik — undangan pending di daftar anggota */
export type PendingInvite = EmailInvite;

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
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: C.charcoal,
                  margin: 0,
                  letterSpacing: -0.3,
                }}
              >
                Perjalanan berhasil dibuat!
              </h2>
              <p style={{ fontSize: 12, color: C.muted, margin: '3px 0 0', fontWeight: 600 }}>
                {tripName}
              </p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
            Ajak teman ke dalam perjalanan. Atau Kamu bisa lewati dulu dan undang di detail
            perjalanan.
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
        <div
          style={{
            flex: 1,
            padding: '0 22px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
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

export function InviteSearchResultsBody({ results }: { results: InviteUser[] }) {
  return (
    <>
      <p style={{ fontSize: 12, color: C.muted, margin: '0 0 8px', fontWeight: 600 }}>
        {results.length} hasil
      </p>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {results.map((user) => (
          <InviteUserRow key={user.id} user={user} />
        ))}
      </div>
    </>
  );
}

export function InviteInvitedList({
  users,
  emailInvite,
  banner,
}: {
  users: InviteUser[];
  emailInvite?: EmailInvite;
  banner?: ReactNode;
}) {
  return (
    <>
      {banner}
      <p
        style={{
          fontSize: 12,
          color: C.muted,
          margin: banner ? '16px 0 8px' : '0 0 8px',
          fontWeight: 600,
        }}
      >
        Sudah diundang
      </p>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {emailInvite && <EmailInvitedRow invite={emailInvite} />}
        {users.map((user) => (
          <InviteInvitedRow key={user.id} user={user} />
        ))}
      </div>
    </>
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
        <p style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, margin: '0 0 2px' }}>
          {user.name}
        </p>
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
        <span style={{ fontSize: 12, fontWeight: 700, color: C.teal, flexShrink: 0 }}>
          ✓ Terundang
        </span>
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
        <p style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, margin: '0 0 2px' }}>
          {user.name}
        </p>
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
          <p
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: C.charcoal,
              margin: '0 0 4px',
              wordBreak: 'break-all',
            }}
          >
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
        <p style={{ fontSize: 14, fontWeight: 800, color: C.charcoal, margin: '0 0 4px' }}>
          Email terkirim
        </p>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
          Undangan dikirim ke <strong style={{ color: C.charcoal }}>{email}</strong>. Tunggu unduh
          app lalu terima dari beranda.
        </p>
      </div>
    </div>
  );
}

const EMAIL_INVITE_STATUS: Record<EmailInviteStatus, { label: string; color: string; bg: string }> =
  {
    email_sent: { label: 'Belum daftar app', color: C.muted, bg: C.light },
    pending_accept: { label: 'Belum menerima', color: C.coral, bg: C.coralLight },
    rejected: { label: 'Ditolak', color: C.danger, bg: C.dangerLight },
  };

function PendingActionButton({
  label,
  variant,
}: {
  label: string;
  variant: 'cancel' | 'reinvite';
}) {
  const isCancel = variant === 'cancel';
  return (
    <button
      type="button"
      style={{
        height: 34,
        padding: '0 12px',
        backgroundColor: isCancel ? 'transparent' : C.coral,
        color: isCancel ? C.danger : 'white',
        border: isCancel ? `1.5px solid ${C.danger}40` : 'none',
        borderRadius: 10,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: FONT,
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

/** Baris undangan pending / ditolak — di daftar anggota trip */
export function EmailInvitedRow({
  invite,
  canManage = true,
  isLast = false,
}: {
  invite: EmailInvite;
  /** Semua anggota trip bisa batalkan / undang kembali calon anggota */
  canManage?: boolean;
  isLast?: boolean;
}) {
  const statusMeta = EMAIL_INVITE_STATUS[invite.status];
  const isEmailOnly = invite.status === 'email_sent';
  const displayName = invite.name ?? invite.email ?? '—';
  const subtitle =
    invite.status === 'rejected'
      ? 'Undangan ditolak'
      : invite.status === 'pending_accept' && invite.username
        ? invite.username
        : isEmailOnly
          ? 'Belum daftar app'
          : (invite.email ?? statusMeta.label);
  const initial = invite.initial ?? invite.email?.charAt(0).toUpperCase() ?? '?';
  const avatarBg = invite.color ?? C.muted;
  const isPending = invite.status === 'email_sent' || invite.status === 'pending_accept';

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
            backgroundColor: isEmailOnly ? C.light : avatarBg,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isEmailOnly ? undefined : 16,
            fontWeight: 800,
            color: isEmailOnly ? undefined : 'white',
            border: isEmailOnly ? `1px solid ${C.border}` : 'none',
            opacity: invite.status === 'rejected' ? 0.55 : 1,
          }}
        >
          {isEmailOnly ? <Mail size={20} color={C.muted} strokeWidth={2.5} /> : initial}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: invite.status === 'rejected' ? C.muted : C.charcoal,
            margin: '0 0 2px',
            wordBreak: 'break-all',
          }}
        >
          {displayName}
        </p>
        <p style={{ fontSize: 12, color: C.muted, margin: 0, fontWeight: 500 }}>{subtitle}</p>
      </div>
      {canManage && isPending ? (
        <PendingActionButton label="Batalkan" variant="cancel" />
      ) : canManage && invite.status === 'rejected' ? (
        <PendingActionButton label="Undang kembali" variant="reinvite" />
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

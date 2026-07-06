import type { ReactNode } from 'react';
import { SearchInput } from '../search/SearchParts';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { NavHeader, SafeAreaTop } from '../ui/ScreenChrome';
import { EmailInvitedRow, InviteUserRow, type PendingInvite, type InviteUser } from './InviteParts';

export type TripMember = {
  id: number;
  name: string;
  username: string;
  initial: string;
  color: string;
  role: 'creator' | 'member' | 'pending';
};

export const SAMPLE_TRIP_MEMBERS: TripMember[] = [
  { id: 0, name: 'Kamu (Budi)', username: '@budi_santoso', initial: 'B', color: AVATAR_COLORS[0], role: 'creator' },
  { id: 2, name: 'Rudi Hermawan', username: '@rudi_travel', initial: 'R', color: AVATAR_COLORS[2], role: 'member' },
  { id: 3, name: 'Fitra Kusuma', username: '@fitrakusuma', initial: 'F', color: AVATAR_COLORS[3], role: 'member' },
];

const ROLE_LABEL: Record<TripMember['role'], string> = {
  creator: 'Pembuat',
  member: 'Anggota',
  pending: 'Menunggu',
};

type TripMemberRowProps = {
  member: TripMember;
  /** Hanya pembuat trip yang bisa mengeluarkan anggota */
  canRemove?: boolean;
};

export function TripMemberRow({ member, canRemove = false }: TripMemberRowProps) {
  const isPending = member.role === 'pending';
  const isCreator = member.role === 'creator';
  const showRemove = canRemove && !isCreator;

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
          backgroundColor: member.color,
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
        {member.initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, margin: 0 }}>{member.name}</p>
        <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>{member.username}</p>
      </div>
      {showRemove ? (
        <button
          type="button"
          style={{
            height: 32,
            padding: '0 12px',
            backgroundColor: 'transparent',
            color: C.muted,
            border: `1.5px solid ${C.border}`,
            borderRadius: 10,
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: FONT,
            flexShrink: 0,
          }}
        >
          Keluarkan
        </button>
      ) : (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: isPending ? C.coral : C.muted,
            backgroundColor: isPending ? C.coralLight : C.light,
            padding: '4px 10px',
            borderRadius: 20,
            flexShrink: 0,
          }}
        >
          {ROLE_LABEL[member.role]}
        </span>
      )}
    </div>
  );
}

function PanelCountLabel({ children }: { children: string }) {
  return (
    <p style={{ fontSize: 12, color: C.muted, margin: '0 0 8px', fontWeight: 600 }}>
      {children}
    </p>
  );
}

function PanelSectionDivider() {
  return <div style={{ height: 1, backgroundColor: C.border, margin: '8px 0' }} />;
}

type TripMembersPanelProps = {
  members?: TripMember[];
  inviteResults?: InviteUser[];
  pendingInvites?: PendingInvite[];
  searchValue?: string;
  showInviteSearch?: boolean;
  /** Konten undang tambahan (hasil cari, dll.) — di atas daftar anggota */
  inviteExtra?: ReactNode;
  /** true = viewer adalah pembuat trip (bisa keluarkan anggota) */
  isCreator?: boolean;
};

/** Panel undang + anggota — pending di atas, daftar anggota di bawah */
export function TripMembersPanel({
  members = SAMPLE_TRIP_MEMBERS,
  inviteResults,
  pendingInvites,
  searchValue,
  showInviteSearch = false,
  inviteExtra,
  isCreator = true,
}: TripMembersPanelProps) {
  const hasInviteResults = Boolean(inviteResults && inviteResults.length > 0);
  const hasPendingInvites = Boolean(pendingInvites && pendingInvites.length > 0);
  const hasInviteBlock = showInviteSearch || hasInviteResults || hasPendingInvites || Boolean(inviteExtra);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: FONT }}>
      {hasInviteBlock && (
        <div style={{ flexShrink: 0 }}>
          {showInviteSearch && (
            <div style={{ marginBottom: hasInviteResults || hasPendingInvites || inviteExtra ? 16 : 0 }}>
              <SearchInput value={searchValue} placeholder="Cari username atau email..." />
            </div>
          )}

          {hasInviteResults && (
            <div style={{ marginBottom: hasPendingInvites || inviteExtra ? 16 : 0 }}>
              <PanelCountLabel>{inviteResults!.length} hasil</PanelCountLabel>
              {inviteResults!.map((user, idx) => (
                <InviteUserRow
                  key={user.id}
                  user={user}
                  cancelable={user.invited}
                  isLast={idx === inviteResults!.length - 1 && !hasPendingInvites && !inviteExtra}
                />
              ))}
            </div>
          )}

          {hasPendingInvites && (
            <div style={{ marginBottom: inviteExtra ? 16 : 0 }}>
              <PanelCountLabel>{pendingInvites!.length} pending</PanelCountLabel>
              {pendingInvites!.map((invite, idx) => (
                <EmailInvitedRow
                  key={invite.id}
                  invite={invite}
                  isLast={idx === pendingInvites!.length - 1 && !inviteExtra}
                />
              ))}
            </div>
          )}

          {inviteExtra}
        </div>
      )}

      {hasInviteBlock && <PanelSectionDivider />}

      <div style={{ flexShrink: 0 }}>
        <PanelCountLabel>{members.length} anggota</PanelCountLabel>
        {members.map((member) => (
          <TripMemberRow key={member.id} member={member} canRemove={isCreator} />
        ))}
      </div>
    </div>
  );
}

/** Halaman daftar anggota trip — shell shared */
export function TripMembersScreen({ panelProps }: { panelProps: React.ComponentProps<typeof TripMembersPanel> }) {
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
      <SafeAreaTop />
      <NavHeader title="Anggota Perjalanan" />
      <div style={{ flex: 1, minHeight: 0, padding: '8px 22px 28px', overflowY: 'auto' }}>
        <TripMembersPanel {...panelProps} />
      </div>
    </div>
  );
}

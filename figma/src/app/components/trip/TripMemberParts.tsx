import type { ReactNode } from 'react';
import { SearchInput } from '../search/SearchParts';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { EmailInvitedRow, InviteUserRow, type EmailInvite, type InviteUser } from './InviteParts';

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
  { id: 1, name: 'Dewi Astuti', username: '@dewi_astuti', initial: 'D', color: AVATAR_COLORS[1], role: 'pending' },
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

function PanelSectionLabel({ children }: { children: string }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: C.muted,
        margin: '0 0 10px',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
      }}
    >
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
  emailInvites?: EmailInvite[];
  searchValue?: string;
  showInviteSearch?: boolean;
  /** Konten undang tambahan (hasil email, konfirmasi, dll.) — di atas daftar anggota */
  inviteExtra?: ReactNode;
  /** true = viewer adalah pembuat trip */
  isCreator?: boolean;
};

/** Panel undang + anggota — undangan di atas, daftar anggota di bawah konten */
export function TripMembersPanel({
  members = SAMPLE_TRIP_MEMBERS,
  inviteResults,
  emailInvites,
  searchValue,
  showInviteSearch = false,
  inviteExtra,
  isCreator = true,
}: TripMembersPanelProps) {
  const hasInviteResults = Boolean(inviteResults && inviteResults.length > 0);
  const hasEmailInvites = Boolean(emailInvites && emailInvites.length > 0);
  const hasInviteBlock = showInviteSearch || hasInviteResults || hasEmailInvites || Boolean(inviteExtra);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: FONT }}>
      {hasInviteBlock && (
        <div style={{ flexShrink: 0 }}>
          {showInviteSearch && (
            <div style={{ marginBottom: hasInviteResults || hasEmailInvites || inviteExtra ? 16 : 0 }}>
              <SearchInput value={searchValue} placeholder="Cari username atau email..." />
            </div>
          )}

          {hasInviteResults && (
            <div style={{ marginBottom: hasEmailInvites || inviteExtra ? 16 : 0 }}>
              <PanelSectionLabel>Hasil · {inviteResults!.length}</PanelSectionLabel>
              {inviteResults!.map((user, idx) => (
                <InviteUserRow
                  key={user.id}
                  user={user}
                  cancelable={user.invited}
                  isLast={idx === inviteResults!.length - 1 && !hasEmailInvites && !inviteExtra}
                />
              ))}
            </div>
          )}

          {hasEmailInvites && (
            <div style={{ marginBottom: inviteExtra ? 16 : 0 }}>
              <PanelSectionLabel>Undangan email · {emailInvites!.length}</PanelSectionLabel>
              {emailInvites!.map((invite, idx) => (
                <EmailInvitedRow
                  key={invite.email}
                  invite={invite}
                  cancelable={isCreator}
                  isLast={idx === emailInvites!.length - 1 && !inviteExtra}
                />
              ))}
            </div>
          )}

          {inviteExtra}
        </div>
      )}

      {hasInviteBlock && <PanelSectionDivider />}

      <div style={{ flexShrink: 0 }}>
        <p style={{ fontSize: 12, color: C.muted, margin: '0 0 8px', fontWeight: 600 }}>
          {members.length} anggota
        </p>
        {members.map((member) => (
          <TripMemberRow key={member.id} member={member} canRemove={isCreator} />
        ))}
      </div>
    </div>
  );
}

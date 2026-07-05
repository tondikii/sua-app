import { Crown, Search } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { InviteUserRow, type InviteUser } from './InviteParts';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, margin: 0 }}>{member.name}</p>
          {isCreator && <Crown size={12} color="#F59E0B" strokeWidth={2.5} />}
        </div>
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

type TripMembersPanelProps = {
  members?: TripMember[];
  inviteResults?: InviteUser[];
  searchValue?: string;
  showInviteSearch?: boolean;
  /** true = viewer adalah pembuat trip */
  isCreator?: boolean;
};

/** Panel undang + anggota — siapa saja bisa undang, hanya pembuat yang bisa keluarkan */
export function TripMembersPanel({
  members = SAMPLE_TRIP_MEMBERS,
  inviteResults,
  searchValue,
  showInviteSearch = false,
  isCreator = true,
}: TripMembersPanelProps) {
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', fontFamily: FONT }}>
      {showInviteSearch && (
        <>
          <div style={{ padding: '0 0 12px', flexShrink: 0 }}>
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
                {searchValue ?? 'Undang teman — cari username / email...'}
              </span>
            </div>
          </div>

          {inviteResults && inviteResults.length > 0 && (
            <div style={{ flexShrink: 0, marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: C.muted, margin: '0 0 8px', fontWeight: 600 }}>
                {inviteResults.length} hasil
              </p>
              {inviteResults.map((user) => (
                <InviteUserRow key={user.id} user={user} cancelable={user.invited} />
              ))}
            </div>
          )}
        </>
      )}

      <p style={{ fontSize: 12, color: C.muted, margin: '0 0 8px', fontWeight: 600 }}>
        {members.length} anggota
      </p>
      <div style={{ flexShrink: 0 }}>
        {members.map((member) => (
          <TripMemberRow key={member.id} member={member} canRemove={isCreator} />
        ))}
      </div>
    </div>
  );
}

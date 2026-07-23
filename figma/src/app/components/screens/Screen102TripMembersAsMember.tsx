import { AVATAR_COLORS } from '../colors';
import { EXAMPLE_INVITE_EMAIL } from '../trip/InviteParts';
import { TripMembersScreen } from '../trip/TripMemberParts';

/** Daftar anggota — POV anggota: bisa undang/batalkan/undang kembali calon anggota */
export function Screen102TripMembersAsMember() {
  return (
    <TripMembersScreen
      panelProps={{
        isCreator: false,
        showInviteSearch: true,
        searchValue: 'karina',
        inviteResults: [
          {
            id: 11,
            name: 'Karina Putri',
            username: '@karina_putri',
            initial: 'K',
            color: AVATAR_COLORS[4],
          },
        ],
        pendingInvites: [
          { id: 'email-pending', email: EXAMPLE_INVITE_EMAIL, status: 'email_sent' },
          {
            id: 'user-pending-dewi',
            status: 'pending_accept',
            name: 'Dewi Astuti',
            username: '@dewi_astuti',
            initial: 'D',
            color: AVATAR_COLORS[1],
          },
          {
            id: 'rejected-ahmad',
            status: 'rejected',
            name: 'Ahmad Fauzi',
            username: '@ahmad_f',
            initial: 'A',
            color: AVATAR_COLORS[3],
          },
        ],
        members: [
          {
            id: 0,
            name: 'Budi Santoso',
            username: '@budi_santoso',
            initial: 'B',
            color: AVATAR_COLORS[0],
            role: 'creator',
          },
          {
            id: 2,
            name: 'Kamu (Rudi)',
            username: '@rudi_travel',
            initial: 'R',
            color: AVATAR_COLORS[2],
            role: 'member',
          },
          {
            id: 3,
            name: 'Fitra Kusuma',
            username: '@fitrakusuma',
            initial: 'F',
            color: AVATAR_COLORS[3],
            role: 'member',
          },
        ],
      }}
    />
  );
}

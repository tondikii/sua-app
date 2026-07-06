import { AVATAR_COLORS } from '../colors';
import { TripMembersScreen } from '../trip/TripMemberParts';

/** Daftar anggota (pembuat) — undangan ditolak, opsi undang kembali */
export function Screen101TripMembersRejected() {
  return (
    <TripMembersScreen
      panelProps={{
        showInviteSearch: true,
        pendingInvites: [
          {
            id: 'rejected-ahmad',
            status: 'rejected',
            name: 'Ahmad Fauzi',
            username: '@ahmad_f',
            initial: 'A',
            color: AVATAR_COLORS[3],
          },
          {
            id: 'rejected-email',
            status: 'rejected',
            email: 'nina.wijaya@gmail.com',
          },
        ],
      }}
    />
  );
}

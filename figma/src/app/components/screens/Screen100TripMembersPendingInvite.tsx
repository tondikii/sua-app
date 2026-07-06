import { AVATAR_COLORS } from '../colors';
import { EXAMPLE_INVITE_EMAIL } from '../trip/InviteParts';
import { TripMembersScreen } from '../trip/TripMemberParts';

/** Daftar anggota (pembuat) — section Pending: belum daftar app + belum terima */
export function Screen100TripMembersPendingInvite() {
  return (
    <TripMembersScreen
      panelProps={{
        showInviteSearch: true,
        pendingInvites: [
          { id: 'email-pending', email: EXAMPLE_INVITE_EMAIL, status: 'email_sent' },
          {
            id: 'user-pending-sari',
            status: 'pending_accept',
            name: 'Sari Lestari',
            username: '@sari_lestari',
            initial: 'S',
            color: AVATAR_COLORS[4],
          },
          {
            id: 'user-pending-dewi',
            status: 'pending_accept',
            name: 'Dewi Astuti',
            username: '@dewi_astuti',
            initial: 'D',
            color: AVATAR_COLORS[1],
          },
        ],
      }}
    />
  );
}

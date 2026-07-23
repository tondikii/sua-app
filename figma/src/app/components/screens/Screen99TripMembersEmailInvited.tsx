import { EXAMPLE_INVITE_EMAIL } from '../trip/InviteParts';
import { TripMembersScreen } from '../trip/TripMemberParts';

/** Daftar anggota — undangan email terkirim, menunggu unduh aplikasi */
export function Screen99TripMembersEmailInvited() {
  return (
    <TripMembersScreen
      panelProps={{
        showInviteSearch: true,
        pendingInvites: [{ id: 'email-sent', email: EXAMPLE_INVITE_EMAIL, status: 'email_sent' }],
        members: [
          {
            id: 0,
            name: 'Kamu (Budi)',
            username: '@budi_santoso',
            initial: 'B',
            color: '#FF6B6B',
            role: 'creator',
          },
          {
            id: 2,
            name: 'Rudi Hermawan',
            username: '@rudi_travel',
            initial: 'R',
            color: '#4ECDC4',
            role: 'member',
          },
        ],
      }}
    />
  );
}

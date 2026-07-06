import { EXAMPLE_INVITE_EMAIL, EmailInviteSearchResult } from '../trip/InviteParts';
import { TripMembersScreen } from '../trip/TripMemberParts';

/** Daftar anggota — cari email belum terdaftar (dari menu anggota) */
export function Screen98TripMembersInviteEmail() {
  return (
    <TripMembersScreen
      panelProps={{
        showInviteSearch: true,
        searchValue: EXAMPLE_INVITE_EMAIL,
        members: [
          { id: 0, name: 'Kamu (Budi)', username: '@budi_santoso', initial: 'B', color: '#FF6B6B', role: 'creator' },
          { id: 2, name: 'Rudi Hermawan', username: '@rudi_travel', initial: 'R', color: '#4ECDC4', role: 'member' },
        ],
        inviteExtra: <EmailInviteSearchResult email={EXAMPLE_INVITE_EMAIL} />,
      }}
    />
  );
}

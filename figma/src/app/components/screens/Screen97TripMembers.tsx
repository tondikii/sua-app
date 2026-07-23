import { AVATAR_COLORS } from '../colors';
import { TripMembersScreen } from '../trip/TripMemberParts';

/** Daftar anggota trip — dari menu ⋮, bisa undang dari sini */
export function Screen97TripMembers() {
  return (
    <TripMembersScreen
      panelProps={{
        showInviteSearch: true,
        searchValue: 'rina',
        inviteResults: [
          {
            id: 10,
            name: 'Rina Santoso',
            username: '@rina_travel',
            initial: 'R',
            color: AVATAR_COLORS[2],
          },
        ],
      }}
    />
  );
}

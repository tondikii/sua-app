import { C, FONT, AVATAR_COLORS } from '../colors';
import { NavHeader, SafeAreaTop } from '../ui/ScreenChrome';
import { TripMembersPanel } from '../trip/TripMemberParts';

/** Daftar anggota trip — dari menu ⋮, bisa undang dari sini, CRUD anggota perjalanan */
export function Screen50TripMembers() {
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

      <div style={{ flex: 1, minHeight: 0, padding: '8px 22px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <TripMembersPanel
          showInviteSearch
          searchValue="rina"
          inviteResults={[
            { id: 10, name: 'Rina Santoso', username: '@rina_travel', initial: 'R', color: AVATAR_COLORS[2] },
          ]}
        />
      </div>
    </div>
  );
}

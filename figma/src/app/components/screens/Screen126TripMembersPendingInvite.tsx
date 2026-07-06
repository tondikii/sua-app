import { C, AVATAR_COLORS, FONT } from '../colors';
import { NavHeader, SafeAreaTop } from '../ui/ScreenChrome';
import { EXAMPLE_INVITE_EMAIL } from '../trip/InviteParts';
import { TripMembersPanel } from '../trip/TripMemberParts';

/** Daftar anggota — undangan pending (sudah download & registrasi, belum terima) */
export function Screen126TripMembersPendingInvite() {
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
        <TripMembersPanel
          emailInvites={[
            {
              email: EXAMPLE_INVITE_EMAIL,
              status: 'pending_accept',
              name: 'Sari Lestari',
              username: '@sari_lestari',
              initial: 'S',
              color: AVATAR_COLORS[4],
            },
          ]}
          members={[
            { id: 0, name: 'Kamu (Budi)', username: '@budi_santoso', initial: 'B', color: AVATAR_COLORS[0], role: 'creator' },
            { id: 1, name: 'Dewi Astuti', username: '@dewi_astuti', initial: 'D', color: AVATAR_COLORS[1], role: 'pending' },
            { id: 2, name: 'Rudi Hermawan', username: '@rudi_travel', initial: 'R', color: AVATAR_COLORS[2], role: 'member' },
          ]}
        />
      </div>
    </div>
  );
}

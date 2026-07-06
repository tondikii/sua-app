import { C, FONT } from '../colors';
import { NavHeader, SafeAreaTop } from '../ui/ScreenChrome';
import { EXAMPLE_INVITE_EMAIL, EmailInviteConfirmCard } from '../trip/InviteParts';
import { TripMembersPanel } from '../trip/TripMemberParts';

/** Daftar anggota — konfirmasi kirim undangan email */
export function Screen127TripMembersEmailConfirm() {
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
          showInviteSearch
          searchValue={EXAMPLE_INVITE_EMAIL}
          members={[
            { id: 0, name: 'Kamu (Budi)', username: '@budi_santoso', initial: 'B', color: '#FF6B6B', role: 'creator' },
            { id: 2, name: 'Rudi Hermawan', username: '@rudi_travel', initial: 'R', color: '#4ECDC4', role: 'member' },
          ]}
          inviteExtra={<EmailInviteConfirmCard email={EXAMPLE_INVITE_EMAIL} />}
        />
      </div>
    </div>
  );
}

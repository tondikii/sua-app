import { C, AVATAR_COLORS } from '../colors';
import {
  EXAMPLE_INVITE_EMAIL,
  EmailInviteSentBanner,
  EmailInvitedRow,
  InviteInvitedRow,
  InvitePrimaryButton,
  InviteShell,
} from '../trip/InviteParts';

const inAppInvited = [
  { id: 1, name: 'Dewi Astuti', username: '@dewi_astuti', initial: 'D', color: AVATAR_COLORS[0] },
];

/** Undang — email terkirim, menunggu unduh & daftar aplikasi */
export function Screen123InviteEmailSent() {
  return (
    <InviteShell footer={<InvitePrimaryButton label="Masuk ke Perjalanan" />}>
      <EmailInviteSentBanner email={EXAMPLE_INVITE_EMAIL} />

      <p style={{ fontSize: 12, color: C.muted, margin: '16px 0 8px', fontWeight: 600 }}>Sudah diundang</p>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <EmailInvitedRow
          invite={{ email: EXAMPLE_INVITE_EMAIL, status: 'email_sent' }}
        />
        {inAppInvited.map((user) => (
          <InviteInvitedRow key={user.id} user={user} />
        ))}
      </div>
    </InviteShell>
  );
}

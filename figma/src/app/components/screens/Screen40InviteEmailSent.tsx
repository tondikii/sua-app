import { AVATAR_COLORS } from '../colors';
import {
  EXAMPLE_INVITE_EMAIL,
  EmailInviteSentBanner,
  InviteInvitedList,
  InvitePrimaryButton,
  InviteShell,
} from '../trip/InviteParts';

const inAppInvited = [
  { id: 1, name: 'Dewi Astuti', username: '@dewi_astuti', initial: 'D', color: AVATAR_COLORS[0] },
];

/** Undang — email terkirim, menunggu unduh & daftar aplikasi */
export function Screen40InviteEmailSent() {
  return (
    <InviteShell footer={<InvitePrimaryButton label="Masuk ke Perjalanan" />}>
      <InviteInvitedList
        banner={<EmailInviteSentBanner email={EXAMPLE_INVITE_EMAIL} />}
        emailInvite={{ id: 'email-sent', email: EXAMPLE_INVITE_EMAIL, status: 'email_sent' }}
        users={inAppInvited}
      />
    </InviteShell>
  );
}

import { AVATAR_COLORS } from '../colors';
import {
  EXAMPLE_INVITE_EMAIL,
  InviteInvitedList,
  InvitePrimaryButton,
  InviteShell,
} from '../trip/InviteParts';

const invitedUsers = [
  { id: 1, name: 'Dewi Astuti', username: '@dewi_astuti', initial: 'D', color: AVATAR_COLORS[0] },
  { id: 2, name: 'Rudi Hermawan', username: '@rudi_travel', initial: 'R', color: AVATAR_COLORS[1] },
];

/** Undang teman — daftar yang sudah diundang, bisa batalkan per baris */
export function Screen41InviteSent() {
  return (
    <InviteShell footer={<InvitePrimaryButton label="Masuk ke Perjalanan" />}>
      <InviteInvitedList
        emailInvite={{ id: 'email-sent', email: EXAMPLE_INVITE_EMAIL, status: 'email_sent' }}
        users={invitedUsers}
      />
    </InviteShell>
  );
}

import { C, AVATAR_COLORS } from '../colors';
import { InviteShell, InvitePrimaryButton, InviteInvitedRow, EmailInvitedRow, EXAMPLE_INVITE_EMAIL } from '../trip/InviteParts';

const invitedUsers = [
  { id: 1, name: 'Dewi Astuti', username: '@dewi_astuti', initial: 'D', color: AVATAR_COLORS[0] },
  { id: 2, name: 'Rudi Hermawan', username: '@rudi_travel', initial: 'R', color: AVATAR_COLORS[1] },
];

/** Undang teman — daftar yang sudah diundang, bisa batalkan per baris */
export function Screen45InviteSent() {
  return (
    <InviteShell footer={<InvitePrimaryButton label="Masuk ke Perjalanan" />}>

      <p style={{ fontSize: 12, color: C.muted, margin: '0 0 8px', fontWeight: 600 }}>Sudah diundang</p>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <EmailInvitedRow invite={{ email: EXAMPLE_INVITE_EMAIL, status: 'email_sent' }} />
        {invitedUsers.map((user) => (
          <InviteInvitedRow key={user.id} user={user} />
        ))}
      </div>
    </InviteShell>
  );
}

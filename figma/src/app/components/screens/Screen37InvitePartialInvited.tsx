import { AVATAR_COLORS } from '../colors';
import { InvitePrimaryButton, InviteSearchResultsBody, InviteShell } from '../trip/InviteParts';

const results = [
  { id: 1, name: 'Rina Santoso', username: '@rina_travel', initial: 'R', color: AVATAR_COLORS[2], invited: true },
  { id: 2, name: 'Karina Wijaya', username: '@karina_w', initial: 'K', color: AVATAR_COLORS[0] },
  { id: 3, name: 'Marina Putri', username: '@marina_p', initial: 'M', color: AVATAR_COLORS[1] },
];

/** Undang — hasil cari, sebagian sudah diundang (badge Terundang) */
export function Screen37InvitePartialInvited() {
  return (
    <InviteShell searchValue="rina" footer={<InvitePrimaryButton label="Masuk ke Perjalanan" />}>
      <InviteSearchResultsBody results={results} />
    </InviteShell>
  );
}

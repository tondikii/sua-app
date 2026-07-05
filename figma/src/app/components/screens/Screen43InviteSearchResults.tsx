import { C, AVATAR_COLORS } from '../colors';
import { InviteShell, InviteUserRow, InvitePrimaryButton } from '../trip/InviteParts';

const results = [
  { id: 1, name: 'Rina Santoso', username: '@rina_travel', initial: 'R', color: AVATAR_COLORS[2] },
  { id: 2, name: 'Karina Wijaya', username: '@karina_w', initial: 'K', color: AVATAR_COLORS[0] },
  { id: 3, name: 'Marina Putri', username: '@marina_p', initial: 'M', color: AVATAR_COLORS[1] },
];

/** Undang teman — hasil pencarian ditemukan (semua mengandung "rina") */
export function Screen43InviteSearchResults() {
  return (
    <InviteShell searchValue="rina" footer={<InvitePrimaryButton label="Masuk ke Perjalanan" />}>
      <p style={{ fontSize: 12, color: C.muted, margin: '0 0 8px', fontWeight: 600 }}>{results.length} hasil</p>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {results.map((user) => (
          <InviteUserRow key={user.id} user={user} />
        ))}
      </div>
    </InviteShell>
  );
}

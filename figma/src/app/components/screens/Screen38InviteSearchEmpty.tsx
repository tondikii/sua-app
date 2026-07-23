import { InviteShell, InvitePrimaryButton } from '../trip/InviteParts';
import { SearchEmptyState } from '../ui/SearchEmptyState';

/** Undang teman — pencarian tidak menemukan hasil */
export function Screen38InviteSearchEmpty() {
  return (
    <InviteShell
      searchValue="xyznotfound"
      footer={<InvitePrimaryButton label="Masuk ke Perjalanan" />}
    >
      <SearchEmptyState compact />
    </InviteShell>
  );
}

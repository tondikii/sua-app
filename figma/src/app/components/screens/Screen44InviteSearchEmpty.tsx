import { InviteShell, InvitePrimaryButton } from '../trip/InviteParts';
import { SearchEmptyState } from '../ui/SearchEmptyState';

/** Undang teman — pencarian tidak menemukan hasil */
export function Screen44InviteSearchEmpty() {
  return (
    <InviteShell searchValue="xyznotfound" footer={<InvitePrimaryButton label="Masuk ke Perjalanan" />}>
      <SearchEmptyState compact />
    </InviteShell>
  );
}

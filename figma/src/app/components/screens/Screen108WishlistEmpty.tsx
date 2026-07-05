import { WishlistEmptyState, WishlistPageShell } from '../trip/WishlistParts';

/** Empty — belum ada item wishlist */
export function Screen108WishlistEmpty() {
  return (
    <WishlistPageShell
      items={[]}
      activeSort="semua"
      activeTag={null}
      showAddButton={false}
      emptyContent={<WishlistEmptyState />}
    />
  );
}

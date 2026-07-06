import { WishlistFilterEmptyState, WishlistPageShell } from '../trip/WishlistParts';

/** Filter — tidak ada hasil */
export function Screen106WishlistFilterEmpty() {
  return (
    <WishlistPageShell
      items={[]}
      activeSort="semua"
      activeTag="#Budaya"
      searchValue="Borobudur"
      emptyContent={<WishlistFilterEmptyState />}
    />
  );
}

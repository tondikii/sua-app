import { WishlistDeleteModal, WishlistSheetBackdrop } from '../trip/WishlistParts';

/** Modal — konfirmasi hapus item wishlist */
export function Screen113WishlistDelete() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <WishlistSheetBackdrop dimmed />
      <WishlistDeleteModal />
    </div>
  );
}

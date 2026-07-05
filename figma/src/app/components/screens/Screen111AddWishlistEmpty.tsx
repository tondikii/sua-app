import { WishlistFormSheet } from '../trip/WishlistParts';

/** Sheet — tambah wishlist (form kosong) */
export function Screen111AddWishlistEmpty() {
  return (
    <WishlistFormSheet
      title="Tambah ke Wishlist"
      subtitle="Simpan aktivitas impianmu"
      submitDisabled
    />
  );
}

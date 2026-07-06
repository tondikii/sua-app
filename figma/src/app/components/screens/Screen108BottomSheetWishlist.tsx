import { WishlistFormSheet, WISHLIST_FORM_FILLED } from '../trip/WishlistParts';

/** Sheet — tambah wishlist (form terisi) */
export function Screen108BottomSheetWishlist() {
  return (
    <WishlistFormSheet
      title="Tambah ke Wishlist"
      subtitle="Simpan aktivitas impianmu"
      {...WISHLIST_FORM_FILLED}
    />
  );
}

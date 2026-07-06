import { WISHLIST_FORM_FILLED, WISHLIST_SAMPLE, WishlistFormSheet } from '../trip/WishlistParts';

/** Sheet — edit item wishlist */
export function Screen111EditWishlist() {
  return (
    <WishlistFormSheet
      title="Edit Wishlist"
      subtitle={WISHLIST_SAMPLE.location}
      submitLabel="Simpan Perubahan"
      {...WISHLIST_FORM_FILLED}
    />
  );
}

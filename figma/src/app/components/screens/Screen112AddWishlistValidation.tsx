import { WishlistFormSheet } from '../trip/WishlistParts';

/** Sheet — tambah wishlist (validasi error) */
export function Screen112AddWishlistValidation() {
  return (
    <WishlistFormSheet
      title="Tambah ke Wishlist"
      subtitle="Simpan aktivitas impianmu"
      titleError="Nama aktivitas wajib diisi"
    />
  );
}

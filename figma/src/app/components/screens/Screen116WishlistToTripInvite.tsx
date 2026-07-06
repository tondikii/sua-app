import { InviteShell, InvitePrimaryButton } from '../trip/InviteParts';
import { WISHLIST_TO_TRIP, WishlistRemovedBanner } from '../trip/WishlistParts';

/** Undang — sukses buat perjalanan dari wishlist (sama Screen20 + info wishlist dihapus) */
export function Screen116WishlistToTripInvite() {
  return (
    <InviteShell
      tripName={WISHLIST_TO_TRIP.name}
      banner={<WishlistRemovedBanner itemName={WISHLIST_TO_TRIP.sourceWishlist} />}
      footer={<InvitePrimaryButton label="Masuk ke Perjalanan" />}
    />
  );
}

import { FONT } from '../colors';
import { TripDetailPageShell } from '../trip/TripDetailParts';
import { AddItineraryItemButton, ItineraryTabBody } from '../trip/ItineraryParts';
import {
  TRIP_COUNTS_FROM_WISHLIST,
  WISHLIST_IMPORTED_DAY,
  WISHLIST_TRIP_SUBTITLE,
} from '../trip/WishlistParts';

/** Itinerary — 1 aktivitas hasil konversi wishlist (setelah Masuk ke Perjalanan dari Screen119) */
export function Screen117ItineraryFromWishlist() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: FONT,
      }}
    >
      <TripDetailPageShell
        title="Lombok Weekend Escape"
        subtitle={WISHLIST_TRIP_SUBTITLE}
        activeTab="itinerary"
        counts={TRIP_COUNTS_FROM_WISHLIST}
      >
        <ItineraryTabBody
          days={[WISHLIST_IMPORTED_DAY]}
          activeDayId={1}
          footer={<AddItineraryItemButton />}
        />
      </TripDetailPageShell>
    </div>
  );
}

import { CreateTripFooter, CreateTripFormBody, CreateTripShell } from '../trip/CreateTripParts';
import { WISHLIST_TO_TRIP } from '../trip/WishlistParts';

/** Jadikan Perjalanan — prefill dari wishlist, tanggal belum dipilih */
export function Screen117WishlistToTripEmpty() {
  return (
    <CreateTripShell footer={<CreateTripFooter disabled />}>
      <CreateTripFormBody
        name={WISHLIST_TO_TRIP.name}
        tags={WISHLIST_TO_TRIP.tags}
        tagsCompact
        dateMode="fixed"
        dateMuted
        noDateSelected
        showAddButton
      />
    </CreateTripShell>
  );
}

import { TRIP_DRAFT, CreateTripFooter, CreateTripFormBody, CreateTripShell } from '../trip/CreateTripParts';
import { WISHLIST_TO_TRIP } from '../trip/WishlistParts';

/** Jadikan Perjalanan — prefill wishlist + tanggal terisi, siap submit */
export function Screen118WishlistToTripReady() {
  return (
    <CreateTripShell footer={<CreateTripFooter label="Buat Perjalanan" />}>
      <CreateTripFormBody
        name={WISHLIST_TO_TRIP.name}
        tags={WISHLIST_TO_TRIP.tags}
        tagsCompact
        dateMode="fixed"
        calendarStart={TRIP_DRAFT.dateStart}
        calendarEnd={TRIP_DRAFT.dateEnd}
        allDay
      />
    </CreateTripShell>
  );
}

import { TRIP_DATE_PENDING } from '../trip/CreateTripParts';
import { TripDetailPageShell, TRIP_COUNTS_DATE_PENDING } from '../trip/TripDetailParts';
import {
  AddItineraryItemButton,
  ItineraryTabBody,
  LOMBOK_ITINERARY_PENDING_DAY,
} from '../trip/ItineraryParts';

/** Tab Itinerary — tanggal sedang divoting, rundown hari 1 dengan gap */
export function Screen43Destinations() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <TripDetailPageShell
        title="Lombok Weekend Escape"
        subtitle={TRIP_DATE_PENDING}
        activeTab="itinerary"
        counts={TRIP_COUNTS_DATE_PENDING}
      >
        <ItineraryTabBody
          days={[LOMBOK_ITINERARY_PENDING_DAY]}
          activeDayId={1}
          datePending
          footer={<AddItineraryItemButton />}
        />
      </TripDetailPageShell>
    </div>
  );
}

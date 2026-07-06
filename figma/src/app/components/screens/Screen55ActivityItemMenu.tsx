import { FONT } from '../colors';
import { LOMBOK_ITINERARY_DAY_1, ItineraryTabBody } from '../trip/ItineraryParts';
import { TRIP_LOCKED_DATES } from '../trip/CreateTripParts';
import { TripDetailPageShell, TRIP_COUNTS_DATE_FIXED } from '../trip/TripDetailParts';

/** Menu ⋮ aktivitas — Edit & Hapus */
export function Screen55ActivityItemMenu() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <TripDetailPageShell
        title="Lombok Weekend Escape"
        subtitle={TRIP_LOCKED_DATES.subtitle}
        activeTab="itinerary"
        counts={TRIP_COUNTS_DATE_FIXED}
      >
        <ItineraryTabBody
          days={[LOMBOK_ITINERARY_DAY_1]}
          activeDayId={1}
          menuOpenItemId={3}
        />
      </TripDetailPageShell>
    </div>
  );
}

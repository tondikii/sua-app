import { TRIP_LOCKED_DATES } from '../trip/CreateTripParts';
import { TripDetailPageShell, TRIP_COUNTS_DATE_FIXED } from '../trip/TripDetailParts';
import {
  AddItineraryItemButton,
  ItineraryTabBody,
  LOMBOK_ITINERARY_DAY_1,
  LOMBOK_ITINERARY_DAY_2,
} from '../trip/ItineraryParts';

/** Tab Itinerary — trip tanggal pasti (§5A), multi-hari dengan gap */
export function Screen72DestinationsFixedDate() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <TripDetailPageShell
        title="Lombok Weekend Escape"
        subtitle={TRIP_LOCKED_DATES.subtitle}
        activeTab="itinerary"
        counts={TRIP_COUNTS_DATE_FIXED}
      >
        <ItineraryTabBody
          days={[LOMBOK_ITINERARY_DAY_1, LOMBOK_ITINERARY_DAY_2]}
          activeDayId={1}
          referenceNow={{ dayId: 1, time: '14:00' }}
          showStateLegend
          footer={<AddItineraryItemButton />}
        />
      </TripDetailPageShell>
    </div>
  );
}

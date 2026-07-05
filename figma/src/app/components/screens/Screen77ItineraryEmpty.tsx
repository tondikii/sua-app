import { TRIP_DATE_PENDING } from '../trip/CreateTripParts';
import { TripDetailPageShell, TRIP_COUNTS_ITINERARY_EMPTY } from '../trip/TripDetailParts';
import { AddItineraryItemButton, ItineraryEmptyState } from '../trip/ItineraryParts';

/** Tab Itinerary — belum ada aktivitas */
export function Screen77ItineraryEmpty() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <TripDetailPageShell
        title="Lombok Weekend Escape"
        subtitle={TRIP_DATE_PENDING}
        activeTab="itinerary"
        counts={TRIP_COUNTS_ITINERARY_EMPTY}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '16px 20px 0',
            overflow: 'hidden',
          }}
        >
          <ItineraryEmptyState />
          <div style={{ padding: '24px 0 32px', flexShrink: 0 }}>
            <AddItineraryItemButton label="Buat Aktivitas Pertama" />
          </div>
        </div>
      </TripDetailPageShell>
    </div>
  );
}

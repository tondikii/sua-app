import { C, FONT } from '../colors';
import { TRIP_DATE_PENDING } from '../trip/CreateTripParts';
import { TripDetailHeader, TripDetailTabs } from '../trip/TripDetailParts';
import { ITINERARY_VOTING_TITLE } from '../trip/ItineraryParts';
import { VotingLockedModal } from '../trip/VotingLockedModal';

/** Modal — voting aktivitas itinerary selesai */
export function Screen74VotingLockedDestinasi() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: C.white,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <TripDetailHeader title="Lombok Weekend Escape" subtitle={TRIP_DATE_PENDING} />
      <TripDetailTabs activeTab="voting" />

      <div style={{ flex: 1, padding: '16px 20px', opacity: 0.35, pointerEvents: 'none' }}>
        <div style={{ height: 80, backgroundColor: C.light, borderRadius: 16 }} />
      </div>

      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26,26,46,0.45)', zIndex: 10 }} />
      <VotingLockedModal
        type="destinasi"
        title={ITINERARY_VOTING_TITLE}
        resultValue="Warung Plecing Arjuna"
        hint="Aktivitas ditambahkan ke itinerary."
      />
    </div>
  );
}

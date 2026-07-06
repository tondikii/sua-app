import { C, FONT } from '../colors';
import { TRIP_DATE_PENDING } from '../trip/CreateTripParts';
import { TripDetailHeader, TripDetailTabs } from '../trip/TripDetailParts';
import { ITINERARY_VOTING_TITLE } from '../trip/ItineraryParts';
import { VotingDeleteModal } from '../trip/VotingDeleteModal';
import { VotingCollapseSection } from '../trip/VotingParts';

/** Modal — konfirmasi hapus voting (via menu ⋮ pada card collapse) */
export function Screen68DeleteVotingModal() {
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
      <div style={{ opacity: 0.35, pointerEvents: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TripDetailHeader title="Lombok Weekend Escape" subtitle={TRIP_DATE_PENDING} />
        <TripDetailTabs activeTab="voting" />
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <VotingCollapseSection
            type="destinasi"
            title={ITINERARY_VOTING_TITLE}
            subtitle="3 opsi kuliner · slot 11:30–13:00"
            canManage
            showMenuOpen
          >
            <div />
          </VotingCollapseSection>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(26,26,46,0.45)',
          zIndex: 10,
        }}
      />

      <VotingDeleteModal votingTitle={ITINERARY_VOTING_TITLE} />
    </div>
  );
}

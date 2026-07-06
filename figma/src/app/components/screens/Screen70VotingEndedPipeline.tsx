import { C, FONT } from '../colors';
import { TRIP_LOCKED_DATES, VOTING_DATE_CANDIDATES } from '../trip/CreateTripParts';
import { TripDetailHeader, TripDetailTabs, TRIP_COUNTS_DATE_FIXED } from '../trip/TripDetailParts';
import { ITINERARY_VOTING_CANDIDATES, ITINERARY_VOTING_TITLE } from '../trip/ItineraryParts';
import { CreateVotingFab, VotingCollapseSection, VotingCandidateList } from '../trip/VotingParts';

const destCandidates = ITINERARY_VOTING_CANDIDATES.map((name, i) => ({
  id: i + 1,
  name,
  votes: [3, 2][i] ?? 1,
  avatars: [['R', 'B', 'A'], ['S', 'M']][i] ?? ['D'],
  voted: i === 1,
}));

/** Tab Voting — tanggal selesai (tetap di pipeline) + voting aktif lainnya */
export function Screen70VotingEndedPipeline() {
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
      }}
    >
      <TripDetailHeader title="Lombok Weekend Escape" subtitle={TRIP_LOCKED_DATES.subtitle} />
      <TripDetailTabs activeTab="voting" counts={TRIP_COUNTS_DATE_FIXED} />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: '16px 20px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          overflowY: 'auto',
        }}
      >
        <VotingCollapseSection
          type="tanggal"
          title="Tanggal Perjalanan"
          subtitle={`Pemenang: ${TRIP_LOCKED_DATES.label} · 4 suara`}
          status="ended"
          canManage
        >
          <VotingCandidateList items={VOTING_DATE_CANDIDATES} labelKey="range" readOnly winnerId={2} />
        </VotingCollapseSection>

        <VotingCollapseSection
          type="destinasi"
          title={ITINERARY_VOTING_TITLE}
          subtitle="3 opsi kuliner · slot 11:30–13:00 · deadline 20 Jun"
          defaultOpen
          canManage
        >
          <VotingCandidateList items={destCandidates} labelKey="name" />
        </VotingCollapseSection>

        <CreateVotingFab />
      </div>
    </div>
  );
}

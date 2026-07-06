import { C, FONT } from '../colors';
import { TRIP_DATE_PENDING, VOTING_DATE_CANDIDATES } from '../trip/CreateTripParts';
import { TripDetailHeader, TripDetailTabs } from '../trip/TripDetailParts';
import { ITINERARY_VOTING_CANDIDATES, ITINERARY_VOTING_TITLE } from '../trip/ItineraryParts';
import { CreateVotingFab, VotingCollapseSection, VotingCandidateList } from '../trip/VotingParts';

/** Tab Voting — menu ⋮ aktif: Edit · Akhiri Voting · Hapus */
export function Screen69VotingCardMenu() {
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
      <TripDetailHeader title="Lombok Weekend Escape" subtitle={TRIP_DATE_PENDING} />
      <TripDetailTabs activeTab="voting" />

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
          subtitle="1 dari 5 belum vote · 3 kandidat"
          defaultOpen
          canManage
          showMenuOpen
        >
          <VotingCandidateList items={VOTING_DATE_CANDIDATES} labelKey="range" />
        </VotingCollapseSection>

        <VotingCollapseSection type="destinasi" title={ITINERARY_VOTING_TITLE} subtitle="3 opsi kuliner · slot 11:30–13:00" canManage>
          <VotingCandidateList
            items={ITINERARY_VOTING_CANDIDATES.slice(0, 2).map((name, i) => ({
              id: i + 1,
              name,
              votes: [3, 2][i],
              avatars: [['R', 'B', 'A'], ['S', 'M']][i],
              voted: i === 1,
            }))}
            labelKey="name"
          />
        </VotingCollapseSection>

        <CreateVotingFab />
      </div>
    </div>
  );
}

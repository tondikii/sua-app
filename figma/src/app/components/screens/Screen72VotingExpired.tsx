import { C, FONT } from '../colors';
import { TRIP_DATE_PENDING } from '../trip/CreateTripParts';
import { TripDetailHeader, TripDetailTabs } from '../trip/TripDetailParts';
import { ITINERARY_VOTING_CANDIDATES, ITINERARY_VOTING_TITLE } from '../trip/ItineraryParts';
import { CreateVotingFab, VotingCollapseSection, VotingCandidateList } from '../trip/VotingParts';

/** Tab Voting — aktivitas itinerary auto berakhir (tenggat lewat) */
export function Screen72VotingExpired() {
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
          canManage
        >
          <VotingCandidateList
            items={[
              {
                id: 1,
                range: '12 – 15 Jun 2026',
                days: '4 hari',
                votes: 2,
                avatars: ['R', 'B'],
                voted: false,
              },
              {
                id: 2,
                range: '19 – 22 Jun 2026',
                days: '4 hari',
                votes: 4,
                avatars: ['R', 'B', 'A', 'D'],
                voted: true,
              },
              {
                id: 3,
                range: '26 – 29 Jun 2026',
                days: '4 hari',
                votes: 1,
                avatars: ['S'],
                voted: false,
              },
            ]}
            labelKey="range"
          />
        </VotingCollapseSection>

        <VotingCollapseSection
          type="destinasi"
          title={ITINERARY_VOTING_TITLE}
          subtitle="Pemenang: Warung Plecing Arjuna · tenggat lewat"
          status="expired"
          canManage
        >
          <VotingCandidateList
            items={ITINERARY_VOTING_CANDIDATES.slice(0, 2).map((name, i) => ({
              id: i + 1,
              name,
              votes: [3, 2][i],
              avatars: [
                ['R', 'B', 'A'],
                ['S', 'M'],
              ][i],
            }))}
            labelKey="name"
            readOnly
            winnerId={1}
          />
        </VotingCollapseSection>

        <CreateVotingFab />
      </div>
    </div>
  );
}

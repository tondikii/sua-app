import { C, FONT } from '../colors';
import { TRIP_DATE_PENDING, VOTING_DATE_CANDIDATES } from '../trip/CreateTripParts';
import { TripDetailHeader, TripDetailTabs, TRIP_COUNTS_DATE_PENDING } from '../trip/TripDetailParts';
import { ITINERARY_VOTING_TITLE, ITINERARY_VOTING_CANDIDATES } from '../trip/ItineraryParts';
import { CreateVotingFab, VotingCollapseSection, VotingCandidateList } from '../trip/VotingParts';

const destCandidates = ITINERARY_VOTING_CANDIDATES.map((name, i) => ({
  id: i + 1,
  name,
  votes: [3, 2, 1][i],
  avatars: [['R', 'B', 'A'], ['S', 'M'], ['D']][i],
  voted: i === 1,
}));

const otherCandidates = [
  { id: 1, name: 'Transport: Sewa mobil', votes: 4, avatars: ['R', 'B', 'A', 'D'], voted: false },
  { id: 2, name: 'Transport: Travel bus', votes: 1, avatars: ['S'], voted: false },
];

/** Tab Voting — collapse per jenis, akhiri via menu ⋮ */
export function Screen16Voting() {
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
      <TripDetailTabs activeTab="voting" counts={TRIP_COUNTS_DATE_PENDING} />

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
          subtitle="Otomatis dari buat perjalanan · 3 kandidat · tenggat 18 Jun"
          defaultOpen
          canManage
        >
          <VotingCandidateList items={VOTING_DATE_CANDIDATES} labelKey="range" />
        </VotingCollapseSection>

        <VotingCollapseSection
          type="destinasi"
          title={ITINERARY_VOTING_TITLE}
          subtitle="3 opsi kuliner · slot 11:30–13:00 · deadline 20 Jun"
          canManage
        >
          <VotingCandidateList items={destCandidates} labelKey="name" />
        </VotingCollapseSection>

        <VotingCollapseSection
          type="lainnya"
          title="Transportasi ke Lombok"
          subtitle="2 opsi · tanpa tenggat"
          canManage
        >
          <VotingCandidateList items={otherCandidates} labelKey="name" />
        </VotingCollapseSection>

        <CreateVotingFab />
      </div>
    </div>
  );
}

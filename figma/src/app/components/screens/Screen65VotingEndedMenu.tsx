import { C, FONT } from '../colors';
import { TRIP_LOCKED_DATES, VOTING_DATE_CANDIDATES } from '../trip/CreateTripParts';
import { TripDetailHeader, TripDetailTabs } from '../trip/TripDetailParts';
import { CreateVotingFab, VotingCollapseSection, VotingCandidateList } from '../trip/VotingParts';

/** Tab Voting — card selesai, menu ⋮ hanya Hapus */
export function Screen65VotingEndedMenu() {
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
          subtitle={`Pemenang: ${TRIP_LOCKED_DATES.label} · dikunci manual`}
          defaultOpen
          status="ended"
          canManage
          showMenuOpen
          menuVariant="ended"
        >
          <VotingCandidateList items={VOTING_DATE_CANDIDATES} labelKey="range" readOnly winnerId={2} />
        </VotingCollapseSection>

        <CreateVotingFab />
      </div>
    </div>
  );
}

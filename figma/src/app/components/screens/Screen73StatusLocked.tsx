import { C, FONT } from '../colors';
import { TRIP_LOCKED_DATES, TRIP_DATE_PENDING, VOTING_DATE_CANDIDATES } from '../trip/CreateTripParts';
import { TripDetailHeader, TripDetailTabs } from '../trip/TripDetailParts';
import { VotingCollapseSection, VotingCandidateList } from '../trip/VotingParts';
import { VotingLockedModal } from '../trip/VotingLockedModal';

/** Modal konfirmasi — voting tanggal dikunci, card selesai tetap di pipeline */
export function Screen73StatusLocked() {
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

      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: '16px 20px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          overflowY: 'auto',
          opacity: 0.35,
          pointerEvents: 'none',
        }}
      >
        <VotingCollapseSection
          type="tanggal"
          title="Tanggal Perjalanan"
          subtitle="3 kandidat · sedang dikunci..."
          defaultOpen
          canManage
        >
          <VotingCandidateList items={VOTING_DATE_CANDIDATES} labelKey="range" />
        </VotingCollapseSection>
      </div>

      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26,26,46,0.45)', zIndex: 10 }} />
      <VotingLockedModal
        type="tanggal"
        title="Tanggal Perjalanan"
        resultValue={TRIP_LOCKED_DATES.subtitle}
        hint="Tanggal resmi trip diperbarui. Card voting tetap ada dengan badge Selesai."
      />
    </div>
  );
}

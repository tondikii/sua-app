import { C, FONT } from '../colors';
import { TRIP_LOCKED_DATES } from '../trip/CreateTripParts';
import { TripDetailHeader, TripDetailTabs, TRIP_COUNTS_VOTING_EMPTY } from '../trip/TripDetailParts';
import { CreateVotingButton, VotingTabEmptyBody } from '../trip/VotingParts';

/** Tab Voting kosong — tanggal sudah pasti, belum ada voting aktivitas / lainnya */
export function Screen57VotingEmpty() {
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
      <TripDetailTabs activeTab="voting" counts={TRIP_COUNTS_VOTING_EMPTY} />
      <VotingTabEmptyBody footer={<CreateVotingButton />} />
    </div>
  );
}

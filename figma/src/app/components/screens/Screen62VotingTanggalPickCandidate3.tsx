import { VotingTanggalPickCandidateScreen } from '../trip/CreateVotingSheetParts';
import { TRIP_CURRENT_DATE_CANDIDATE, TRIP_DATE_CANDIDATES } from '../trip/CreateTripParts';

/** Kandidat 3 terpilih di kalender (2 tersimpan) */
export function Screen62VotingTanggalPickCandidate3() {
  return (
    <VotingTanggalPickCandidateScreen
      savedCandidates={[TRIP_CURRENT_DATE_CANDIDATE, TRIP_DATE_CANDIDATES[1]]}
      activeCandidate={TRIP_DATE_CANDIDATES[2]}
    />
  );
}

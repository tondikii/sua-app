import { VotingTanggalPickCandidateScreen } from '../trip/CreateVotingSheetParts';
import { TRIP_CURRENT_DATE_CANDIDATE, TRIP_DATE_CANDIDATES } from '../trip/CreateTripParts';

/** Kandidat 2 terpilih di kalender, belum disimpan (1 tersimpan) */
export function Screen60CreateVotingTanggalPickCandidate() {
  return (
    <VotingTanggalPickCandidateScreen
      savedCandidates={[TRIP_CURRENT_DATE_CANDIDATE]}
      activeCandidate={TRIP_DATE_CANDIDATES[1]}
      allDay={false}
    />
  );
}

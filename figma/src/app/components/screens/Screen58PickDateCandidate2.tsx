import {
  TRIP_DATE_CANDIDATES,
  CreateTripFooter,
  CreateTripFormBody,
  CreateTripShell,
} from '../trip/CreateTripParts';

const CANDIDATE_2 = TRIP_DATE_CANDIDATES[1];

/** [Belum pasti] Kandidat 1 tersimpan — pilih kandidat 2 */
export function Screen58PickDateCandidate2() {
  return (
    <CreateTripShell footer={<CreateTripFooter />}>
      <CreateTripFormBody
        tagsCompact
        compact
        dateMode="candidates"
        calendarStart={CANDIDATE_2.start}
        calendarEnd={CANDIDATE_2.end}
        savedCandidates={[TRIP_DATE_CANDIDATES[0]]}
        activeCandidate={CANDIDATE_2}
        showCandidateList
        showAddButton
        highlightAddButton
        allDay={false}
        votingDeadline="18 Jun 2026, 23:59"
      />
    </CreateTripShell>
  );
}

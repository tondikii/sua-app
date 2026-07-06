import {
  TRIP_DATE_CANDIDATES,
  CreateTripFooter,
  CreateTripFormBody,
  CreateTripShell,
} from '../trip/CreateTripParts';

const CANDIDATE_3 = TRIP_DATE_CANDIDATES[2];

/** [Belum pasti] Kandidat 1–2 tersimpan — pilih kandidat 3 */
export function Screen31MultiDatePicker() {
  return (
    <CreateTripShell footer={<CreateTripFooter />}>
      <CreateTripFormBody
        tagsCompact
        compact
        dateMode="candidates"
        calendarStart={CANDIDATE_3.start}
        calendarEnd={CANDIDATE_3.end}
        savedCandidates={TRIP_DATE_CANDIDATES.slice(0, 2)}
        activeCandidate={CANDIDATE_3}
        showCandidateList
        showAddButton
        highlightAddButton
        allDay={false}
        votingDeadline="18 Jun 2026, 23:59"
      />
    </CreateTripShell>
  );
}

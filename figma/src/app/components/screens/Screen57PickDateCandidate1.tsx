import {
  TRIP_DATE_CANDIDATES,
  CreateTripFooter,
  CreateTripFormBody,
  CreateTripShell,
} from '../trip/CreateTripParts';

const CANDIDATE_1 = TRIP_DATE_CANDIDATES[0];

/** [Belum pasti] Kandidat 1 terpilih di kalender, belum disimpan */
export function Screen57PickDateCandidate1() {
  return (
    <CreateTripShell footer={<CreateTripFooter />}>
      <CreateTripFormBody
        tagsCompact
        compact
        dateMode="candidates"
        calendarStart={CANDIDATE_1.start}
        calendarEnd={CANDIDATE_1.end}
        activeCandidate={CANDIDATE_1}
        showCandidateList
        showAddButton
        highlightAddButton
      />
    </CreateTripShell>
  );
}

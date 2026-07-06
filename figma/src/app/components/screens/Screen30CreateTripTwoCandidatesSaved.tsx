import {
  TRIP_DATE_CANDIDATES,
  CreateTripFooter,
  CreateTripFormBody,
  CreateTripShell,
} from '../trip/CreateTripParts';

/** [B] 2 kandidat tersimpan — tenggat opsional, belum pilih kandidat ke-3 */
export function Screen30CreateTripTwoCandidatesSaved() {
  return (
    <CreateTripShell footer={<CreateTripFooter />}>
      <CreateTripFormBody
        tagsCompact
        compact
        dateMode="candidates"
        calendarStart={TRIP_DATE_CANDIDATES[1].start}
        calendarEnd={TRIP_DATE_CANDIDATES[1].end}
        savedCandidates={TRIP_DATE_CANDIDATES.slice(0, 2)}
        showCandidateList
        showAddButton
        highlightAddButton
        votingDeadline="18 Jun 2026, 23:59"
      />
    </CreateTripShell>
  );
}

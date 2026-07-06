import {
  TRIP_DATE_CANDIDATES,
  CreateTripFooter,
  CreateTripFormBody,
  CreateTripShell,
} from '../trip/CreateTripParts';

/** [B] Kandidat 1 tersimpan — tenggat muncul (kosong), siap tambah kandidat lagi */
export function Screen28CreateTripCandidate1Saved() {
  return (
    <CreateTripShell footer={<CreateTripFooter />}>
      <CreateTripFormBody
        tagsCompact
        compact
        dateMode="candidates"
        calendarStart={TRIP_DATE_CANDIDATES[0].start}
        calendarEnd={TRIP_DATE_CANDIDATES[0].end}
        savedCandidates={[TRIP_DATE_CANDIDATES[0]]}
        showCandidateList
        showAddButton
        highlightAddButton
      />
    </CreateTripShell>
  );
}

import {
  TRIP_DATE_CANDIDATES,
  CreateTripFooter,
  CreateTripFormBody,
  CreateTripShell,
} from '../trip/CreateTripParts';

/** [Belum pasti] 3 kandidat + tenggat — siap buat perjalanan */
export function Screen32DateCandidatesComplete() {
  return (
    <CreateTripShell footer={<CreateTripFooter />}>
      <CreateTripFormBody
        tagsCompact
        compact
        dateMode="candidates"
        calendarStart={TRIP_DATE_CANDIDATES[0].start}
        calendarEnd={TRIP_DATE_CANDIDATES[0].end}
        savedCandidates={TRIP_DATE_CANDIDATES}
        showCandidateList
        showAddButton={false}
        showTime={false}
        votingDeadline="18 Jun 2026, 23:59"
      />
    </CreateTripShell>
  );
}

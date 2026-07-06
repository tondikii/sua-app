import { TRIP_DATE_CANDIDATES, CreateTripFooter, CreateTripFormBody, CreateTripShell } from '../trip/CreateTripParts';

/** [B] Submit loading — setelah tap Buat Perjalanan */
export function Screen34CreateTripSubmitting() {
  return (
    <CreateTripShell footer={<CreateTripFooter loading />}>
      <CreateTripFormBody
        tagsCompact
        compact
        dateMode="candidates"
        savedCandidates={TRIP_DATE_CANDIDATES}
        showCandidateList
        showAddButton={false}
        showTime={false}
        votingDeadline="18 Jun 2026, 23:59"
      />
    </CreateTripShell>
  );
}

import { TRIP_DRAFT, CreateTripFooter, CreateTripFormBody, CreateTripShell } from '../trip/CreateTripParts';

/** [A] Tanggal pasti — semua field terisi, sepanjang hari, siap submit */
export function Screen23CreateTripFixedDate() {
  return (
    <CreateTripShell footer={<CreateTripFooter />}>
      <CreateTripFormBody
        tagsCompact
        dateMode="fixed"
        calendarStart={TRIP_DRAFT.dateStart}
        calendarEnd={TRIP_DRAFT.dateEnd}
        allDay
      />
    </CreateTripShell>
  );
}

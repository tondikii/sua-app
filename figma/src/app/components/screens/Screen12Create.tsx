import { C } from '../colors';
import {
  TRIP_DRAFT,
  TripNameField,
  TripTagsField,
  TripCalendar,
  AddCandidateDateButton,
  CreateTripFooter,
  CreateTripShell,
} from '../trip/CreateTripParts';

export function Screen12Create() {
  return (
    <CreateTripShell footer={<CreateTripFooter />}>
      <TripNameField value={TRIP_DRAFT.name} />
      <TripTagsField tags={TRIP_DRAFT.tags} />

      <div>
        <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 10 }}>
          Pilih Tanggal
        </label>
        <TripCalendar selectedStart={TRIP_DRAFT.dateStart} selectedEnd={TRIP_DRAFT.dateEnd} />
        <AddCandidateDateButton />
      </div>
    </CreateTripShell>
  );
}

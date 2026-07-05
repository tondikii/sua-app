import {
  TRIP_DRAFT,
  TRIP_LOCKED_DATES,
  TripNameField,
  TripTagsField,
  TripDateSection,
  CreateTripFooter,
  CreateTripShell,
} from '../trip/CreateTripParts';
import { TripDetailBackdrop } from '../trip/TripDetailBackdrop';

/** Edit Perjalanan — form konsisten dengan Screen12Create */
export function Screen51TripEdit() {
  return (
    <TripDetailBackdrop menuHighlightId="edit">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          backgroundColor: 'white',
        }}
      >
        <CreateTripShell title="Edit Perjalanan" footer={<CreateTripFooter label="Simpan" />}>
          <TripNameField value={TRIP_DRAFT.name} />
          <TripTagsField tags={TRIP_DRAFT.tags} />
          <TripDateSection
            selectedStart={TRIP_LOCKED_DATES.start}
            selectedEnd={TRIP_LOCKED_DATES.end}
            showTime
            allDay={TRIP_LOCKED_DATES.allDay}
          />
        </CreateTripShell>
      </div>
    </TripDetailBackdrop>
  );
}

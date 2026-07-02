import { C } from '../colors';
import {
  TripNameField,
  TripTagsField,
  TripCalendar,
  AddCandidateDateButton,
  CreateTripFooter,
  CreateTripShell,
} from '../trip/CreateTripParts';

export function Screen14FormValidation() {
  return (
    <CreateTripShell
      footer={<CreateTripFooter disabled errorSummary="1 kolom wajib belum diisi" />}
    >
      <TripNameField error="Nama perjalanan tidak boleh kosong." />
      <TripTagsField tags={[]} />

      <div>
        <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 10 }}>
          Pilih Tanggal
        </label>
        <TripCalendar muted />
        <AddCandidateDateButton compact />
      </div>
    </CreateTripShell>
  );
}

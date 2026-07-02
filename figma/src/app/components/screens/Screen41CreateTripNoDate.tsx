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

/** Buat perjalanan — nama & tag terisi, tanggal belum dipilih */
export function Screen41CreateTripNoDate() {
  return (
    <CreateTripShell
      footer={<CreateTripFooter disabled errorSummary="Pilih minimal 1 kandidat tanggal" />}
    >
      <TripNameField value={TRIP_DRAFT.name} />
      <TripTagsField tags={TRIP_DRAFT.tags} />

      <div>
        <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 10 }}>
          Pilih Tanggal <span style={{ color: '#E53935' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <TripCalendar muted />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 18,
              border: '2px solid #E53935',
              pointerEvents: 'none',
              boxShadow: '0 0 0 4px rgba(229,57,53,0.08)',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 7, paddingLeft: 2 }}>
          <span style={{ fontSize: 12, color: '#E53935', fontWeight: 600 }}>
            Pilih rentang tanggal di kalender, lalu tambahkan sebagai kandidat.
          </span>
        </div>
        <AddCandidateDateButton />
      </div>
    </CreateTripShell>
  );
}

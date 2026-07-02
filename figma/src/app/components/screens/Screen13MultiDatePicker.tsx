import { Calendar, Check } from 'lucide-react';
import { C } from '../colors';
import {
  TRIP_DRAFT,
  TripNameField,
  TripTagsField,
  TripCalendar,
  CreateTripFooter,
  CreateTripShell,
} from '../trip/CreateTripParts';

export function Screen13MultiDatePicker() {
  return (
    <CreateTripShell footer={<CreateTripFooter />}>
      {/* Ringkasan field — data sama dengan layar 12, layout ringkas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <TripNameField value={TRIP_DRAFT.name} />
        <TripTagsField tags={TRIP_DRAFT.tags} compact />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal }}>Pilih Tanggal</label>
          <span style={{ fontSize: 11, color: C.coral, fontWeight: 700 }}>2 Kandidat</span>
        </div>
        <TripCalendar
          selectedStart={TRIP_DRAFT.dateStart}
          selectedEnd={TRIP_DRAFT.dateEnd}
          size="compact"
        />
      </div>

      <div>
        <label
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: C.charcoal,
            display: 'block',
            marginBottom: 10,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          Kandidat Tanggal
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              backgroundColor: C.coralLight,
              borderRadius: 14,
              padding: '12px 14px',
              border: `1.5px solid ${C.coral}`,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                backgroundColor: C.coral,
                borderRadius: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, color: 'white' }}>1</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: C.coral, margin: 0 }}>
                Kandidat 1: {TRIP_DRAFT.dateStart}–{TRIP_DRAFT.dateEnd} Juni
              </p>
              <p style={{ fontSize: 11, color: `${C.coral}80`, margin: '2px 0 0', fontWeight: 500 }}>
                4 hari · Senin – Kamis
              </p>
            </div>
            <Check size={16} color={C.coral} strokeWidth={2.5} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              backgroundColor: C.white,
              borderRadius: 14,
              padding: '12px 14px',
              border: `2px dashed ${C.border}`,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                backgroundColor: C.light,
                borderRadius: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, color: C.muted }}>2</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.mutedLight, margin: 0 }}>
                Kandidat 2: Pilih tanggal...
              </p>
              <p style={{ fontSize: 11, color: C.border, margin: '2px 0 0', fontWeight: 500 }}>
                Ketuk kalender di atas
              </p>
            </div>
            <Calendar size={16} color={C.mutedLight} strokeWidth={2} />
          </div>
        </div>
      </div>
    </CreateTripShell>
  );
}

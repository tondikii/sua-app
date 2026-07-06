import { CheckCircle2 } from 'lucide-react';
import { C, FONT } from '../colors';
import { SearchInput } from '../search/SearchParts';
import { TRIP_DRAFT } from '../trip/CreateTripParts';
import { InvitePrimaryButton } from '../trip/InviteParts';

/** Langkah awal setelah tap "Buat Perjalanan" — cari teman untuk diundang */
export function Screen20BottomSheetUndang() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: C.white,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      <div style={{ height: 60 }} />

      <div style={{ padding: '8px 22px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: C.tealLight,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={22} color={C.teal} strokeWidth={2.5} />
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.3 }}>
              Perjalanan berhasil dibuat!
            </h2>
            <p style={{ fontSize: 12, color: C.muted, margin: '3px 0 0', fontWeight: 600 }}>{TRIP_DRAFT.name}</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
          Ajak teman untuk merencanakan bareng. Kamu bisa lewati dulu dan undang nanti dari detail perjalanan.
        </p>
      </div>

      <div style={{ padding: '0 22px', flexShrink: 0 }}>
        <div style={{ marginBottom: 10 }}>
          <SearchInput placeholder="Cari username / email..." />
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          padding: '16px 22px 28px',
          borderTop: `1px solid ${C.border}`,
          flexShrink: 0,
        }}
      >
        <InvitePrimaryButton label="Masuk ke Perjalanan" />
      </div>
    </div>
  );
}

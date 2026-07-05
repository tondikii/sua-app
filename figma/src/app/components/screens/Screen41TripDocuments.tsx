import { C, FONT } from '../colors';
import { TRIP_DATE_PENDING } from '../trip/CreateTripParts';
import { TripDetailHeader, TripDetailTabs, TRIP_COUNTS_DATE_PENDING } from '../trip/TripDetailParts';
import { DocumentGrid } from '../trip/DocumentParts';

/** Tab Media — unggah foto/video, pilih salah satu sebagai cover trip */
export function Screen41TripDocuments() {
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
      <TripDetailHeader title="Lombok Weekend Escape" subtitle={TRIP_DATE_PENDING} />
      <TripDetailTabs activeTab="media" counts={TRIP_COUNTS_DATE_PENDING} />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: '16px 20px 12px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, margin: '0 0 4px' }}>Media Perjalanan</p>
        <p style={{ fontSize: 11, color: C.muted, margin: '0 0 16px', lineHeight: 1.5 }}>
          Unggah foto atau video — termasuk yang dikirim lewat chat grup.
        </p>
        <DocumentGrid showSetCover />
      </div>
    </div>
  );
}

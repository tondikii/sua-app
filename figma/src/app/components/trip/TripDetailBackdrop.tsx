import type { ReactNode } from 'react';
import { C, FONT } from '../colors';
import { TripDetailHeader, TripDetailTabs, DEFAULT_TRIP_TAB_COUNTS, type TripDetailTabId, type TripTabCounts } from './TripDetailParts';
import { TripDetailMenuSheet, type TripMenuItemId } from './TripDetailMenuSheet';
import { TRIP_DATE_PENDING } from './CreateTripParts';

type TripDetailBackdropProps = {
  children: ReactNode;
  menuHighlightId?: TripMenuItemId;
  subtitle?: string;
  activeTab?: TripDetailTabId;
  counts?: TripTabCounts;
  showMenu?: boolean;
  showOverlay?: boolean;
};

/** Backdrop detail trip — dipakai untuk callback UI dari menu ⋮ */
export function TripDetailBackdrop({
  children,
  menuHighlightId,
  subtitle = TRIP_DATE_PENDING,
  activeTab = 'itinerary',
  counts = { ...DEFAULT_TRIP_TAB_COUNTS, voting: 0 },
  showMenu = true,
  showOverlay = true,
}: TripDetailBackdropProps) {
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
        position: 'relative',
      }}
    >
      <TripDetailHeader title="Lombok Weekend Escape" subtitle={subtitle} menuOpen={!!menuHighlightId} />
      <TripDetailTabs activeTab={activeTab} counts={counts} />

      <div style={{ flex: 1, padding: '16px 20px', opacity: 0.35, pointerEvents: 'none' }}>
        <div style={{ height: 100, backgroundColor: C.light, borderRadius: 16, marginBottom: 10 }} />
        <div style={{ height: 100, backgroundColor: C.light, borderRadius: 16 }} />
      </div>

      {showMenu && menuHighlightId && <TripDetailMenuSheet highlightId={menuHighlightId} />}

      {showOverlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(26,26,46,0.45)',
            zIndex: 10,
          }}
        />
      )}

      {children}
    </div>
  );
}

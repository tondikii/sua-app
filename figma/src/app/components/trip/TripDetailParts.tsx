import type { ReactNode } from 'react';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { C, FONT } from '../colors';

export type TripDetailTabId = 'itinerary' | 'voting' | 'chat' | 'media';

/** Chat counter = jumlah pesan belum dibaca saja */
export type TripTabCounts = Record<TripDetailTabId, number>;

export const DEFAULT_TRIP_TAB_COUNTS: TripTabCounts = {
  itinerary: 5,
  voting: 2,
  chat: 5,
  media: 4,
};

/** Counter tab — trip tanggal masih divoting */
export const TRIP_COUNTS_DATE_PENDING: TripTabCounts = {
  itinerary: 4,
  voting: 2,
  chat: 5,
  media: 4,
};

/** Counter tab — trip tanggal sudah pasti */
export const TRIP_COUNTS_DATE_FIXED: TripTabCounts = {
  itinerary: 6,
  voting: 2,
  chat: 2,
  media: 4,
};

/** Counter tab — itinerary kosong */
export const TRIP_COUNTS_ITINERARY_EMPTY: TripTabCounts = {
  itinerary: 0,
  voting: 2,
  chat: 5,
  media: 4,
};

/** Counter tab — voting kosong (selain voting tanggal otomatis) */
export const TRIP_COUNTS_VOTING_EMPTY: TripTabCounts = {
  itinerary: 4,
  voting: 0,
  chat: 5,
  media: 4,
};

const TAB_LABELS: { id: TripDetailTabId; label: string }[] = [
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'voting', label: 'Voting' },
  { id: 'chat', label: 'Chat' },
  { id: 'media', label: 'Media' },
];

type TripDetailHeaderProps = {
  title: string;
  subtitle: string;
  menuOpen?: boolean;
};

/** Header detail trip — aksi Undang & Kalender ada di menu ⋮ */
export function TripDetailHeader({ title, subtitle, menuOpen = false }: TripDetailHeaderProps) {
  return (
    <>
      <div style={{ height: 60 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 20px 0' }}>
        <div
          style={{
            width: 36,
            height: 36,
            backgroundColor: C.light,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={18} color={C.charcoal} strokeWidth={2.5} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <h2
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: C.charcoal,
              margin: 0,
              letterSpacing: -0.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>{subtitle}</p>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            backgroundColor: menuOpen ? C.coralLight : C.light,
            border: menuOpen ? `1.5px solid ${C.coral}` : '1.5px solid transparent',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: menuOpen ? `0 2px 8px ${C.coral}25` : 'none',
          }}
        >
          <MoreHorizontal size={18} color={menuOpen ? C.coral : C.charcoal} />
        </div>
      </div>
    </>
  );
}

type TripDetailTabsProps = {
  activeTab: TripDetailTabId;
  counts?: TripTabCounts;
};

export function TripDetailTabs({ activeTab, counts = DEFAULT_TRIP_TAB_COUNTS }: TripDetailTabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        margin: '14px 16px 0',
        borderBottom: `1.5px solid ${C.border}`,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      {TAB_LABELS.map((tab) => {
        const active = tab.id === activeTab;
        const count = counts[tab.id];
        const isChat = tab.id === 'chat';
        const isMedia = tab.id === 'media';
        const isVoting = tab.id === 'voting';
        const showUnread = isChat && count > 0 && !active;
        const showItemCount = !isChat && (count > 0 || isMedia || isVoting);

        return (
          <div
            key={tab.id}
            style={{
              flex: 1,
              paddingBottom: 12,
              paddingTop: 2,
              cursor: 'pointer',
              borderBottom: active ? `2.5px solid ${C.coral}` : 'none',
              marginBottom: -1.5,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? C.coral : C.muted }}>
              {tab.label}
            </span>
            {showUnread && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: 'white',
                  backgroundColor: C.coral,
                  padding: '2px 7px',
                  borderRadius: 20,
                  minWidth: 20,
                  textAlign: 'center',
                  lineHeight: 1.35,
                  boxShadow: `0 2px 8px ${C.coral}50`,
                }}
              >
                {count > 9 ? '9+' : count}
              </span>
            )}
            {showItemCount && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: active ? C.coral : C.muted,
                  backgroundColor: active ? C.coralLight : C.light,
                  padding: '2px 6px',
                  borderRadius: 8,
                  minWidth: 18,
                  textAlign: 'center',
                  lineHeight: 1.35,
                }}
              >
                {count}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function TripDetailPageShell({
  title,
  subtitle,
  activeTab,
  counts,
  children,
  contentBg = C.white,
}: {
  title: string;
  subtitle: string;
  activeTab: TripDetailTabId;
  counts?: TripTabCounts;
  children: ReactNode;
  contentBg?: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: contentBg,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <TripDetailHeader title={title} subtitle={subtitle} />
      <TripDetailTabs activeTab={activeTab} counts={counts} />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

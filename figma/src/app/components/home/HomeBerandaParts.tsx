import type { ReactNode } from 'react';
import { Bell, Calendar } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { BottomNav } from '../BottomNav';
import { TripTags } from '../ui/TripTags';

export type HomeTabId = 'mendatang' | 'selesai' | 'undangan';

export type TabCounts = { mendatang: number; selesai: number; undangan: number };

export type TripItem = {
  id: number;
  title: string;
  image: string;
  tags: string[];
  dateRange: string;
  avatars: string[];
};

const TAB_LABELS: { id: HomeTabId; label: string }[] = [
  { id: 'mendatang', label: 'Mendatang' },
  { id: 'selesai', label: 'Selesai' },
  { id: 'undangan', label: 'Undangan' },
];

export function HomePageShell({ children }: { children: ReactNode }) {
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
      <div style={{ height: 60 }} />
      {children}
      <BottomNav active="home" />
    </div>
  );
}

export function NotificationBell({ unreadCount }: { unreadCount: number }) {
  const hasUnread = unreadCount > 0;
  const displayCount = unreadCount > 9 ? '9+' : String(unreadCount);

  return (
    <div
      style={{
        position: 'relative',
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: C.light,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      <Bell size={20} color={C.charcoal} strokeWidth={2} />
      {hasUnread && (
        <div
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            minWidth: 18,
            height: 18,
            padding: '0 5px',
            backgroundColor: C.coral,
            borderRadius: 10,
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 800,
            color: 'white',
            lineHeight: 1,
          }}
        >
          {displayCount}
        </div>
      )}
    </div>
  );
}

/** Ruang aman di bawah konten scroll (nav 88px + FAB elevated + jarak napas) */
const HOME_SCROLL_BOTTOM = 112;

/** Area konten scroll — aman dari BottomNav */
export function HomeScrollBody({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        padding: `20px 22px ${HOME_SCROLL_BOTTOM}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

export function HomeHeader({ unreadCount }: { unreadCount: number }) {
  return (
    <div
      style={{
        padding: '8px 22px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexShrink: 0,
      }}
    >
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.5, flex: 1 }}>
        Perjalananku
      </h2>
      <NotificationBell unreadCount={unreadCount} />
    </div>
  );
}

export function HomeTabs({ activeTab, counts }: { activeTab: HomeTabId; counts: TabCounts }) {
  return (
    <div
      style={{
        display: 'flex',
        margin: '16px 22px 0',
        borderBottom: `1.5px solid ${C.border}`,
        flexShrink: 0,
      }}
    >
      {TAB_LABELS.map((tab) => {
        const active = tab.id === activeTab;
        const count = counts[tab.id];
        return (
          <div
            key={tab.id}
            style={{
              paddingBottom: 12,
              paddingTop: 2,
              marginRight: 18,
              cursor: 'pointer',
              borderBottom: active ? `2.5px solid ${C.coral}` : 'none',
              marginBottom: -1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? C.coral : C.muted }}>
              {tab.label}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: active ? C.coral : C.muted,
                backgroundColor: active ? C.coralLight : C.light,
                padding: '2px 7px',
                borderRadius: 8,
                minWidth: 20,
                textAlign: 'center',
                lineHeight: 1.35,
              }}
            >
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function TripCard({ trip, dimmed = false }: { trip: TripItem; dimmed?: boolean }) {
  return (
    <div
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: C.white,
        boxShadow: `0 4px 24px ${C.shadow}, 0 0 0 1px rgba(0,0,0,0.04)`,
        opacity: dimmed ? 0.92 : 1,
        flexShrink: 0,
      }}
    >
      <div style={{ position: 'relative', height: 150, backgroundColor: '#D8D4CC' }}>
        <img
          src={trip.image}
          alt={trip.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: dimmed ? 'grayscale(20%)' : 'none' }}
        />
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: C.charcoal, margin: '0 0 9px', letterSpacing: -0.3 }}>
          {trip.title}
        </h3>
        <TripTags tags={trip.tags} variant="card" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Calendar size={13} color={C.muted} />
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{trip.dateRange}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {trip.avatars.map((initial, i) => (
              <div
                key={i}
                style={{
                  width: 26,
                  height: 26,
                  backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                  borderRadius: '50%',
                  border: '2px solid white',
                  marginLeft: i > 0 ? -9 : 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  fontWeight: 800,
                  color: 'white',
                  zIndex: trip.avatars.length - i,
                }}
              >
                {initial}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export type InvitationItem = {
  id: number;
  title: string;
  image: string;
  inviter: string;
  inviterInitial: string;
  dateRange: string;
};

export function InvitationCard({ item }: { item: InvitationItem }) {
  return (
    <div
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: C.white,
        boxShadow: `0 4px 24px ${C.shadow}, 0 0 0 1px rgba(0,0,0,0.04)`,
        flexShrink: 0,
      }}
    >
      <div style={{ position: 'relative', height: 120, backgroundColor: '#D8D4CC' }}>
        <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(26,26,46,0.55), transparent 55%)',
          }}
        />
        <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
            Diundang oleh <span style={{ fontWeight: 800 }}>@{item.inviter}</span>
          </p>
        </div>
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.charcoal, margin: '0 0 6px', letterSpacing: -0.3 }}>
          {item.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 14 }}>
          <Calendar size={13} color={C.muted} />
          <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{item.dateRange}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            style={{
              flex: 1,
              height: 40,
              backgroundColor: C.coral,
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: FONT,
            }}
          >
            Terima
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              height: 40,
              backgroundColor: C.light,
              color: C.muted,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: FONT,
            }}
          >
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
}

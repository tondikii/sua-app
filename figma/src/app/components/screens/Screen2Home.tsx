import { Bell, Calendar, MapPin } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

const trips = [
  {
    id: 1,
    title: 'Lombok Weekend Escape',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=280&fit=crop&auto=format',
    tags: ['#Pantai', '#Alam'],
    dateRange: '15–18 Jun 2026',
    avatars: ['R', 'B', 'A', 'D'],
    status: 'Mendatang',
  },
  {
    id: 2,
    title: 'Bali Cultural Retreat',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=280&fit=crop&auto=format',
    tags: ['#Budaya', '#Pantai'],
    dateRange: '3–7 Jul 2026',
    avatars: ['S', 'M', 'R'],
    status: 'Mendatang',
  },
];

export function Screen2Home() {
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
      {/* Dynamic island spacer */}
      <div style={{ height: 60 }} />

      {/* Header — ONLY bell icon */}
      <div style={{ padding: '4px 22px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ position: 'relative', padding: 6, cursor: 'pointer' }}>
          <Bell size={22} color={C.charcoal} strokeWidth={2} />
          <div
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 9,
              height: 9,
              backgroundColor: C.coral,
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
        </div>
      </div>

      {/* Section title */}
      <div style={{ padding: '12px 22px 0' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.5 }}>
          Perjalananku
        </h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', margin: '16px 22px 0', borderBottom: `1.5px solid ${C.border}`, gap: 0 }}>
        {[
          { label: 'Mendatang', active: true, badge: null },
          { label: 'Selesai', active: false, badge: null },
          { label: 'Undangan', active: false, badge: 3 },
        ].map((tab) => (
          <div
            key={tab.label}
            style={{
              paddingBottom: 12,
              paddingTop: 2,
              marginRight: 22,
              cursor: 'pointer',
              borderBottom: tab.active ? `2.5px solid ${C.coral}` : 'none',
              marginBottom: -1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: tab.active ? 700 : 500,
                color: tab.active ? C.coral : C.muted,
              }}
            >
              {tab.label}
            </span>
            {tab.badge && (
              <div
                style={{
                  backgroundColor: C.coral,
                  color: 'white',
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 7px',
                  lineHeight: 1.4,
                }}
              >
                {tab.badge}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feed */}
      <div
        style={{
          flex: 1,
          padding: '20px 22px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflow: 'hidden',
        }}
      >
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>

      <BottomNav active="home" />
    </div>
  );
}

function TripCard({ trip }: { trip: (typeof trips)[0] }) {
  return (
    <div
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: C.white,
        boxShadow: `0 4px 24px ${C.shadow}, 0 0 0 1px rgba(0,0,0,0.04)`,
      }}
    >
      {/* Cover image */}
      <div style={{ position: 'relative', height: 150, backgroundColor: '#D8D4CC' }}>
        <img src={trip.image} alt={trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: C.coral,
            color: 'white',
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 11px',
            borderRadius: 20,
          }}
        >
          {trip.status}
        </div>
      </div>

      {/* Card content */}
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: C.charcoal, margin: '0 0 9px', letterSpacing: -0.3 }}>
          {trip.title}
        </h3>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 13 }}>
          {trip.tags.map((tag) => (
            <span
              key={tag}
              style={{
                backgroundColor: C.tealLight,
                color: C.teal,
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 20,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Calendar size={13} color={C.muted} />
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{trip.dateRange}</span>
          </div>
          {/* Stacked avatars */}
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

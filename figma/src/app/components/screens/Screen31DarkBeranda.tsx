import { Bell, Calendar, Home, Search, Heart, User, Plus } from 'lucide-react';
import { FONT, AVATAR_COLORS } from '../colors';

import { TRIP_DATE_PENDING } from '../trip/CreateTripParts';

const D = {
  bg: '#0F0F13',
  surface: '#1B1B26',
  surfaceUp: '#23232F',
  border: 'rgba(255,255,255,0.07)',
  text: '#F0F0FA',
  muted: '#80809A',
  mutedLight: '#55556A',
  coral: '#FF6B6B',
  teal: '#4ECDC4',
  coralBg: 'rgba(255,107,107,0.16)',
  tealBg: 'rgba(78,205,196,0.16)',
  shadow: 'rgba(0,0,0,0.45)',
};

const trips = [
  {
    id: 1,
    title: 'Lombok Weekend Escape',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=280&fit=crop&auto=format',
    tags: ['#Pantai', '#Alam'],
    dateRange: TRIP_DATE_PENDING,
    avatars: ['R', 'B', 'A', 'D'],
  },
  {
    id: 2,
    title: 'Bali Cultural Retreat',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=280&fit=crop&auto=format',
    tags: ['#Budaya', '#Pantai'],
    dateRange: '3–7 Jul 2026 · Sepanjang hari',
    avatars: ['S', 'M', 'R'],
  },
];

function DarkBottomNav() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 88,
        backgroundColor: D.surface,
        borderTop: `1px solid ${D.border}`,
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 20,
        boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
        zIndex: 100,
        fontFamily: FONT,
      }}
    >
      {[
        { icon: Home, label: 'Beranda', active: true },
        { icon: Search, label: 'Cari', active: false },
      ].map(({ icon: Icon, label, active }) => (
        <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <Icon size={22} color={active ? D.coral : D.muted} strokeWidth={active ? 2.5 : 2} />
          <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? D.coral : D.muted }}>{label}</span>
        </div>
      ))}

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button style={{
          width: 54, height: 54,
          backgroundColor: D.coral, borderRadius: 18, border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', marginTop: -28,
          boxShadow: `0 8px 24px ${D.coral}55`,
        }}>
          <Plus size={24} color="white" strokeWidth={2.5} />
        </button>
      </div>

      {[
        { icon: Heart, label: 'Wishlist', active: false },
        { icon: User, label: 'Profil', active: false },
      ].map(({ icon: Icon, label, active }) => (
        <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <Icon size={22} color={D.muted} strokeWidth={2} />
          <span style={{ fontSize: 10, fontWeight: 500, color: D.muted }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

export function Screen31DarkBeranda() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: D.bg, display: 'flex', flexDirection: 'column', fontFamily: FONT, overflow: 'hidden', position: 'relative' }}>
      <div style={{ height: 60 }} />

      {/* Header — only bell */}
      <div style={{ padding: '4px 22px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ position: 'relative', padding: 6, cursor: 'pointer' }}>
          <Bell size={22} color={D.text} strokeWidth={2} />
          <div style={{ position: 'absolute', top: 4, right: 4, width: 9, height: 9, backgroundColor: D.coral, borderRadius: '50%', border: `2px solid ${D.bg}` }} />
        </div>
      </div>

      {/* Title */}
      <div style={{ padding: '12px 22px 0' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: D.text, margin: 0, letterSpacing: -0.5 }}>Perjalananku</h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', margin: '16px 22px 0', borderBottom: `1.5px solid ${D.border}` }}>
        {[
          { label: 'Mendatang', active: true, badge: null },
          { label: 'Selesai', active: false, badge: null },
          { label: 'Undangan', active: false, badge: 3 },
        ].map((tab) => (
          <div
            key={tab.label}
            style={{
              paddingBottom: 12, paddingTop: 2, marginRight: 22, cursor: 'pointer',
              borderBottom: tab.active ? `2.5px solid ${D.coral}` : 'none',
              marginBottom: -1.5, display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: tab.active ? 700 : 500, color: tab.active ? D.coral : D.muted }}>
              {tab.label}
            </span>
            {tab.badge && (
              <div style={{ backgroundColor: D.coral, color: 'white', borderRadius: 10, fontSize: 10, fontWeight: 700, padding: '2px 7px' }}>
                {tab.badge}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trip cards */}
      <div style={{ flex: 1, padding: '20px 22px 0', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
        {trips.map((trip) => (
          <div
            key={trip.id}
            style={{
              borderRadius: 20, overflow: 'hidden',
              backgroundColor: D.surface,
              boxShadow: `0 4px 28px ${D.shadow}`,
              border: `1px solid ${D.border}`,
            }}
          >
            <div style={{ position: 'relative', height: 148, backgroundColor: '#1A1A23' }}>
              <img src={trip.image} alt={trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%)' }} />
              <div style={{ position: 'absolute', top: 12, left: 12, backgroundColor: D.coral, color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 11px', borderRadius: 20 }}>
                Mendatang
              </div>
            </div>

            <div style={{ padding: '14px 16px 16px' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: D.text, margin: '0 0 9px', letterSpacing: -0.3 }}>{trip.title}</h3>

              <div style={{ display: 'flex', gap: 6, marginBottom: 13 }}>
                {trip.tags.map((tag) => (
                  <span key={tag} style={{ backgroundColor: D.tealBg, color: D.teal, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Calendar size={13} color={D.muted} />
                  <span style={{ fontSize: 12, color: D.muted, fontWeight: 500 }}>{trip.dateRange}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {trip.avatars.map((init, i) => (
                    <div
                      key={i}
                      style={{
                        width: 26, height: 26,
                        backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                        borderRadius: '50%',
                        border: `2px solid ${D.surface}`,
                        marginLeft: i > 0 ? -9 : 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 800, color: 'white',
                        zIndex: trip.avatars.length - i,
                      }}
                    >
                      {init}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DarkBottomNav />
    </div>
  );
}

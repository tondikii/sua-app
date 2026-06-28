import { Search, MapPin, Users, UserCheck } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

const trips = [
  { id: 1, title: 'Raja Ampat', image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=200&h=200&fit=crop&auto=format', tag: '#Pantai' },
  { id: 2, title: 'Bromo Tengger', image: 'https://images.unsplash.com/photo-1589553816702-7ee0af38cbb8?w=200&h=200&fit=crop&auto=format', tag: '#Alam' },
  { id: 3, title: 'Gili Trawangan', image: 'https://images.unsplash.com/photo-1527153818091-1a9638521e2a?w=200&h=200&fit=crop&auto=format', tag: '#Pantai' },
  { id: 4, title: 'Borobudur', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=200&h=200&fit=crop&auto=format', tag: '#Budaya' },
];

export function Screen3Profile() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: C.light,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Dynamic island spacer */}
      <div style={{ height: 60 }} />

      {/* Search bar */}
      <div style={{ padding: '8px 20px 0', backgroundColor: C.light }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: C.white,
            borderRadius: 14,
            padding: '12px 16px',
            boxShadow: `0 2px 12px ${C.shadow}`,
          }}
        >
          <Search size={16} color={C.muted} />
          <span style={{ fontSize: 14, color: C.mutedLight }}>Cari pengguna...</span>
        </div>
      </div>

      {/* Profile card */}
      <div
        style={{
          margin: '16px 20px 0',
          backgroundColor: C.white,
          borderRadius: 22,
          padding: '22px 20px',
          boxShadow: `0 4px 20px ${C.shadow}`,
        }}
      >
        {/* Avatar + info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 24,
              background: `linear-gradient(135deg, ${C.coral} 0%, #FF8E8E 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 800,
              color: 'white',
              flexShrink: 0,
              boxShadow: `0 8px 20px ${C.coral}40`,
            }}
          >
            B
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.3 }}>
              Budi Santoso
            </h2>
            <p style={{ fontSize: 12, color: C.muted, margin: '4px 0 8px', lineHeight: 1.5 }}>
              Travel enthusiast 🌏 | Jakarta
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={11} color={C.teal} />
              <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>Jakarta, Indonesia</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            backgroundColor: C.light,
            borderRadius: 14,
            padding: '14px 0',
          }}
        >
          {[
            { value: '234', label: 'Mengikuti' },
            { value: '89', label: 'Pengikut' },
            { value: '12', label: 'Perjalanan' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                textAlign: 'center',
                borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800, color: C.charcoal, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trip grid header */}
      <div style={{ padding: '20px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.charcoal }}>Perjalanan Publik</span>
        <span style={{ fontSize: 13, color: C.coral, fontWeight: 600 }}>Lihat Semua</span>
      </div>

      {/* Trip grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          padding: '0 20px',
          overflow: 'hidden',
        }}
      >
        {trips.map((trip) => (
          <div
            key={trip.id}
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: C.white,
              boxShadow: `0 3px 14px ${C.shadow}`,
            }}
          >
            <div style={{ height: 100, backgroundColor: '#D8D4CC', position: 'relative' }}>
              <img src={trip.image} alt={trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  backgroundColor: C.tealLight,
                  color: C.teal,
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 20,
                }}
              >
                {trip.tag}
              </div>
            </div>
            <div style={{ padding: '9px 10px 10px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.charcoal, margin: 0 }}>{trip.title}</p>
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="profile" />
    </div>
  );
}

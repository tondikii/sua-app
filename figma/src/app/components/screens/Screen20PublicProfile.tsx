import { ArrowLeft, UserPlus, MapPin } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

const trips = [
  { id: 1, image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=200&h=200&fit=crop&auto=format', title: 'Borobudur', tag: '#Budaya' },
  { id: 2, image: 'https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=200&h=200&fit=crop&auto=format', title: 'Gunung Merapi', tag: '#Alam' },
  { id: 3, image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=200&h=200&fit=crop&auto=format', title: 'Air Terjun Tumpak Sewu', tag: '#Alam' },
  { id: 4, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&h=200&fit=crop&auto=format', title: 'Bali Rice Terraces', tag: '#Alam' },
];

export function Screen20PublicProfile() {
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
      <div style={{ height: 60 }} />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 20px 14px',
          backgroundColor: C.light,
        }}
      >
        <div style={{ width: 36, height: 36, backgroundColor: C.white, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 2px 10px ${C.shadow}` }}>
          <ArrowLeft size={18} color={C.charcoal} strokeWidth={2.5} />
        </div>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: C.charcoal, margin: 0 }}>Profil</h2>
        <div style={{ width: 36 }} />
      </div>

      {/* Profile card */}
      <div
        style={{
          margin: '0 20px',
          backgroundColor: C.white,
          borderRadius: 22,
          padding: '22px 20px',
          boxShadow: `0 4px 20px ${C.shadow}`,
        }}
      >
        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <div
            style={{
              width: 78,
              height: 78,
              background: `linear-gradient(135deg, ${C.teal} 0%, #7FE3DE 100%)`,
              borderRadius: 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 800,
              color: 'white',
              marginBottom: 12,
              boxShadow: `0 10px 26px ${C.teal}40`,
            }}
          >
            R
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.charcoal, margin: '0 0 4px', letterSpacing: -0.3 }}>
            Rina Dwi Lestari
          </h2>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 6px', fontWeight: 600 }}>@rinadwi_travel</p>
          <p style={{ fontSize: 13, color: C.charcoal, margin: '0 0 8px', textAlign: 'center', lineHeight: 1.5, fontWeight: 400 }}>
            Pecinta alam & kuliner 🌿 | Yogyakarta
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={11} color={C.coral} />
            <span style={{ fontSize: 11, color: C.coral, fontWeight: 600 }}>Yogyakarta, Indonesia</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', backgroundColor: C.light, borderRadius: 14, padding: '12px 0', marginBottom: 16 }}>
          {[
            { value: '1.2K', label: 'Pengikut' },
            { value: '234', label: 'Mengikuti' },
            { value: '28', label: 'Perjalanan' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}
            >
              <div style={{ fontSize: 17, fontWeight: 800, color: C.charcoal, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Follow button — NOT Edit Profil */}
        <button
          style={{
            width: '100%',
            height: 48,
            backgroundColor: C.coral,
            color: 'white',
            border: 'none',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: `0 8px 22px ${C.coral}45`,
            fontFamily: FONT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <UserPlus size={16} strokeWidth={2.5} />
          Ikuti
        </button>
      </div>

      {/* Trip grid */}
      <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.charcoal }}>Perjalanan Publik</span>
        <span style={{ fontSize: 13, color: C.coral, fontWeight: 600 }}>Lihat Semua</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '12px 20px 0', overflow: 'hidden' }}>
        {trips.map((trip) => (
          <div
            key={trip.id}
            style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: C.white, boxShadow: `0 3px 14px ${C.shadow}` }}
          >
            <div style={{ height: 88, backgroundColor: '#D8D4CC', position: 'relative' }}>
              <img src={trip.image} alt={trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 7, left: 7, backgroundColor: C.tealLight, color: C.teal, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                {trip.tag}
              </div>
            </div>
            <div style={{ padding: '8px 10px 10px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.charcoal, margin: 0, lineHeight: 1.3 }}>{trip.title}</p>
            </div>
          </div>
        ))}
      </div>

      <BottomNav active="search" />
    </div>
  );
}

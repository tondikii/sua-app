import { Search, Plus, Navigation, Heart } from 'lucide-react';
import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

const wishlistItems = [
  {
    id: 1,
    name: 'Pantai Kelingking',
    location: 'Nusa Penida, Bali',
    image: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=200&h=200&fit=crop&auto=format',
    priority: 'Tinggi',
    tag: '#Pantai',
  },
  {
    id: 2,
    name: 'Bukit Teletubbies',
    location: 'Bromo, Jawa Timur',
    image: 'https://images.unsplash.com/photo-1589553816702-7ee0af38cbb8?w=200&h=200&fit=crop&auto=format',
    priority: 'Sedang',
    tag: '#Alam',
  },
  {
    id: 3,
    name: 'Warung Bu Oka',
    location: 'Ubud, Bali',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop&auto=format',
    priority: 'Rendah',
    tag: '#Kuliner',
  },
  {
    id: 4,
    name: 'Pantai Merah',
    location: 'Komodo, NTT',
    image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=200&h=200&fit=crop&auto=format',
    priority: 'Tinggi',
    tag: '#Pantai',
  },
];

const priorityStyle = (p: string) => {
  if (p === 'Tinggi') return { bg: '#FFF0F0', color: C.coral };
  if (p === 'Sedang') return { bg: '#FFF8ED', color: '#F59E0B' };
  return { bg: C.tealLight, color: C.teal };
};

export function Screen8Wishlist() {
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

      {/* Header */}
      <div style={{ padding: '4px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.5 }}>
            Wishlist Saya
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Heart size={16} color={C.coral} fill={C.coral} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.coral }}>{wishlistItems.length}</span>
          </div>
        </div>

        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: C.light,
            borderRadius: 14,
            padding: '12px 16px',
            border: `1px solid ${C.border}`,
            marginBottom: 14,
          }}
        >
          <Search size={16} color={C.muted} />
          <span style={{ fontSize: 14, color: C.mutedLight }}>Cari destinasi wishlist...</span>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { label: '#Alam', active: true },
            { label: '#Kuliner', active: false },
            { label: '#Budaya', active: false },
          ].map((chip) => (
            <div
              key={chip.label}
              style={{
                padding: '7px 14px',
                borderRadius: 20,
                backgroundColor: chip.active ? C.teal : C.light,
                color: chip.active ? 'white' : C.muted,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {chip.label}
            </div>
          ))}
        </div>
      </div>

      {/* 2-column grid */}
      <div
        style={{
          flex: 1,
          padding: '0 20px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          alignContent: 'start',
          overflow: 'hidden',
        }}
      >
        {wishlistItems.map((item) => {
          const ps = priorityStyle(item.priority);
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: C.white,
                borderRadius: 18,
                overflow: 'hidden',
                boxShadow: `0 4px 20px ${C.shadow}`,
                border: `1px solid ${C.border}`,
              }}
            >
              {/* Card image */}
              <div style={{ position: 'relative', height: 110, backgroundColor: '#D8D4CC' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {/* Map icon top-right */}
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    borderRadius: 9,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <Navigation size={13} color={C.teal} strokeWidth={2.5} />
                </div>
                {/* Tag bottom-left */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    color: 'white',
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 20,
                  }}
                >
                  {item.tag}
                </div>
              </div>

              {/* Card content */}
              <div style={{ padding: '10px 11px 12px' }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: C.charcoal, margin: '0 0 3px', letterSpacing: -0.2, lineHeight: 1.3 }}>
                  {item.name}
                </p>
                <p style={{ fontSize: 10, color: C.muted, margin: '0 0 9px', fontWeight: 500, lineHeight: 1.4 }}>
                  📍 {item.location}
                </p>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: ps.bg,
                    color: ps.color,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: 20,
                  }}
                >
                  Prioritas: {item.priority}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating "+" button */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          width: 52,
          height: 52,
          backgroundColor: C.coral,
          borderRadius: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: `0 8px 24px ${C.coral}55`,
          zIndex: 50,
        }}
      >
        <Plus size={24} color="white" strokeWidth={2.5} />
      </div>

      <BottomNav active="wishlist" />
    </div>
  );
}

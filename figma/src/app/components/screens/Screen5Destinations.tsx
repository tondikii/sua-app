import { ArrowLeft, Map, MoreHorizontal, UserPlus, Plus, Navigation } from 'lucide-react';
import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

const destinations = [
  { id: 1, name: 'Pantai Tiga Warna', location: 'Malang, Jawa Timur', emoji: '🏖️' },
  { id: 2, name: 'Bukit Merese', location: 'Lombok, NTB', emoji: '🌄' },
  { id: 3, name: 'Air Terjun Benang Stokel', location: 'Lombok, NTB', emoji: '💧' },
];

export function Screen5Destinations() {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 0' }}>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={18} color={C.charcoal} strokeWidth={2.5} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: C.charcoal, margin: 0 }}>Lombok Weekend Escape</h2>
          <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>15–18 Jun 2026</p>
        </div>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <MoreHorizontal size={18} color={C.charcoal} />
        </div>
      </div>

      {/* Content tabs */}
      <div style={{ display: 'flex', margin: '16px 20px 0', borderBottom: `1.5px solid ${C.border}` }}>
        {[
          { label: 'Destinasi', active: true },
          { label: 'Voting', active: false },
          { label: 'Chat', active: false },
        ].map((tab) => (
          <div
            key={tab.label}
            style={{
              paddingBottom: 12,
              paddingTop: 2,
              marginRight: 24,
              cursor: 'pointer',
              borderBottom: tab.active ? `2.5px solid ${C.coral}` : 'none',
              marginBottom: -1.5,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: tab.active ? 700 : 500, color: tab.active ? C.coral : C.muted }}>
              {tab.label}
            </span>
          </div>
        ))}
      </div>

      {/* Destination list */}
      <div style={{ flex: 1, padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
        <p style={{ fontSize: 12, color: C.muted, margin: '0 0 4px', fontWeight: 600 }}>
          {destinations.length} Destinasi Dipilih
        </p>

        {destinations.map((dest, i) => (
          <div
            key={dest.id}
            style={{
              backgroundColor: C.white,
              borderRadius: 18,
              padding: '16px',
              boxShadow: `0 4px 20px ${C.shadow}`,
              border: `1px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            {/* Emoji / illustration */}
            <div
              style={{
                width: 48,
                height: 48,
                backgroundColor: C.light,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {dest.emoji}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.2 }}>
                {dest.name}
              </p>
              <p style={{ fontSize: 12, color: C.muted, margin: '3px 0 0', fontWeight: 500 }}>📍 {dest.location}</p>
            </div>

            {/* Map icon */}
            <div
              style={{
                width: 34,
                height: 34,
                backgroundColor: C.tealLight,
                borderRadius: 11,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Navigation size={15} color={C.teal} strokeWidth={2.5} />
            </div>

            <div style={{ width: 34, height: 34, backgroundColor: C.light, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <MoreHorizontal size={15} color={C.muted} />
            </div>
          </div>
        ))}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <button
            style={{
              width: '100%',
              height: 50,
              backgroundColor: C.coral,
              color: 'white',
              border: 'none',
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: `0 8px 22px ${C.coral}45`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              fontFamily: FONT,
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Tambah Destinasi
          </button>

          <button
            style={{
              width: '100%',
              height: 50,
              backgroundColor: C.white,
              color: C.charcoal,
              border: `1.5px solid ${C.border}`,
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              fontFamily: FONT,
            }}
          >
            <UserPlus size={16} color={C.teal} strokeWidth={2.5} />
            <span style={{ color: C.teal }}>Undang Teman</span>
          </button>
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}

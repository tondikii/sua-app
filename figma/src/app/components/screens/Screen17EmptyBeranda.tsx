import { Bell, Plus } from 'lucide-react';
import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

function EmptyTripsIllustration() {
  return (
    <svg width="190" height="168" viewBox="0 0 190 168" fill="none">
      {/* Soft glow background */}
      <circle cx="95" cy="84" r="72" fill="#EDF9F8" />
      {/* Globe circle */}
      <circle cx="95" cy="84" r="52" fill="white" stroke="#E0F5F4" strokeWidth="2" />
      {/* Latitude lines */}
      <ellipse cx="95" cy="84" rx="52" ry="22" fill="none" stroke="#4ECDC4" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.5" />
      {/* Longitude line */}
      <line x1="95" y1="32" x2="95" y2="136" stroke="#4ECDC4" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.5" />
      {/* Equator */}
      <line x1="43" y1="84" x2="147" y2="84" stroke="#4ECDC4" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.5" />
      {/* Dotted travel arc */}
      <path d="M60 95 Q95 55 130 78" stroke="#FF6B6B" strokeWidth="2" strokeDasharray="4 3" fill="none" opacity="0.8" />
      {/* Origin dot */}
      <circle cx="60" cy="95" r="5" fill="#FF6B6B" opacity="0.5" />
      {/* Destination pin */}
      <path d="M130 78 C130 70, 138 62, 138 62 C138 62, 146 70, 146 78 C146 86, 138 92, 138 92 C138 92, 130 86, 130 78Z" fill="#FF6B6B" />
      <circle cx="138" cy="78" r="4" fill="white" />
      {/* Airplane */}
      <g transform="translate(90, 65) rotate(-30)">
        <path d="M0 0 L14 -5 L14 0 L8 3Z" fill="#FF6B6B" />
        <path d="M0 0 L5 7 L3 10" fill="#FF6B6B" opacity="0.6" />
      </g>
      {/* Sparkles */}
      <circle cx="42" cy="56" r="3.5" fill="#FFB347" />
      <circle cx="156" cy="52" r="3" fill="#4ECDC4" />
      <circle cx="162" cy="106" r="2.5" fill="#FF6B6B" opacity="0.6" />
      <circle cx="35" cy="112" r="2.5" fill="#4ECDC4" opacity="0.7" />
      {/* Small star shapes */}
      <path d="M162 56 L163.5 59 L167 59 L164 61 L165 65 L162 63 L159 65 L160 61 L157 59 L160.5 59Z" fill="#FFB347" opacity="0.6" />
    </svg>
  );
}

export function Screen17EmptyBeranda() {
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

      {/* Header — ONLY bell */}
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
      <div style={{ display: 'flex', margin: '16px 22px 0', borderBottom: `1.5px solid ${C.border}` }}>
        {[
          { label: 'Mendatang', active: true, badge: null },
          { label: 'Selesai', active: false, badge: null },
          { label: 'Undangan', active: false, badge: null },
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
            }}
          >
            <span style={{ fontSize: 14, fontWeight: tab.active ? 700 : 500, color: tab.active ? C.coral : C.muted }}>
              {tab.label}
            </span>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 36px 80px',
          textAlign: 'center',
        }}
      >
        <EmptyTripsIllustration />
        <h3
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: C.charcoal,
            margin: '20px 0 10px',
            letterSpacing: -0.4,
          }}
        >
          Belum ada perjalanan
        </h3>
        <p style={{ fontSize: 14, color: C.muted, margin: '0 0 28px', lineHeight: 1.65, fontWeight: 500 }}>
          Mulai rencanakan liburan pertamamu bersama teman-teman.
        </p>
        <button
          style={{
            height: 52,
            padding: '0 28px',
            backgroundColor: C.coral,
            color: 'white',
            border: 'none',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: `0 10px 26px ${C.coral}45`,
            fontFamily: FONT,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          Buat Perjalanan Baru
        </button>
      </div>

      <BottomNav active="home" />
    </div>
  );
}

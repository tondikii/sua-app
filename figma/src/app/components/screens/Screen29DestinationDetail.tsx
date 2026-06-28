import { MapPin, Navigation, ExternalLink, Play } from 'lucide-react';
import { C, FONT } from '../colors';

function AppBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: C.white, fontFamily: FONT }}>
      <div style={{ height: 60 }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 10px' }}>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12 }} />
        <div style={{ width: 130, height: 14, backgroundColor: C.border, borderRadius: 6 }} />
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12 }} />
      </div>
      <div style={{ display: 'flex', gap: 20, margin: '0 20px 14px', paddingBottom: 10, borderBottom: `1.5px solid ${C.border}` }}>
        {[80, 55, 40].map((w, i) => (
          <div key={i} style={{ width: w, height: 10, backgroundColor: i === 0 ? `${C.coral}50` : C.border, borderRadius: 5 }} />
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 12, margin: '8px 20px', padding: '13px', backgroundColor: C.light, borderRadius: 16, border: `1px solid ${C.border}` }}>
          <div style={{ width: 44, height: 44, backgroundColor: C.border, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: '58%', height: 11, backgroundColor: C.border, borderRadius: 5, marginBottom: 6 }} />
            <div style={{ width: '38%', height: 9, backgroundColor: C.border, borderRadius: 5 }} />
          </div>
          <div style={{ width: 32, height: 32, backgroundColor: C.tealLight, borderRadius: 10 }} />
        </div>
      ))}
    </div>
  );
}

function MapSnippet() {
  return (
    <svg width="100%" height="130" viewBox="0 0 320 130" fill="none">
      <rect width="320" height="130" fill="#E8F0E5" rx="0" />
      {/* Grid of roads */}
      <rect width="320" height="130" fill="#EAF0E8" />
      {/* Horizontal roads */}
      <rect x="0" y="42" width="320" height="6" fill="#DAEADA" rx="1" />
      <rect x="0" y="80" width="320" height="5" fill="#DAEADA" rx="1" />
      {/* Vertical roads */}
      <rect x="72" y="0" width="5" height="130" fill="#DAEADA" rx="1" />
      <rect x="188" y="0" width="5" height="130" fill="#DAEADA" rx="1" />
      <rect x="262" y="0" width="4" height="130" fill="#DAEADA" rx="1" />
      {/* Water body */}
      <ellipse cx="240" cy="108" rx="88" ry="32" fill="#C8E0EC" opacity="0.8" />
      {/* Buildings */}
      <rect x="82" y="50" width="28" height="24" rx="3" fill="#D5DDD2" />
      <rect x="116" y="52" width="22" height="20" rx="3" fill="#D5DDD2" />
      <rect x="198" y="48" width="32" height="26" rx="3" fill="#D5DDD2" />
      <rect x="82" y="10" width="20" height="26" rx="3" fill="#D5DDD2" />
      {/* Location pin */}
      <circle cx="160" cy="52" r="20" fill="#FF6B6B" opacity="0.15" />
      <circle cx="160" cy="52" r="12" fill="#FF6B6B" opacity="0.3" />
      <path d="M160 30 C152 30 144 37 144 46 C144 58 160 72 160 72 C160 72 176 58 176 46 C176 37 168 30 160 30Z" fill="#FF6B6B" />
      <circle cx="160" cy="46" r="6" fill="white" />
      {/* Pin shadow */}
      <ellipse cx="160" cy="74" rx="6" ry="3" fill="#FF6B6B" opacity="0.25" />
      {/* Compass rose mini */}
      <circle cx="295" cy="22" r="14" fill="white" opacity="0.85" />
      <text x="295" y="13" textAnchor="middle" fill="#9091A0" fontSize="7" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">U</text>
      <text x="295" y="34" textAnchor="middle" fill="#9091A0" fontSize="6" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">S</text>
      <text x="305" y="26" textAnchor="middle" fill="#9091A0" fontSize="6" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">T</text>
      <text x="285" y="26" textAnchor="middle" fill="#9091A0" fontSize="6" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">B</text>
    </svg>
  );
}

export function Screen29DestinationDetail() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <AppBg />
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,15,20,0.42)', zIndex: 10 }} />

      {/* Bottom sheet */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '75%',
          backgroundColor: C.white,
          borderRadius: '26px 26px 0 0',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 14, paddingBottom: 0, flexShrink: 0 }}>
          <div style={{ width: 40, height: 5, backgroundColor: C.border, borderRadius: 20 }} />
        </div>

        {/* Cover image */}
        <div style={{ height: 180, backgroundColor: '#C8D4C4', flexShrink: 0, position: 'relative', margin: '12px 0 0' }}>
          <img
            src="https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=400&h=220&fit=crop&auto=format"
            alt="Pantai Pink, Lombok"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* TikTok/IG overlay badge */}
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 10, padding: '5px 10px',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <Play size={11} color="white" fill="white" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>Lihat di TikTok</span>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.25) 100%)' }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: C.charcoal, margin: '0 0 5px', letterSpacing: -0.4 }}>
                  Pantai Pink, Lombok
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={13} color={C.coral} strokeWidth={2.5} />
                  <span style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>Lombok Timur, NTB</span>
                </div>
              </div>
              <div style={{ backgroundColor: C.tealLight, color: C.teal, fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 20 }}>
                #Pantai
              </div>
            </div>
          </div>

          {/* Map snippet */}
          <div style={{ borderRadius: 16, overflow: 'hidden', border: `1.5px solid ${C.border}` }}>
            <MapSnippet />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              style={{
                width: '100%', height: 50,
                backgroundColor: C.coral, color: 'white',
                border: 'none', borderRadius: 14,
                fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
                boxShadow: `0 8px 22px ${C.coral}45`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: FONT,
              }}
            >
              <Navigation size={16} strokeWidth={2.5} />
              Buka di Google Maps
            </button>
            <button
              style={{
                width: '100%', height: 50,
                backgroundColor: C.white, color: C.charcoal,
                border: `1.5px solid ${C.border}`, borderRadius: 14,
                fontSize: 14, fontWeight: 700,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: FONT,
              }}
            >
              <ExternalLink size={16} color={C.teal} strokeWidth={2.5} />
              <span style={{ color: C.teal }}>Lihat Referensi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

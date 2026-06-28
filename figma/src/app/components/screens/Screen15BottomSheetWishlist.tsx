import { MapPin, Link2, X } from 'lucide-react';
import { C, FONT } from '../colors';

function AppBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: C.light, fontFamily: FONT }}>
      <div style={{ height: 60 }} />
      <div style={{ padding: '4px 20px 16px' }}>
        <div style={{ width: 160, height: 22, backgroundColor: C.border, borderRadius: 8, marginBottom: 14 }} />
        <div style={{ width: '100%', height: 42, backgroundColor: C.white, borderRadius: 14, border: `1px solid ${C.border}`, marginBottom: 14 }} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[70, 60, 70].map((w, i) => (
            <div key={i} style={{ width: w, height: 32, backgroundColor: i === 0 ? `${C.teal}30` : C.white, borderRadius: 20, border: `1px solid ${C.border}` }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ backgroundColor: C.white, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}` }}>
              <div style={{ height: 90, backgroundColor: C.border }} />
              <div style={{ padding: 10 }}>
                <div style={{ width: '80%', height: 10, backgroundColor: C.border, borderRadius: 5, marginBottom: 5 }} />
                <div style={{ width: '55%', height: 8, backgroundColor: C.border, borderRadius: 5 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const tags = ['#Pantai', '#Indonesia'];
const priorities = [
  { label: 'Tinggi', value: 'high', bg: C.coralLight, color: C.coral, selected: true },
  { label: 'Menengah', value: 'mid', bg: C.tealLight, color: C.teal, selected: false },
  { label: 'Rendah', value: 'low', bg: C.light, color: C.muted, selected: false },
];

export function Screen15BottomSheetWishlist() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <AppBg />

      {/* Scrim */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26,26,46,0.45)', zIndex: 10 }} />

      {/* Bottom sheet */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '78%',
          backgroundColor: C.white,
          borderRadius: '26px 26px 0 0',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 14, paddingBottom: 6, flexShrink: 0 }}>
          <div style={{ width: 40, height: 5, backgroundColor: C.border, borderRadius: 20 }} />
        </div>

        {/* Title */}
        <div style={{ padding: '8px 22px 16px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.3 }}>
            Tambah ke Wishlist
          </h2>
          <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0', fontWeight: 500 }}>
            Simpan tempat impianmu
          </p>
        </div>

        {/* Form */}
        <div style={{ flex: 1, padding: '20px 22px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Nama Tempat */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
              Nama Tempat
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: C.light,
                borderRadius: 14,
                padding: '13px 16px',
                border: `1.5px solid ${C.coral}`,
                boxShadow: `0 0 0 3px ${C.coralLight}`,
              }}
            >
              <MapPin size={16} color={C.coral} strokeWidth={2.5} />
              <span style={{ fontSize: 15, color: C.charcoal, fontWeight: 500 }}>Pantai Pink, Lombok</span>
            </div>
          </div>

          {/* Link Referensi */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
              Link Referensi
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: C.light,
                borderRadius: 14,
                padding: '13px 16px',
                border: `1.5px solid ${C.border}`,
              }}
            >
              <Link2 size={15} color={C.muted} strokeWidth={2} />
              <span style={{ fontSize: 14, color: C.mutedLight }}>Tempel link artikel / video...</span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
              Tags
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                backgroundColor: C.light,
                borderRadius: 14,
                padding: '12px 14px',
                border: `1.5px solid ${C.border}`,
                alignItems: 'center',
              }}
            >
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    backgroundColor: C.tealLight,
                    color: C.teal,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '5px 10px',
                    borderRadius: 20,
                  }}
                >
                  {tag}
                  <X size={10} strokeWidth={2.5} />
                </div>
              ))}
              <span style={{ fontSize: 13, color: C.mutedLight }}>+ Tambah...</span>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 10 }}>
              Prioritas
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              {priorities.map((p) => (
                <button
                  key={p.value}
                  style={{
                    flex: 1,
                    height: 40,
                    backgroundColor: p.bg,
                    color: p.color,
                    border: p.selected ? `2px solid ${p.color}` : `1.5px solid transparent`,
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: FONT,
                    boxShadow: p.selected ? `0 4px 14px ${p.color}30` : 'none',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '20px 22px 28px', flexShrink: 0 }}>
          <button
            style={{
              width: '100%',
              height: 54,
              backgroundColor: C.coral,
              color: 'white',
              border: 'none',
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: `0 10px 26px ${C.coral}45`,
              fontFamily: FONT,
            }}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

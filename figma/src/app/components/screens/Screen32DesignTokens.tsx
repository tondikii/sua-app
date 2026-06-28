import { C, FONT } from '../colors';

const swatches = [
  { name: 'Warm Coral', hex: '#FF6B6B', color: '#FF6B6B', textColor: 'white', role: 'Primary / CTA' },
  { name: 'Soft Teal', hex: '#4ECDC4', color: '#4ECDC4', textColor: 'white', role: 'Secondary / Tag' },
  { name: 'Charcoal', hex: '#1A1A2E', color: '#1A1A2E', textColor: 'white', role: 'Text / Dark UI' },
  { name: 'Canvas', hex: '#F7F7FB', color: '#F7F7FB', textColor: '#1A1A2E', role: 'Background', border: true },
  { name: 'Border', hex: '#EBEBF2', color: '#EBEBF2', textColor: '#9091A0', role: 'Divider / Stroke', border: true },
  { name: 'Muted', hex: '#9091A0', color: '#9091A0', textColor: 'white', role: 'Placeholder / Label' },
];

const typeScale = [
  { label: 'H1', weight: 'Bold · 800', size: 24, sample: 'Judul Halaman', muted: '24pt / 30px' },
  { label: 'H2', weight: 'SemiBold · 700', size: 18, sample: 'Judul Seksi', muted: '18pt / 22px' },
  { label: 'H3', weight: 'Medium · 600', size: 15, sample: 'Sub-Judul & Label', muted: '15pt / 19px' },
  { label: 'Body', weight: 'Regular · 400', size: 14, sample: 'Teks konten dan deskripsi utama.', muted: '14pt / 18px' },
  { label: 'Caption', weight: 'Medium · 500', size: 12, sample: 'Keterangan · Timestamp', muted: '12pt / 16px' },
];

const radii = [
  { label: 'sm', value: '8px', preview: 8 },
  { label: 'md', value: '12px', preview: 12 },
  { label: 'lg', value: '16px', preview: 16 },
  { label: 'xl', value: '20px', preview: 20 },
  { label: '2xl', value: '28px', preview: 28 },
];

export function Screen32DesignTokens() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F4F0',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ height: 60 }} />

      {/* Header */}
      <div style={{ padding: '4px 20px 14px', borderBottom: `1px solid #E0DDD8` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <div style={{ backgroundColor: C.coral, color: 'white', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
            Referensi Dev
          </div>
          <div style={{ backgroundColor: C.tealLight, color: C.teal, fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
            v2.4.1
          </div>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: C.charcoal, margin: '6px 0 2px', letterSpacing: -0.5 }}>
          Design Tokens
        </h1>
        <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>
          Plus Jakarta Sans · Tailwind v4 · Atur Perjalanan
        </p>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* ── WARNA ── */}
        <div style={{ padding: '12px 20px 0' }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: C.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1.6 }}>
            Warna
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {swatches.map((s) => (
              <div
                key={s.hex}
                style={{
                  backgroundColor: C.white,
                  borderRadius: 14,
                  overflow: 'hidden',
                  boxShadow: `0 2px 10px ${C.shadow}`,
                  border: `1px solid ${C.border}`,
                }}
              >
                {/* Swatch block */}
                <div
                  style={{
                    height: 44,
                    backgroundColor: s.color,
                    border: s.border ? `1px solid ${C.border}` : 'none',
                  }}
                />
                {/* Label */}
                <div style={{ padding: '7px 8px' }}>
                  <p style={{ fontSize: 10, fontWeight: 800, color: C.charcoal, margin: '0 0 1px', lineHeight: 1.2 }}>{s.name}</p>
                  <p style={{ fontSize: 9, fontWeight: 700, color: C.muted, margin: '0 0 1px', fontFamily: 'monospace' }}>{s.hex}</p>
                  <p style={{ fontSize: 8, color: C.mutedLight, margin: 0, fontWeight: 500, lineHeight: 1.3 }}>{s.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TIPOGRAFI ── */}
        <div style={{ padding: '14px 20px 0' }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: C.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1.6 }}>
            Tipografi
          </p>
          <div style={{ backgroundColor: C.white, borderRadius: 16, overflow: 'hidden', boxShadow: `0 2px 10px ${C.shadow}`, border: `1px solid ${C.border}` }}>
            {typeScale.map((t, idx) => (
              <div
                key={t.label}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: idx < typeScale.length - 1 ? `1px solid ${C.border}` : 'none',
                  gap: 8,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: t.size,
                      fontWeight: t.label === 'H1' ? 800 : t.label === 'H2' ? 700 : t.label === 'H3' ? 600 : t.label === 'Body' ? 400 : 500,
                      color: C.charcoal,
                      margin: 0,
                      lineHeight: 1.25,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {t.sample}
                  </p>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: C.coral, margin: 0 }}>{t.label}</p>
                  <p style={{ fontSize: 8, color: C.muted, margin: 0, fontFamily: 'monospace' }}>{t.muted}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BORDER RADIUS ── */}
        <div style={{ padding: '14px 20px 0' }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: C.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1.6 }}>
            Border Radius
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            {radii.map((r) => (
              <div key={r.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div
                  style={{
                    width: '100%',
                    height: 36,
                    backgroundColor: C.white,
                    borderRadius: r.preview,
                    border: `2px solid ${C.border}`,
                    boxShadow: `0 2px 8px ${C.shadow}`,
                  }}
                />
                <p style={{ fontSize: 9, fontWeight: 700, color: C.muted, margin: 0 }}>{r.label}</p>
                <p style={{ fontSize: 8, color: C.mutedLight, margin: 0, fontFamily: 'monospace' }}>{r.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

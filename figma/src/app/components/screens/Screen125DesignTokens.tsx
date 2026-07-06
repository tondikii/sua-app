import { C, FONT } from '../colors';
import { DESTRUCTIVE } from '../ui/ConfirmDialogModal';

type Swatch = {
  name: string;
  hex: string;
  role: string;
  border?: boolean;
  textColor?: string;
};

const brandSwatches: Swatch[] = [
  { name: 'Warm Coral', hex: C.coral, role: 'Primary / CTA', textColor: 'white' },
  { name: 'Coral Light', hex: C.coralLight, role: 'Primary tint', border: true },
  { name: 'Coral Dark', hex: C.coralDark, role: 'Primary pressed', textColor: 'white' },
  { name: 'Soft Teal', hex: C.teal, role: 'Secondary / Tag', textColor: 'white' },
  { name: 'Teal Light', hex: C.tealLight, role: 'Secondary tint', border: true },
];

const neutralSwatches: Swatch[] = [
  { name: 'Charcoal', hex: C.charcoal, role: 'Text / Dark UI', textColor: 'white' },
  { name: 'Canvas', hex: C.light, role: 'Background', border: true },
  { name: 'White', hex: C.white, role: 'Surface', border: true },
  { name: 'Border', hex: C.border, role: 'Divider / Stroke', border: true },
  { name: 'Muted', hex: C.muted, role: 'Placeholder / Label', textColor: 'white' },
  { name: 'Muted Light', hex: C.mutedLight, role: 'Hint / Disabled', textColor: 'white' },
];

const semanticSwatches: Swatch[] = [
  { name: 'Danger', hex: C.danger, role: 'Delete / Destructive', textColor: 'white' },
  { name: 'Danger Dark', hex: C.dangerDark, role: 'Danger pressed / border', textColor: 'white' },
  { name: 'Danger Light', hex: C.dangerLight, role: 'Danger tint / icon bg', border: true },
  { name: 'Danger Border', hex: C.dangerBorder, role: 'Danger outline', border: true },
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

function SwatchGrid({ items }: { items: Swatch[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
      {items.map((s) => (
        <div
          key={s.name}
          style={{
            backgroundColor: C.white,
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: `0 2px 10px ${C.shadow}`,
            border: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              height: 44,
              backgroundColor: s.hex,
              border: s.border ? `1px solid ${C.border}` : 'none',
            }}
          />
          <div style={{ padding: '7px 8px' }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: C.charcoal, margin: '0 0 1px', lineHeight: 1.2 }}>{s.name}</p>
            <p style={{ fontSize: 9, fontWeight: 700, color: C.muted, margin: '0 0 1px', fontFamily: 'monospace' }}>{s.hex}</p>
            <p style={{ fontSize: 8, color: C.mutedLight, margin: 0, fontWeight: 500, lineHeight: 1.3 }}>{s.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 800, color: C.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1.6 }}>
      {children}
    </p>
  );
}

export function Screen125DesignTokens() {
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

      <div style={{ padding: '4px 20px 14px', borderBottom: `1px solid #E0DDD8`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <div style={{ backgroundColor: C.coral, color: 'white', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
            Referensi Dev
          </div>
          <div style={{ backgroundColor: C.tealLight, color: C.teal, fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
            v2.5.0
          </div>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: C.charcoal, margin: '6px 0 2px', letterSpacing: -0.5 }}>
          Design Tokens
        </h1>
        <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>
          Plus Jakarta Sans · Tailwind v4 · Atur Perjalanan
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 24 }}>
        <div style={{ padding: '12px 20px 0' }}>
          <SectionLabel>Brand</SectionLabel>
          <SwatchGrid items={brandSwatches} />
        </div>

        <div style={{ padding: '14px 20px 0' }}>
          <SectionLabel>Netral</SectionLabel>
          <SwatchGrid items={neutralSwatches} />
        </div>

        <div style={{ padding: '14px 20px 0' }}>
          <SectionLabel>Semantik — Danger</SectionLabel>
          <SwatchGrid items={semanticSwatches} />
        </div>

        <div style={{ padding: '14px 20px 0' }}>
          <SectionLabel>Button States</SectionLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, backgroundColor: C.white, borderRadius: 14, padding: 12, border: `1px solid ${C.border}`, boxShadow: `0 2px 10px ${C.shadow}` }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: C.muted, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 0.8 }}>Primary</p>
              <button
                type="button"
                style={{
                  width: '100%',
                  height: 40,
                  backgroundColor: C.coral,
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: FONT,
                  boxShadow: `0 6px 18px ${C.coral}40`,
                }}
              >
                CTA
              </button>
              <p style={{ fontSize: 8, color: C.mutedLight, margin: '6px 0 0', fontFamily: 'monospace', textAlign: 'center' }}>{C.coral}</p>
            </div>
            <div style={{ flex: 1, backgroundColor: C.white, borderRadius: 14, padding: 12, border: `1px solid ${C.border}`, boxShadow: `0 2px 10px ${C.shadow}` }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: C.muted, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 0.8 }}>Danger</p>
              <button
                type="button"
                style={{
                  width: '100%',
                  height: 40,
                  backgroundColor: DESTRUCTIVE.bg,
                  color: DESTRUCTIVE.text,
                  border: `1.5px solid ${DESTRUCTIVE.border}`,
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 800,
                  fontFamily: FONT,
                  boxShadow: `0 6px 16px ${DESTRUCTIVE.bg}35`,
                }}
              >
                Hapus
              </button>
              <p style={{ fontSize: 8, color: C.mutedLight, margin: '6px 0 0', fontFamily: 'monospace', textAlign: 'center' }}>{C.danger}</p>
            </div>
          </div>
          <p style={{ fontSize: 9, color: C.muted, margin: '8px 0 0', lineHeight: 1.45, fontWeight: 500 }}>
            Danger pure-red (#F94141) — G/B lebih rendah dari coral (#FF6B6B), jelas state hapus.
          </p>
        </div>

        <div style={{ padding: '14px 20px 0' }}>
          <SectionLabel>Tipografi</SectionLabel>
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

        <div style={{ padding: '14px 20px 0' }}>
          <SectionLabel>Border Radius</SectionLabel>
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

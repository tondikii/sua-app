import { X, ChevronLeft, ChevronRight, Calendar, Check } from 'lucide-react';
import { C, FONT } from '../colors';

const DAY_HEADERS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const JUNE_DAYS = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, null, null, null, null, null],
];
const SEL_START = 15;
const SEL_END = 18;

export function Screen30MultiDatePicker() {
  return (
    <div
      style={{
        width: '100%', height: '100%',
        backgroundColor: C.white,
        display: 'flex', flexDirection: 'column',
        fontFamily: FONT, overflow: 'hidden', position: 'relative',
      }}
    >
      <div style={{ height: 60 }} />

      {/* Modal header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 0' }}>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={18} color={C.charcoal} strokeWidth={2.5} />
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: C.charcoal, margin: 0 }}>Buat Perjalanan</h2>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Filled inputs (compact) */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, backgroundColor: C.light, borderRadius: 12, padding: '10px 14px', border: `1.5px solid ${C.border}` }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: 0.8 }}>Nama</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, margin: 0 }}>Lombok 2026</p>
          </div>
          <div style={{ flex: 1, backgroundColor: C.tealLight, borderRadius: 12, padding: '10px 14px', border: `1.5px solid ${C.teal}40` }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.teal, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: 0.8 }}>Tags</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.teal, margin: 0 }}>#Pantai #Alam</p>
          </div>
        </div>

        {/* Calendar */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal }}>Pilih Tanggal</label>
            <span style={{ fontSize: 11, color: C.coral, fontWeight: 700 }}>2 Kandidat</span>
          </div>

          <div style={{ backgroundColor: C.white, borderRadius: 18, border: `1.5px solid ${C.border}`, padding: '12px 12px 8px', boxShadow: `0 3px 14px ${C.shadow}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '0 2px' }}>
              <div style={{ width: 28, height: 28, backgroundColor: C.light, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft size={14} color={C.muted} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: C.charcoal }}>Juni 2026</span>
              <div style={{ width: 28, height: 28, backgroundColor: C.light, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight size={14} color={C.muted} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
              {DAY_HEADERS.map((d) => (
                <div key={d} style={{ textAlign: 'center', fontSize: 9, fontWeight: 700, color: C.muted, paddingBottom: 3 }}>{d}</div>
              ))}
            </div>

            {JUNE_DAYS.map((week, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {week.map((day, di) => {
                  if (!day) return <div key={di} />;
                  const isStart = day === SEL_START;
                  const isEnd = day === SEL_END;
                  const isInRange = day > SEL_START && day < SEL_END;
                  const isSelected = isStart || isEnd;
                  return (
                    <div key={di} style={{ height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundColor: isInRange ? C.coralLight : 'transparent', borderRadius: isStart ? '8px 0 0 8px' : isEnd ? '0 8px 8px 0' : 0, cursor: 'pointer' }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: isSelected ? C.coral : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isSelected ? `0 4px 10px ${C.coral}45` : 'none' }}>
                        <span style={{ fontSize: 11, fontWeight: isSelected || isInRange ? 700 : 500, color: isSelected ? 'white' : isInRange ? C.coral : C.charcoal }}>
                          {day}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Multi-candidate chips */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Kandidat Tanggal
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Candidate 1 — filled */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                backgroundColor: C.coralLight,
                borderRadius: 14,
                padding: '12px 14px',
                border: `1.5px solid ${C.coral}`,
              }}
            >
              <div style={{ width: 28, height: 28, backgroundColor: C.coral, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'white' }}>1</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: C.coral, margin: 0 }}>Kandidat 1: 15–18 Juni</p>
                <p style={{ fontSize: 11, color: `${C.coral}80`, margin: '2px 0 0', fontWeight: 500 }}>4 hari · Senin – Kamis</p>
              </div>
              <Check size={16} color={C.coral} strokeWidth={2.5} />
            </div>

            {/* Candidate 2 — empty / placeholder */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                backgroundColor: C.white,
                borderRadius: 14,
                padding: '12px 14px',
                border: `2px dashed ${C.border}`,
              }}
            >
              <div style={{ width: 28, height: 28, backgroundColor: C.light, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.muted }}>2</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.mutedLight, margin: 0 }}>Kandidat 2: Pilih tanggal...</p>
                <p style={{ fontSize: 11, color: C.border, margin: '2px 0 0', fontWeight: 500 }}>Ketuk kalender di atas</p>
              </div>
              <Calendar size={16} color={C.mutedLight} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ padding: '14px 20px 28px', backgroundColor: C.white, borderTop: `1px solid ${C.border}` }}>
        <button
          style={{
            width: '100%', height: 54,
            backgroundColor: C.coral, color: 'white',
            border: 'none', borderRadius: 16,
            fontSize: 16, fontWeight: 800,
            cursor: 'pointer',
            boxShadow: `0 10px 28px ${C.coral}45`,
            fontFamily: FONT,
          }}
        >
          Buat Perjalanan
        </button>
      </div>
    </div>
  );
}

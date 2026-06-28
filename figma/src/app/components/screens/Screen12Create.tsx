import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { C, FONT } from '../colors';

const DAY_HEADERS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

// June 2026: starts on Monday
const JUNE_DAYS = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, null, null, null, null, null],
];

const SELECTED_START = 15;
const SELECTED_END = 18;

const tags = ['#Pantai', '#Alam', '#Indonesia'];

export function Screen12Create() {
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

      {/* Modal header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 20px 0',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            backgroundColor: C.light,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} color={C.charcoal} strokeWidth={2.5} />
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: C.charcoal, margin: 0 }}>Buat Perjalanan</h2>
        <div style={{ width: 36 }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Nama Perjalanan input */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
            Nama Perjalanan
          </label>
          <div
            style={{
              backgroundColor: C.light,
              borderRadius: 14,
              padding: '14px 16px',
              border: `1.5px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 15, color: C.charcoal, fontWeight: 500 }}>Lombok Petualangan 2026</span>
          </div>
        </div>

        {/* Tags input */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
            Tags
          </label>
          <div
            style={{
              backgroundColor: C.light,
              borderRadius: 14,
              padding: '12px 14px',
              border: `1.5px solid ${C.border}`,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              alignItems: 'center',
              minHeight: 50,
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
                <X size={11} strokeWidth={2.5} />
              </div>
            ))}
            <span style={{ fontSize: 13, color: C.mutedLight }}>+ Tambah tag...</span>
          </div>
        </div>

        {/* Calendar */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 10 }}>
            Pilih Tanggal
          </label>
          <div
            style={{
              backgroundColor: C.white,
              borderRadius: 18,
              border: `1.5px solid ${C.border}`,
              padding: '14px 14px 10px',
              boxShadow: `0 3px 14px ${C.shadow}`,
            }}
          >
            {/* Month nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, padding: '0 2px' }}>
              <div style={{ width: 30, height: 30, backgroundColor: C.light, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronLeft size={16} color={C.muted} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: C.charcoal }}>Juni 2026</span>
              <div style={{ width: 30, height: 30, backgroundColor: C.light, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronRight size={16} color={C.muted} />
              </div>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 6 }}>
              {DAY_HEADERS.map((d) => (
                <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: C.muted, paddingBottom: 4 }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            {JUNE_DAYS.map((week, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
                {week.map((day, di) => {
                  if (!day) return <div key={di} />;
                  const isStart = day === SELECTED_START;
                  const isEnd = day === SELECTED_END;
                  const isInRange = day > SELECTED_START && day < SELECTED_END;
                  const isSelected = isStart || isEnd;
                  return (
                    <div
                      key={di}
                      style={{
                        height: 34,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        backgroundColor: isInRange ? C.coralLight : 'transparent',
                        borderRadius: isStart ? '10px 0 0 10px' : isEnd ? '0 10px 10px 0' : 0,
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 10,
                          backgroundColor: isSelected ? C.coral : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isSelected ? `0 4px 12px ${C.coral}45` : 'none',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: isSelected || isInRange ? 700 : 500,
                            color: isSelected ? 'white' : isInRange ? C.coral : day === 7 ? C.muted : C.charcoal,
                          }}
                        >
                          {day}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Add candidate date button */}
          <button
            style={{
              width: '100%',
              height: 46,
              backgroundColor: 'transparent',
              border: `2px dashed ${C.border}`,
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 600,
              color: C.muted,
              cursor: 'pointer',
              marginTop: 12,
              fontFamily: FONT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            + Tambah Kandidat Tanggal
          </button>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ padding: '16px 20px 28px', backgroundColor: C.white, borderTop: `1px solid ${C.border}` }}>
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

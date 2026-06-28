import { Search, Mail } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';

function AppBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: C.white, fontFamily: FONT }}>
      <div style={{ height: 60 }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 10px' }}>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12 }} />
        <div style={{ width: 120, height: 14, backgroundColor: C.border, borderRadius: 6 }} />
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12 }} />
      </div>
      <div style={{ display: 'flex', margin: '0 20px 12px', gap: 20 }}>
        {[80, 55, 40].map((w, i) => (
          <div key={i} style={{ width: w, height: 10, backgroundColor: i === 0 ? `${C.coral}60` : C.border, borderRadius: 5 }} />
        ))}
      </div>
      {[1, 2].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 12, margin: '8px 20px', padding: '12px', backgroundColor: C.light, borderRadius: 16, border: `1px solid ${C.border}` }}>
          <div style={{ width: 44, height: 44, backgroundColor: C.border, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: '55%', height: 11, backgroundColor: C.border, borderRadius: 5, marginBottom: 6 }} />
            <div style={{ width: '35%', height: 9, backgroundColor: C.border, borderRadius: 5 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const suggestions = [
  { id: 1, name: 'Rudi Hermawan', username: '@rudi_travel', initial: 'R', color: AVATAR_COLORS[0] },
  { id: 2, name: 'Dewi Astuti', username: '@dewi_jalan', initial: 'D', color: AVATAR_COLORS[1] },
  { id: 3, name: 'Fitra Kusuma', username: '@fitrakusuma', initial: 'F', color: AVATAR_COLORS[3] },
  { id: 4, name: 'Maya Sari', username: '@maya_explore', initial: 'M', color: AVATAR_COLORS[4] },
];

export function Screen14BottomSheetUndang() {
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
          height: '76%',
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
            Undang Teman
          </h2>
        </div>

        {/* Search + hint */}
        <div style={{ padding: '16px 22px 0', flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: C.light,
              borderRadius: 14,
              padding: '12px 16px',
              border: `1.5px solid ${C.border}`,
              marginBottom: 10,
            }}
          >
            <Search size={16} color={C.muted} />
            <span style={{ fontSize: 14, color: C.mutedLight }}>Cari username / email...</span>
          </div>

          {/* Hint */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              backgroundColor: C.tealLight,
              borderRadius: 12,
              padding: '10px 14px',
              marginBottom: 16,
            }}
          >
            <Mail size={14} color={C.teal} style={{ flexShrink: 0, marginTop: 1 }} strokeWidth={2.5} />
            <p style={{ fontSize: 12, color: C.teal, margin: 0, lineHeight: 1.55, fontWeight: 600 }}>
              Undangan via email akan dikirim ke Google Calendar.
            </p>
          </div>

          <p style={{ fontSize: 12, color: C.muted, margin: '0 0 10px', fontWeight: 700 }}>
            Disarankan dari kontakmu
          </p>
        </div>

        {/* Suggestions */}
        <div style={{ flex: 1, padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
          {suggestions.map((user, idx) => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 0',
                borderBottom: idx < suggestions.length - 1 ? `1px solid ${C.border}` : 'none',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: user.color,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 800,
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                {user.initial}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, margin: '0 0 2px' }}>
                  {user.name}
                </p>
                <p style={{ fontSize: 12, color: C.muted, margin: 0, fontWeight: 500 }}>{user.username}</p>
              </div>

              {/* Undang button */}
              <button
                style={{
                  height: 34,
                  padding: '0 16px',
                  backgroundColor: C.coral,
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: `0 4px 12px ${C.coral}40`,
                  fontFamily: FONT,
                  flexShrink: 0,
                }}
              >
                Undang
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Search, X, ArrowLeft } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

const results = [
  { id: 1, name: 'Budi Santoso', username: '@budi_wanderer', initial: 'B', color: AVATAR_COLORS[0], following: true, trips: 12 },
  { id: 2, name: 'Rina Dwi Lestari', username: '@rinadwi', initial: 'R', color: AVATAR_COLORS[3], following: false, trips: 7 },
  { id: 3, name: 'Andi Firmansyah', username: '@andifirman', initial: 'A', color: AVATAR_COLORS[1], following: false, trips: 4 },
  { id: 4, name: 'Nur Halimah', username: '@nur_travels', initial: 'N', color: AVATAR_COLORS[4], following: false, trips: 18 },
  { id: 5, name: 'Dika Pratama', username: '@dikapratama', initial: 'D', color: AVATAR_COLORS[2], following: true, trips: 9 },
  { id: 6, name: 'Wulan Sari', username: '@wulan_jalan', initial: 'W', color: AVATAR_COLORS[5], following: false, trips: 3 },
];

export function Screen12SearchUser() {
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

      {/* Header with search */}
      <div style={{ padding: '4px 20px 0', backgroundColor: C.white }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: C.light,
              borderRadius: 14,
              padding: '12px 16px',
              border: `1.5px solid ${C.coral}`,
              boxShadow: `0 0 0 3px ${C.coralLight}`,
            }}
          >
            <Search size={16} color={C.coral} strokeWidth={2.5} />
            <span style={{ fontSize: 14, color: C.charcoal, fontWeight: 500, flex: 1 }}>budi</span>
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: C.muted,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={11} color="white" strokeWidth={3} />
            </div>
          </div>
          <button
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              color: C.coral,
              cursor: 'pointer',
              padding: 0,
              fontFamily: FONT,
              whiteSpace: 'nowrap',
            }}
          >
            Batal
          </button>
        </div>

        {/* Result count */}
        <p style={{ fontSize: 12, color: C.muted, margin: '0 0 12px', fontWeight: 600 }}>
          {results.length} hasil ditemukan
        </p>
      </div>

      {/* Results list */}
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
        {results.map((user, idx) => (
          <div
            key={user.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '13px 0',
              borderBottom: idx < results.length - 1 ? `1px solid ${C.border}` : 'none',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 48,
                height: 48,
                backgroundColor: user.color,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 800,
                color: 'white',
                flexShrink: 0,
              }}
            >
              {user.initial}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: C.charcoal, margin: '0 0 2px', letterSpacing: -0.2 }}>
                {user.name}
              </p>
              <p style={{ fontSize: 12, color: C.muted, margin: '0 0 2px', fontWeight: 500 }}>{user.username}</p>
              <p style={{ fontSize: 11, color: C.mutedLight, margin: 0, fontWeight: 500 }}>
                {user.trips} perjalanan publik
              </p>
            </div>

            {/* Follow button */}
            {user.following ? (
              <button
                style={{
                  height: 34,
                  padding: '0 14px',
                  backgroundColor: C.tealLight,
                  color: C.teal,
                  border: `1.5px solid ${C.teal}40`,
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                ✓ Mengikuti
              </button>
            ) : (
              <button
                style={{
                  height: 34,
                  padding: '0 14px',
                  backgroundColor: 'transparent',
                  color: C.charcoal,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Ikuti
              </button>
            )}
          </div>
        ))}
      </div>

      <BottomNav active="search" />
    </div>
  );
}

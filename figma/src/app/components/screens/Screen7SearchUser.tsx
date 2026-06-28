import { Search, X } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { BottomNav } from '../BottomNav';
import { HeaderTextButton, SafeAreaTop } from '../ui/ScreenChrome';

/** Hasil pencarian "rina" — tap Rina → Screen10PublicProfile */
const results = [
  {
    id: 1,
    name: 'Rina Dwi Lestari',
    username: 'rinadwi_travel',
    initial: 'R',
    color: AVATAR_COLORS[3],
    following: false,
    trips: 28,
  },
  {
    id: 2,
    name: 'Karina Putri',
    username: 'karina_putri',
    initial: 'K',
    color: AVATAR_COLORS[4],
    following: false,
    trips: 5,
  },
];

/** Cari — hasil setelah mengetik "rina" */
export function Screen7SearchUser() {
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
      }}
    >
      <SafeAreaTop />

      <div style={{ padding: '12px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
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
            <span style={{ fontSize: 14, color: C.charcoal, fontWeight: 500, flex: 1 }}>rina</span>
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
          <HeaderTextButton>Batal</HeaderTextButton>
        </div>
        <p style={{ fontSize: 12, color: C.muted, margin: '0 0 12px', fontWeight: 600 }}>
          {results.length} hasil ditemukan
        </p>
      </div>

      <div style={{ flex: 1, padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
        {results.map((user, idx) => (
          <div
            key={user.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '13px 0',
              borderBottom: idx < results.length - 1 ? `1px solid ${C.border}` : 'none',
              cursor: user.id === 1 ? 'pointer' : 'default',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: user.id === 1 ? `linear-gradient(135deg, ${C.teal} 0%, #7FE3DE 100%)` : user.color,
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
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: C.charcoal, margin: '0 0 2px', letterSpacing: -0.2 }}>
                {user.name}
              </p>
              <p style={{ fontSize: 12, color: C.muted, margin: '0 0 2px', fontWeight: 500 }}>@{user.username}</p>
              <p style={{ fontSize: 11, color: C.mutedLight, margin: 0, fontWeight: 500 }}>
                {user.trips} perjalanan
              </p>
            </div>
            {user.following ? (
              <button
                type="button"
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
                type="button"
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

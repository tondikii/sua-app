import { Search, Clock } from 'lucide-react';
import { C, AVATAR_COLORS, FONT } from '../colors';
import { BottomNav } from '../BottomNav';
import { SafeAreaTop } from '../ui/ScreenChrome';

const RECENT = [
  { name: 'Rina Dwi Lestari', username: '@rinadwi_travel', initial: 'R', color: AVATAR_COLORS[3] },
  { name: 'Andi Firmansyah', username: '@andifirman', initial: 'A', color: AVATAR_COLORS[1] },
];

/** Cari — state awal sebelum mengetik */
export function Screen35SearchIdle() {
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
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.charcoal, margin: '0 0 16px', letterSpacing: -0.5 }}>
          Cari
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: C.light,
            borderRadius: 14,
            padding: '12px 16px',
            border: `1.5px solid ${C.border}`,
          }}
        >
          <Search size={16} color={C.muted} strokeWidth={2.5} />
          <span style={{ fontSize: 14, color: C.mutedLight, fontWeight: 500 }}>Cari nama atau username...</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px 22px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Clock size={14} color={C.muted} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Pencarian terakhir
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {RECENT.map((user) => (
            <div
              key={user.username}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 0',
                borderBottom: `1px solid ${C.border}`,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: user.color,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  fontWeight: 800,
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                {user.initial}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, margin: 0 }}>{user.name}</p>
                <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>{user.username}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: C.mutedLight, margin: '20px 0 0', lineHeight: 1.55, fontWeight: 500 }}>
          Temukan teman untuk diajak merencanakan liburan bareng.
        </p>
      </div>

      <BottomNav active="search" />
    </div>
  );
}

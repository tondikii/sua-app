import { Clock } from 'lucide-react';
import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';
import { SafeAreaTop } from '../ui/ScreenChrome';
import { SEARCH_RECENT, SearchBar, SearchUserRow } from '../search/SearchParts';

/** Cari — state awal sebelum mengetik */
export function Screen10SearchIdle() {
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

      <div style={{ padding: '12px 22px 0', flexShrink: 0 }}>
        <SearchBar />
      </div>

      <div style={{ flex: 1, minHeight: 0, padding: '20px 22px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Clock size={14} color={C.muted} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Pencarian terakhir
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {SEARCH_RECENT.map((user, idx) => (
            <SearchUserRow
              key={user.id}
              user={user}
              variant="recent"
              showBorder={idx < SEARCH_RECENT.length - 1}
              highlight={user.id === 1}
            />
          ))}
        </div>
        <p style={{ fontSize: 13, color: C.mutedLight, margin: '16px 0 0', lineHeight: 1.55, fontWeight: 500 }}>
          Temukan teman untuk diajak merencanakan liburan bareng.
        </p>
      </div>

      <BottomNav active="search" />
    </div>
  );
}

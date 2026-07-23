import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';
import { SafeAreaTop } from '../ui/ScreenChrome';
import { SearchBar } from '../search/SearchParts';
import { SearchEmptyState } from '../ui/SearchEmptyState';

/** Cari — query tidak menghasilkan hasil */
export function Screen12SearchNoResults() {
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
        <SearchBar query="xyztravel99" focused />
        <p style={{ fontSize: 12, color: C.muted, margin: '12px 0 0', fontWeight: 600 }}>
          0 hasil ditemukan
        </p>
      </div>

      <SearchEmptyState />

      <BottomNav active="search" />
    </div>
  );
}

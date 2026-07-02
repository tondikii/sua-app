import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';
import { SafeAreaTop } from '../ui/ScreenChrome';
import { SEARCH_RESULTS, SearchBar, SearchCancelButton, SearchUserRow } from '../search/SearchParts';

/** Hasil pencarian "rina" — tap Rina → Screen10PublicProfile */
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

      <div style={{ padding: '12px 22px 0', flexShrink: 0 }}>
        <SearchBar query="rina" focused rightAction={<SearchCancelButton />} />
        <p style={{ fontSize: 12, color: C.muted, margin: '12px 0 0', fontWeight: 600 }}>
          {SEARCH_RESULTS.length} hasil ditemukan
        </p>
      </div>

      <div style={{ flex: 1, minHeight: 0, padding: '8px 22px 0', overflow: 'hidden' }}>
        {SEARCH_RESULTS.map((user, idx) => (
          <SearchUserRow
            key={user.id}
            user={user}
            variant="result"
            showBorder={idx < SEARCH_RESULTS.length - 1}
            highlight={user.id === 1}
          />
        ))}
      </div>

      <BottomNav active="search" />
    </div>
  );
}

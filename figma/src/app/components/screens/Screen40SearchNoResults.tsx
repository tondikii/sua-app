import { SearchX } from 'lucide-react';
import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';
import { SafeAreaTop } from '../ui/ScreenChrome';
import { SearchBar, SearchCancelButton } from '../search/SearchParts';

/** Cari — query tidak menghasilkan hasil */
export function Screen40SearchNoResults() {
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
        <SearchBar query="xyztravel99" focused rightAction={<SearchCancelButton />} />
        <p style={{ fontSize: 12, color: C.muted, margin: '12px 0 0', fontWeight: 600 }}>0 hasil ditemukan</p>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 40px 100px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            backgroundColor: C.light,
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
          }}
        >
          <SearchX size={32} color={C.muted} strokeWidth={2} />
        </div>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: C.charcoal, margin: '0 0 8px', letterSpacing: -0.3 }}>
          Tidak ada hasil
        </h2>
        <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
          Coba cari dengan nama lengkap atau username yang berbeda. Pastikan ejaannya benar.
        </p>
      </div>

      <BottomNav active="search" />
    </div>
  );
}

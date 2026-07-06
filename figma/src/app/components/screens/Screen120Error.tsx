import { RefreshCw, WifiOff } from 'lucide-react';
import { C, FONT } from '../colors';

export function Screen120Error() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: C.white,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        overflow: 'hidden',
        padding: '60px 32px 48px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 22,
          backgroundColor: C.coralLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <WifiOff size={32} color={C.coral} strokeWidth={2.5} />
      </div>

      <h2
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: C.charcoal,
          margin: '0 0 10px',
          letterSpacing: -0.4,
          lineHeight: 1.3,
        }}
      >
        Tidak ada koneksi
      </h2>

      <p
        style={{
          fontSize: 14,
          color: C.muted,
          margin: '0 0 28px',
          lineHeight: 1.6,
          fontWeight: 500,
          maxWidth: 260,
        }}
      >
        Periksa internetmu lalu coba lagi.
      </p>

      <button
        type="button"
        style={{
          width: '100%',
          maxWidth: 240,
          height: 50,
          backgroundColor: C.coral,
          color: 'white',
          border: 'none',
          borderRadius: 14,
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: `0 8px 22px ${C.coral}45`,
          fontFamily: FONT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <RefreshCw size={16} strokeWidth={2.5} />
        Coba Lagi
      </button>
    </div>
  );
}

import { C, FONT } from '../colors';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="rgba(255,255,255,0.85)" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="rgba(255,255,255,0.7)" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}

export function Screen1Auth() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: C.white,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: FONT,
      }}
    >
      {/* Hero image area — 58% of screen */}
      <div style={{ flex: '0 0 58%', position: 'relative', overflow: 'hidden', backgroundColor: '#D4C8BC' }}>
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=700&fit=crop&auto=format"
          alt="Perjalanan indah menanti"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.05) 45%, rgba(255,255,255,0.85) 88%, rgba(255,255,255,1) 100%)',
          }}
        />

        {/* Logo — sits inside hero, accounting for dynamic island */}
        <div
          style={{
            position: 'absolute',
            top: 68,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              backgroundColor: C.coral,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 10px 28px ${C.coral}60`,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="white" stroke="none" />
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                color: 'white',
                fontSize: 26,
                fontWeight: 800,
                margin: 0,
                letterSpacing: -0.5,
                textShadow: '0 2px 12px rgba(0,0,0,0.35)',
              }}
            >
              Atur Perjalanan
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 13, margin: '5px 0 0', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
              Rencanakan. Jelajahi. Kenang.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom content */}
      <div style={{ flex: 1, backgroundColor: C.white, padding: '28px 24px 32px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.4 }}>
          Mulai Petualanganmu
        </h2>
        <p style={{ fontSize: 13, color: C.muted, margin: '7px 0 24px', lineHeight: 1.65 }}>
          Bergabung dan rencanakan perjalanan seru bersama orang-orang tersayang.
        </p>

        {/* Primary CTA */}
        <button
          style={{
            width: '100%',
            height: 54,
            backgroundColor: C.coral,
            color: 'white',
            border: 'none',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
            boxShadow: `0 10px 28px ${C.coral}45`,
            fontFamily: FONT,
          }}
        >
          <GoogleIcon />
          Lanjutkan dengan Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
          <span style={{ fontSize: 12, color: C.mutedLight }}>atau</span>
          <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
        </div>

        {/* Secondary */}
        <button
          style={{
            width: '100%',
            height: 50,
            backgroundColor: 'transparent',
            color: C.charcoal,
            border: `1.5px solid ${C.border}`,
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: FONT,
          }}
        >
          Masuk dengan Email
        </button>

        <p style={{ fontSize: 11, color: C.mutedLight, textAlign: 'center', marginTop: 20, lineHeight: 1.7 }}>
          Dengan melanjutkan, kamu menyetujui{' '}
          <span style={{ color: C.coral, fontWeight: 600 }}>Syarat & Ketentuan</span> serta{' '}
          <span style={{ color: C.coral, fontWeight: 600 }}>Kebijakan Privasi</span> kami.
        </p>
      </div>
    </div>
  );
}

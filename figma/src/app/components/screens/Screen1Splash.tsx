import { FONT } from '../colors';

function CompassIcon() {
  return (
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none">
      {/* Outer glow ring */}
      <circle cx="64" cy="64" r="62" fill="rgba(255,255,255,0.07)" />
      {/* Main ring */}
      <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      {/* Inner ring */}
      <circle cx="64" cy="64" r="38" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {/* Tick marks — 12 positions */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const isMajor = i % 3 === 0;
        const r1 = isMajor ? 46 : 48;
        const r2 = 54;
        const x1 = 64 + r1 * Math.sin(angle);
        const y1 = 64 - r1 * Math.cos(angle);
        const x2 = 64 + r2 * Math.sin(angle);
        const y2 = 64 - r2 * Math.cos(angle);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isMajor ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.22)'}
            strokeWidth={isMajor ? 1.5 : 1}
            strokeLinecap="round"
          />
        );
      })}
      {/* North needle (white, prominent) */}
      <path d="M64 64 L56 16 L64 27 L72 16 Z" fill="white" />
      {/* South needle (muted) */}
      <path d="M64 64 L56 112 L64 101 L72 112 Z" fill="rgba(255,255,255,0.32)" />
      {/* East needle */}
      <path d="M64 64 L112 56 L101 64 L112 72 Z" fill="rgba(255,255,255,0.32)" />
      {/* West needle */}
      <path d="M64 64 L16 56 L27 64 L16 72 Z" fill="rgba(255,255,255,0.32)" />
      {/* Center hub */}
      <circle cx="64" cy="64" r="9" fill="white" />
      <circle cx="64" cy="64" r="4.5" fill="#FF6B6B" />
      {/* Cardinal letters */}
      <text x="64" y="9" textAnchor="middle" fill="white" fontSize="12" fontWeight="800" fontFamily={FONT}>U</text>
      <text x="64" y="124" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontWeight="700" fontFamily={FONT}>S</text>
      <text x="123" y="68" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontWeight="700" fontFamily={FONT}>T</text>
      <text x="5" y="68" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontWeight="700" fontFamily={FONT}>B</text>
    </svg>
  );
}

export function Screen1Splash() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(148deg, #FF8A65 0%, #FF6B6B 48%, #F94E4E 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative rings */}
      <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

      {/* Logo container */}
      <div
        style={{
          width: 156,
          height: 156,
          borderRadius: 44,
          backgroundColor: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 28,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.2) inset',
        }}
      >
        <CompassIcon />
      </div>

      {/* App name */}
      <h1
        style={{
          color: 'white',
          fontSize: 30,
          fontWeight: 800,
          margin: '0 0 10px',
          letterSpacing: -0.8,
          textShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}
      >
        Atur Perjalanan
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, margin: 0, fontWeight: 500, letterSpacing: 0.2 }}>
        Rencanakan. Jelajahi. Kenang.
      </p>

      {/* Bottom loading indicator */}
      <div style={{ position: 'absolute', bottom: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        {/* Loading bar */}
        <div style={{ width: 120, height: 3, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ width: '60%', height: '100%', backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 20 }} />
        </div>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: 0.5 }}>
          Versi 2.4.1
        </span>
      </div>
    </div>
  );
}

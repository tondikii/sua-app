import { FONT } from '../colors';

function CompassIcon() {
  return (
    <svg width="128" height="128" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="white" />
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
      <div
        style={{
          position: 'absolute',
          width: 480,
          height: 480,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.07)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 340,
          height: 340,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.05)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />

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
      <p
        style={{
          color: 'rgba(255,255,255,0.72)',
          fontSize: 15,
          margin: 0,
          fontWeight: 500,
          letterSpacing: 0.2,
        }}
      >
        Rencanakan. Jelajahi. Kenang.
      </p>
    </div>
  );
}

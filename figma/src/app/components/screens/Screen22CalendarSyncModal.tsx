import { X } from 'lucide-react';
import { C, FONT } from '../colors';

function AppBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: C.white, fontFamily: FONT }}>
      <div style={{ height: 60 }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 10px' }}>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12 }} />
        <div style={{ width: 130, height: 14, backgroundColor: C.border, borderRadius: 6 }} />
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12 }} />
      </div>
      <div style={{ margin: '0 20px 14px', backgroundColor: C.teal, borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 11 }} />
        <div>
          <div style={{ width: 140, height: 12, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 5, marginBottom: 5 }} />
          <div style={{ width: 110, height: 9, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4 }} />
        </div>
      </div>
      <div style={{ margin: '0 20px', backgroundColor: C.white, borderRadius: 20, padding: '20px', border: `1.5px solid ${C.teal}40`, boxShadow: `0 4px 20px ${C.shadow}` }}>
        <div style={{ width: '40%', height: 10, backgroundColor: `${C.teal}50`, borderRadius: 5, marginBottom: 10 }} />
        <div style={{ width: '55%', height: 22, backgroundColor: C.border, borderRadius: 8, marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          {[70, 85, 65].map((w, i) => <div key={i} style={{ width: w, height: 28, backgroundColor: C.light, borderRadius: 10, border: `1px solid ${C.border}` }} />)}
        </div>
      </div>
      <div style={{ margin: '14px 20px 0', height: 50, backgroundColor: C.white, borderRadius: 16, border: `2px solid ${C.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 170, height: 11, backgroundColor: `${C.teal}40`, borderRadius: 5 }} />
      </div>
    </div>
  );
}

function SuccessIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      {/* Outer glow ring */}
      <circle cx="48" cy="48" r="48" fill="#EDF9F8" />
      {/* Middle ring */}
      <circle cx="48" cy="48" r="38" fill="#D4F5F2" />
      {/* Main circle */}
      <circle cx="48" cy="48" r="29" fill="#4ECDC4" />
      {/* Checkmark */}
      <path d="M31 48 L43 60 L65 34" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Screen22CalendarSyncModal() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <AppBg />

      {/* Scrim */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,15,20,0.50)', zIndex: 10, backdropFilter: 'blur(2px)' }} />

      {/* Centered modal */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100% - 48px)',
          backgroundColor: C.white,
          borderRadius: 28,
          padding: '32px 24px 28px',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 30px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06) inset',
        }}
      >
        {/* Close button */}
        <button
          style={{
            position: 'absolute',
            top: 16, right: 16,
            width: 32, height: 32,
            backgroundColor: C.light,
            border: 'none', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={15} color={C.muted} strokeWidth={2.5} />
        </button>

        {/* Success illustration */}
        <SuccessIllustration />

        {/* Text */}
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: C.charcoal,
            margin: '20px 0 10px',
            letterSpacing: -0.4,
            lineHeight: 1.25,
          }}
        >
          Berhasil Tersinkronisasi!
        </h2>
        <p
          style={{
            fontSize: 13,
            color: C.muted,
            margin: '0 0 24px',
            lineHeight: 1.7,
            fontWeight: 500,
          }}
        >
          Jadwal <span style={{ fontWeight: 800, color: C.charcoal }}>Lombok Escape</span> telah ditambahkan ke Google Calendar seluruh partisipan.
        </p>

        {/* Participant row */}
        <div
          style={{
            width: '100%',
            backgroundColor: C.tealLight,
            borderRadius: 14,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {['R','B','A','D','S'].map((init, i) => (
              <div
                key={i}
                style={{
                  width: 28, height: 28,
                  backgroundColor: ['#FF6B6B','#4ECDC4','#FFB347','#8B7CF6','#60A5FA'][i],
                  borderRadius: '50%',
                  border: '2px solid white',
                  marginLeft: i > 0 ? -9 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800, color: 'white',
                  zIndex: 5 - i,
                }}
              >
                {init}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: C.teal, fontWeight: 700, margin: 0 }}>
            5 kalender diperbarui ✓
          </p>
        </div>

        {/* CTA */}
        <button
          style={{
            width: '100%',
            height: 50,
            backgroundColor: C.teal,
            color: 'white',
            border: 'none',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: `0 8px 24px ${C.teal}45`,
            fontFamily: FONT,
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

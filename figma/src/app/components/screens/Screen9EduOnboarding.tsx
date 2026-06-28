import { C, FONT } from '../colors';

export function Screen9EduOnboarding() {
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
      {/* Hero illustration — top 56% */}
      <div style={{ flex: '0 0 56%', position: 'relative', overflow: 'hidden', backgroundColor: '#C9E8E6' }}>
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&h=700&fit=crop&auto=format"
          alt="Rencanakan perjalanan bersama"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Soft gradient fade to white at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.96))',
          }}
        />
        {/* Dynamic island spacer — ensure content doesn't go behind pill */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60 }} />

        {/* Small app badge at top-left */}
        <div
          style={{
            position: 'absolute',
            top: 68,
            left: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              backgroundColor: C.coral,
              borderRadius: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 6px 18px ${C.coral}55`,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="white" stroke="none" />
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: C.charcoal }}>Atur Perjalanan</span>
        </div>
      </div>

      {/* Bottom content */}
      <div style={{ flex: 1, padding: '20px 28px 32px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: C.charcoal, margin: '0 0 10px', letterSpacing: -0.6, lineHeight: 1.25 }}>
            Rencanakan Bersama
          </h2>
          <p style={{ fontSize: 15, color: C.muted, margin: 0, lineHeight: 1.65, fontWeight: 500 }}>
            Voting tanggal dan kumpulkan destinasi tanpa ribet.
          </p>

          {/* Feature highlights */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '🗳️', text: 'Vote tanggal favorit bareng teman' },
              { icon: '📍', text: 'Kumpulkan destinasi dalam satu papan' },
              { icon: '💬', text: 'Chat grup khusus tiap perjalanan' },
            ].map((item) => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    backgroundColor: C.light,
                    borderRadius: 11,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 17,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <span style={{ fontSize: 13, color: C.charcoal, fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 22 }}>
          <div style={{ width: 22, height: 7, backgroundColor: C.coral, borderRadius: 20 }} />
          <div style={{ width: 7, height: 7, backgroundColor: C.border, borderRadius: 20 }} />
          <div style={{ width: 7, height: 7, backgroundColor: C.border, borderRadius: 20 }} />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            style={{
              flex: '0 0 auto',
              height: 52,
              padding: '0 20px',
              backgroundColor: 'transparent',
              color: C.muted,
              border: 'none',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: FONT,
            }}
          >
            Lewati
          </button>
          <button
            style={{
              flex: 1,
              height: 52,
              backgroundColor: C.coral,
              color: 'white',
              border: 'none',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: `0 10px 26px ${C.coral}45`,
              fontFamily: FONT,
            }}
          >
            Selanjutnya →
          </button>
        </div>
      </div>
    </div>
  );
}

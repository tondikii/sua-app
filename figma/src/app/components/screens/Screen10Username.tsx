import { ArrowLeft, CheckCircle, AtSign } from 'lucide-react';
import { C, FONT } from '../colors';

export function Screen10Username() {
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
        position: 'relative',
      }}
    >
      {/* Dynamic island spacer */}
      <div style={{ height: 60 }} />

      {/* Back arrow */}
      <div style={{ padding: '4px 20px 0' }}>
        <div
          style={{
            width: 38,
            height: 38,
            backgroundColor: C.light,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} color={C.charcoal} strokeWidth={2.5} />
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '28px 24px 0' }}>
        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {[true, true, false].map((done, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                backgroundColor: done ? C.coral : C.border,
                borderRadius: 4,
              }}
            />
          ))}
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              backgroundColor: C.coralLight,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              marginBottom: 20,
            }}
          >
            ✨
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.charcoal, margin: '0 0 10px', letterSpacing: -0.6, lineHeight: 1.2 }}>
            Satu langkah lagi!
          </h1>
          <p style={{ fontSize: 15, color: C.muted, margin: 0, lineHeight: 1.65, fontWeight: 500 }}>
            Pilih username unik untuk profilmu.
          </p>
        </div>

        {/* Username input */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 10 }}>
            Username
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: C.white,
              border: `2px solid ${C.teal}`,
              borderRadius: 16,
              padding: '14px 16px',
              boxShadow: `0 0 0 4px ${C.tealLight}`,
            }}
          >
            <AtSign size={17} color={C.teal} strokeWidth={2.5} />
            <span style={{ fontSize: 16, fontWeight: 600, color: C.charcoal }}>budi_santoso</span>
            <CheckCircle size={18} color={C.teal} fill={C.tealLight} style={{ marginLeft: 'auto' }} strokeWidth={2.5} />
          </div>
          {/* Success message */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, paddingLeft: 4 }}>
            <CheckCircle size={13} color={C.teal} strokeWidth={2.5} />
            <span style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>Username tersedia</span>
          </div>
        </div>

        {/* Suggestions */}
        <div style={{ marginTop: 22 }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 10 }}>Saran username:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['@budi_travel', '@budijs', '@budi_explore'].map((s) => (
              <div
                key={s}
                style={{
                  padding: '7px 14px',
                  backgroundColor: C.light,
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.charcoal,
                  cursor: 'pointer',
                  border: `1px solid ${C.border}`,
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Info note */}
        <div
          style={{
            marginTop: 24,
            backgroundColor: C.light,
            borderRadius: 14,
            padding: '14px 16px',
            border: `1px solid ${C.border}`,
          }}
        >
          <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.6 }}>
            💡 Username hanya bisa mengandung huruf, angka, dan tanda garis bawah (_). Minimal 3 karakter.
          </p>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ padding: '20px 24px 40px', backgroundColor: C.white, borderTop: `1px solid ${C.border}` }}>
        <button
          style={{
            width: '100%',
            height: 56,
            backgroundColor: C.coral,
            color: 'white',
            border: 'none',
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: `0 12px 30px ${C.coral}45`,
            fontFamily: FONT,
          }}
        >
          Mulai Perjalanan 🚀
        </button>
      </div>
    </div>
  );
}

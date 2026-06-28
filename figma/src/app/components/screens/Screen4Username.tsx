import { ArrowLeft, CheckCircle, AtSign } from 'lucide-react';
import { C, FONT } from '../colors';

export function Screen4Username() {
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
      <div style={{ height: 60 }} />

      <div style={{ flex: 1, padding: '32px 24px 0', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.charcoal, margin: '0 0 8px', letterSpacing: -0.5, lineHeight: 1.25 }}>
          Buat username
        </h1>
        <p style={{ fontSize: 14, color: C.muted, margin: '0 0 28px', lineHeight: 1.55, fontWeight: 500 }}>
          Ini nama yang akan dilihat teman saat kamu diundang ke perjalanan.
        </p>

        <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
          Username
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: C.white,
            border: `1.5px solid ${C.teal}`,
            borderRadius: 14,
            padding: '13px 14px',
          }}
        >
          <AtSign size={16} color={C.muted} strokeWidth={2.5} />
          <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: C.charcoal }}>budi_santoso</span>
          <CheckCircle size={17} color={C.teal} strokeWidth={2.5} />
        </div>
        <p style={{ fontSize: 12, color: C.teal, fontWeight: 600, margin: '8px 0 0' }}>
          Username tersedia
        </p>
        <p style={{ fontSize: 12, color: C.mutedLight, margin: '6px 0 0', lineHeight: 1.5 }}>
          Huruf, angka, dan underscore (_) · min. 3 karakter
        </p>

        <div style={{ marginTop: 24 }}>
          <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: '0 0 8px' }}>Saran</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['budi_travel', 'budijs', 'budi_explore'].map((s) => (
              <div
                key={s}
                style={{
                  padding: '6px 12px',
                  backgroundColor: C.light,
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.charcoal,
                  cursor: 'pointer',
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 24px 36px' }}>
        <button
          style={{
            width: '100%',
            height: 52,
            backgroundColor: C.coral,
            color: 'white',
            border: 'none',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: `0 10px 26px ${C.coral}40`,
            fontFamily: FONT,
          }}
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
}

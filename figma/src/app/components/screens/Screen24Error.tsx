import { RefreshCw, Wifi } from 'lucide-react';
import { C, FONT } from '../colors';

function ErrorIllustration() {
  return (
    <svg width="200" height="180" viewBox="0 0 200 180" fill="none">
      {/* Soft glow */}
      <circle cx="100" cy="90" r="76" fill="#FFF0F0" />
      {/* Outer compass ring */}
      <circle cx="100" cy="90" r="58" fill="white" stroke="#EBEBF2" strokeWidth="2.5" />
      {/* Dashed outer border */}
      <circle cx="100" cy="90" r="58" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeDasharray="6 5" opacity="0.55" />
      {/* Cardinal letters */}
      <text x="100" y="27" textAnchor="middle" fill="#9091A0" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">U</text>
      <text x="100" y="162" textAnchor="middle" fill="#9091A0" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">S</text>
      <text x="170" y="94" textAnchor="middle" fill="#9091A0" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">T</text>
      <text x="30" y="94" textAnchor="middle" fill="#9091A0" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">B</text>
      {/* Cross hairs */}
      <line x1="100" y1="38" x2="100" y2="142" stroke="#EBEBF2" strokeWidth="1.5" />
      <line x1="48" y1="90" x2="152" y2="90" stroke="#EBEBF2" strokeWidth="1.5" />
      {/* Confused needle — pointing sideways/wrong direction */}
      {/* Red half (tilted, pointing wrong direction) */}
      <path d="M100 90 L70 58" stroke="#FF6B6B" strokeWidth="5" strokeLinecap="round" />
      <polygon points="70,58 64,72 77,70" fill="#FF6B6B" />
      {/* Gray half */}
      <path d="M100 90 L124 118" stroke="#B8B9C6" strokeWidth="5" strokeLinecap="round" />
      <polygon points="124,118 117,109 128,107" fill="#B8B9C6" />
      {/* Center */}
      <circle cx="100" cy="90" r="8" fill="white" stroke="#FF6B6B" strokeWidth="2.5" />
      <circle cx="100" cy="90" r="4" fill="#FF6B6B" />
      {/* Question marks */}
      <text x="146" y="52" fill="#4ECDC4" fontSize="20" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif" opacity="0.9">?</text>
      <text x="44" y="60" fill="#FF6B6B" fontSize="16" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif" opacity="0.75">?</text>
      <text x="154" y="128" fill="#9091A0" fontSize="13" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif" opacity="0.7">?</text>
      {/* Broken signal rings (top right area) */}
      <path d="M148 24 Q156 18 164 24" stroke="#FF6B6B" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4" />
      <path d="M143 30 Q156 20 169 30" stroke="#FF6B6B" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.25" />
      <circle cx="156" cy="32" r="3" fill="#FF6B6B" opacity="0.6" />
      {/* X mark on signal */}
      <line x1="152" y1="17" x2="160" y2="25" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="160" y1="17" x2="152" y2="25" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function Screen24Error() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: C.white,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: FONT,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ height: 60 }} />

      {/* Centered error content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 32px 40px',
          textAlign: 'center',
        }}
      >
        <ErrorIllustration />

        <div style={{ marginTop: 24, marginBottom: 10 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: C.coralLight,
              borderRadius: 20,
              padding: '5px 14px',
              marginBottom: 18,
            }}
          >
            <Wifi size={13} color={C.coral} strokeWidth={2.5} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.coral }}>Tidak ada koneksi</span>
          </div>
        </div>

        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: C.charcoal,
            margin: '0 0 12px',
            letterSpacing: -0.5,
            lineHeight: 1.25,
          }}
        >
          Oops! Sepertinya<br />kita tersesat.
        </h2>

        <p
          style={{
            fontSize: 14,
            color: C.muted,
            margin: '0 0 32px',
            lineHeight: 1.65,
            fontWeight: 500,
            maxWidth: 280,
          }}
        >
          Gagal terhubung ke server. Silakan periksa koneksi internetmu dan coba lagi.
        </p>

        {/* Primary CTA */}
        <button
          style={{
            height: 54,
            padding: '0 36px',
            backgroundColor: C.coral,
            color: 'white',
            border: 'none',
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: `0 12px 30px ${C.coral}50`,
            fontFamily: FONT,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            marginBottom: 14,
          }}
        >
          <RefreshCw size={17} strokeWidth={2.5} />
          Coba Lagi
        </button>

        {/* Secondary */}
        <button
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            color: C.muted,
            cursor: 'pointer',
            fontFamily: FONT,
          }}
        >
          Kembali ke Beranda
        </button>
      </div>

      {/* App version footer */}
      <div style={{ paddingBottom: 32, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{ width: 20, height: 20, backgroundColor: C.coralLight, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.coral} strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={C.coral} stroke="none" />
            </svg>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.charcoal }}>Atur Perjalanan</span>
        </div>
        <span style={{ fontSize: 11, color: C.mutedLight, fontWeight: 500 }}>Kode galat: NET_UNREACHABLE</span>
      </div>
    </div>
  );
}

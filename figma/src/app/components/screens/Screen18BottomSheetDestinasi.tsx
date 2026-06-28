import { MapPin, Link, Play, ArrowLeft, MoreHorizontal, Navigation } from 'lucide-react';
import { C, FONT } from '../colors';

function AppBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: C.white, fontFamily: FONT }}>
      {/* Simulated trip detail background */}
      <div style={{ height: 60 }} />
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px' }}>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12 }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 140, height: 14, backgroundColor: C.border, borderRadius: 6 }} />
          <div style={{ width: 90, height: 10, backgroundColor: C.border, borderRadius: 5, marginTop: 5, marginLeft: 'auto', marginRight: 'auto' }} />
        </div>
        <div style={{ width: 36, height: 36, backgroundColor: C.light, borderRadius: 12 }} />
      </div>
      {/* Tabs */}
      <div style={{ display: 'flex', margin: '12px 20px', borderBottom: `1.5px solid ${C.border}`, paddingBottom: 10 }}>
        <div style={{ width: 70, height: 10, backgroundColor: `${C.coral}60`, borderRadius: 5, marginRight: 20 }} />
        <div style={{ width: 50, height: 10, backgroundColor: C.border, borderRadius: 5, marginRight: 20 }} />
        <div style={{ width: 40, height: 10, backgroundColor: C.border, borderRadius: 5 }} />
      </div>
      {/* Destination items */}
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '10px 20px', padding: '14px', backgroundColor: C.light, borderRadius: 16, border: `1px solid ${C.border}` }}>
          <div style={{ width: 44, height: 44, backgroundColor: C.border, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: '60%', height: 11, backgroundColor: C.border, borderRadius: 5, marginBottom: 6 }} />
            <div style={{ width: '40%', height: 9, backgroundColor: C.border, borderRadius: 5 }} />
          </div>
          <div style={{ width: 32, height: 32, backgroundColor: C.tealLight, borderRadius: 10 }} />
        </div>
      ))}
    </div>
  );
}

export function Screen18BottomSheetDestinasi() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: FONT,
      }}
    >
      {/* Background app content */}
      <AppBg />

      {/* Scrim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(26,26,46,0.45)',
          zIndex: 10,
        }}
      />

      {/* Bottom sheet */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '72%',
          backgroundColor: C.white,
          borderRadius: '26px 26px 0 0',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 14, paddingBottom: 6, flexShrink: 0 }}>
          <div style={{ width: 40, height: 5, backgroundColor: C.border, borderRadius: 20 }} />
        </div>

        {/* Sheet header */}
        <div style={{ padding: '8px 22px 16px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.3 }}>
            Tambah Destinasi
          </h2>
          <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0', fontWeight: 500 }}>
            Lengkapi info destinasi pilihanmu
          </p>
        </div>

        {/* Inputs */}
        <div style={{ flex: 1, padding: '20px 22px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Nama Tempat */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
              Nama Tempat <span style={{ color: C.coral }}>*</span>
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: C.light,
                borderRadius: 14,
                padding: '13px 16px',
                border: `1.5px solid ${C.coral}`,
                boxShadow: `0 0 0 3px ${C.coralLight}`,
              }}
            >
              <MapPin size={16} color={C.coral} strokeWidth={2.5} />
              <span style={{ fontSize: 15, color: C.charcoal, fontWeight: 500 }}>Pantai Kuta Lombok</span>
            </div>
          </div>

          {/* Link Google Maps */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
              Link Google Maps
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: C.light,
                borderRadius: 14,
                padding: '13px 16px',
                border: `1.5px solid ${C.border}`,
              }}
            >
              <Navigation size={16} color={C.muted} strokeWidth={2} />
              <span style={{ fontSize: 14, color: C.mutedLight, fontWeight: 400 }}>https://maps.google.com/...</span>
            </div>
          </div>

          {/* Link TikTok/IG */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
              Link TikTok / Instagram
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: C.light,
                borderRadius: 14,
                padding: '13px 16px',
                border: `1.5px solid ${C.border}`,
              }}
            >
              <Play size={15} color={C.muted} strokeWidth={2} />
              <span style={{ fontSize: 14, color: C.mutedLight, fontWeight: 400 }}>https://www.tiktok.com/...</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '20px 22px 28px', flexShrink: 0 }}>
          <button
            style={{
              width: '100%',
              height: 54,
              backgroundColor: C.coral,
              color: 'white',
              border: 'none',
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: `0 10px 26px ${C.coral}45`,
              fontFamily: FONT,
            }}
          >
            Simpan Destinasi
          </button>
        </div>
      </div>
    </div>
  );
}

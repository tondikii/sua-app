import { ArrowLeft, Camera, User, AtSign, AlignLeft, Globe, CheckCircle } from 'lucide-react';
import { C, FONT } from '../colors';

export function Screen16EditProfil() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: C.white,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Dynamic island spacer */}
      <div style={{ height: 60 }} />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 20px 14px',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
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
        <h2 style={{ fontSize: 17, fontWeight: 800, color: C.charcoal, margin: 0 }}>Edit Profil</h2>
        <button
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: 15,
            fontWeight: 700,
            color: C.coral,
            cursor: 'pointer',
            fontFamily: FONT,
            padding: 0,
          }}
        >
          Simpan
        </button>
      </div>

      {/* Avatar section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 20px 24px',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ position: 'relative', marginBottom: 12 }}>
          {/* Avatar */}
          <div
            style={{
              width: 90,
              height: 90,
              background: `linear-gradient(135deg, ${C.coral} 0%, #FF8E8E 100%)`,
              borderRadius: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 800,
              color: 'white',
              boxShadow: `0 12px 30px ${C.coral}40`,
            }}
          >
            B
          </div>
          {/* Camera badge */}
          <div
            style={{
              position: 'absolute',
              bottom: -4,
              right: -4,
              width: 30,
              height: 30,
              backgroundColor: C.coral,
              borderRadius: 10,
              border: `3px solid white`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: `0 4px 12px ${C.coral}50`,
            }}
          >
            <Camera size={14} color="white" strokeWidth={2.5} />
          </div>
        </div>
        <button
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: 14,
            fontWeight: 700,
            color: C.coral,
            cursor: 'pointer',
            fontFamily: FONT,
          }}
        >
          Ubah Foto Profil
        </button>
      </div>

      {/* Form fields */}
      <div style={{ flex: 1, padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Nama Lengkap */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
            Nama Lengkap
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
            <User size={16} color={C.muted} strokeWidth={2} />
            <span style={{ fontSize: 15, color: C.charcoal, fontWeight: 500, flex: 1 }}>Budi Santoso</span>
            <CheckCircle size={16} color={C.teal} strokeWidth={2.5} />
          </div>
        </div>

        {/* Username */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
            Username
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
            <AtSign size={16} color={C.muted} strokeWidth={2} />
            <span style={{ fontSize: 15, color: C.charcoal, fontWeight: 500 }}>budi_santoso</span>
          </div>
          <p style={{ fontSize: 11, color: C.mutedLight, margin: '6px 0 0 4px', fontWeight: 500 }}>
            Terlihat publik di profil kamu
          </p>
        </div>

        {/* Bio */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
            Bio
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              backgroundColor: C.light,
              borderRadius: 14,
              padding: '13px 16px',
              border: `1.5px solid ${C.border}`,
              minHeight: 88,
            }}
          >
            <AlignLeft size={16} color={C.muted} strokeWidth={2} style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 14, color: C.charcoal, fontWeight: 400, lineHeight: 1.6 }}>
              Travel enthusiast 🌏 | Jakarta | Suka jelajahi pantai dan budaya lokal Indonesia 🇮🇩
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5 }}>
            <span style={{ fontSize: 11, color: C.mutedLight, fontWeight: 500 }}>72 / 150</span>
          </div>
        </div>

        {/* Website */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
            Website / Sosial Media
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
            <Globe size={16} color={C.muted} strokeWidth={2} />
            <span style={{ fontSize: 14, color: C.mutedLight, fontWeight: 400 }}>Tambah link profilmu...</span>
          </div>
        </div>
      </div>

      {/* Bottom save button */}
      <div style={{ padding: '20px 20px 36px', backgroundColor: C.white, borderTop: `1px solid ${C.border}` }}>
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
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

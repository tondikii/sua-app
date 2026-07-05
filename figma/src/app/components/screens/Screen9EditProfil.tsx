import { CheckCircle, User, AtSign, AlignLeft, Globe } from 'lucide-react';
import { C, FONT } from '../colors';
import { HeaderTextButton, NavHeader, SafeAreaTop } from '../ui/ScreenChrome';

export function Screen9EditProfil() {
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
      }}
    >
      <SafeAreaTop />
      <NavHeader title="Edit Profil" right={<HeaderTextButton>Simpan</HeaderTextButton>} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 22px 20px',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            background: `linear-gradient(135deg, ${C.coral} 0%, #FF8E8E 100%)`,
            borderRadius: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 34,
            fontWeight: 800,
            color: 'white',
            boxShadow: `0 10px 26px ${C.coral}40`,
            marginBottom: 10,
          }}
        >
          B
        </div>
        <button
          type="button"
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

      <div style={{ flex: 1, padding: '20px 22px 0', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
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
          </div>
        </div>

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
        </div>

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

      <div style={{ padding: '16px 22px 32px', backgroundColor: C.white, borderTop: `1px solid ${C.border}` }}>
        <button
          type="button"
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

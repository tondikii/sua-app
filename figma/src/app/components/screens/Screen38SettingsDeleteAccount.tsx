import { UserX } from 'lucide-react';
import { C, FONT } from '../colors';
import { NavHeader, SafeAreaTop } from '../ui/ScreenChrome';
import { DESTRUCTIVE } from '../ui/ConfirmDialogModal';

const USERNAME = 'budi_santoso';

/** Konfirmasi hapus akun — wajib untuk kepatuhan Play Store */
export function Screen38SettingsDeleteAccount() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: C.light,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      <SafeAreaTop />
      <NavHeader title="Hapus Akun" onLight={false} border={false} />

      <div style={{ flex: 1, padding: '8px 22px 0', overflow: 'auto' }}>
        <div
          style={{
            backgroundColor: C.white,
            borderRadius: 22,
            padding: '28px 22px 24px',
            boxShadow: `0 4px 20px ${C.shadow}`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              margin: '0 auto 16px',
              backgroundColor: C.light,
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UserX size={28} color={C.muted} strokeWidth={2} />
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: C.charcoal, margin: '0 0 8px', letterSpacing: -0.3 }}>
            Hapus akun permanen?
          </h2>
          <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
            Profil, perjalanan, wishlist, dan data lainnya akan dihapus dan tidak bisa dipulihkan.
          </p>
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
            Ketik username untuk konfirmasi
          </label>
          <div
            style={{
              backgroundColor: C.white,
              borderRadius: 14,
              padding: '13px 16px',
              border: `1.5px solid ${C.border}`,
              boxShadow: `0 2px 10px ${C.shadow}`,
            }}
          >
            <span style={{ fontSize: 15, color: C.charcoal, fontWeight: 500 }}>{USERNAME}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 22px 32px', backgroundColor: C.light }}>
        <button
          type="button"
          style={{
            width: '100%',
            height: 50,
            backgroundColor: DESTRUCTIVE.bg,
            color: DESTRUCTIVE.text,
            border: `1.5px solid ${DESTRUCTIVE.border}`,
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: FONT,
            marginBottom: 10,
          }}
        >
          Hapus Akun
        </button>
        <button
          type="button"
          style={{
            width: '100%',
            height: 48,
            backgroundColor: C.white,
            color: C.charcoal,
            border: `1.5px solid ${C.border}`,
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: FONT,
            boxShadow: `0 2px 10px ${C.shadow}`,
          }}
        >
          Batal
        </button>
      </div>
    </div>
  );
}

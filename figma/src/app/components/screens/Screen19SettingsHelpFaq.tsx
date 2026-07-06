import { useState } from 'react';
import { ChevronDown, Mail } from 'lucide-react';
import { C, FONT } from '../colors';
import { NavHeader, SafeAreaTop } from '../ui/ScreenChrome';

const FAQ_ITEMS = [
  {
    q: 'Bagaimana cara membuat perjalanan?',
    a: 'Tap tombol + di tengah tab bar, isi nama perjalanan dan kandidat tanggal, lalu tap Buat Perjalanan. Setelah itu kamu bisa undang teman atau lewati dulu.',
  },
  {
    q: 'Apa itu voting tanggal?',
    a: 'Semua anggota trip memilih tanggal yang cocok. Setelah voting selesai, tanggal pemenang dikunci dan bisa disinkronkan ke kalender.',
  },
  {
    q: 'Bagaimana cara mengundang teman?',
    a: 'Setelah buat perjalanan, atau dari detail perjalanan → tap ikon undang di header → cari username teman. Mereka akan melihat undangan di tab Undangan di Beranda.',
  },
  {
    q: 'Siapa yang bisa lihat perjalanan di profil?',
    a: 'Hanya perjalanan yang kamu tandai publik yang muncul di grid profil. Perjalanan privat hanya terlihat oleh kamu dan partisipan trip.',
  },
  {
    q: 'Bagaimana menghapus akun?',
    a: 'Buka Pengaturan → Hapus Akun. Kamu juga bisa mengajukan penghapusan lewat situs web kami.',
  },
];

export function Screen19SettingsHelpFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
      <NavHeader title="Bantuan & FAQ" onLight={false} border={false} />

      <div style={{ flex: 1, padding: '8px 22px 0', overflow: 'auto' }}>
        <div
          style={{
            backgroundColor: C.white,
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: `0 3px 16px ${C.shadow}`,
            marginBottom: 16,
          }}
        >
          {FAQ_ITEMS.map((item, idx) => {
            const open = openIndex === idx;
            const isLast = idx === FAQ_ITEMS.length - 1;
            return (
              <div key={item.q} style={{ borderBottom: isLast ? 'none' : `1px solid ${C.border}` }}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : idx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '15px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: FONT,
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, lineHeight: 1.4, flex: 1 }}>
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    color={C.muted}
                    strokeWidth={2.5}
                    style={{
                      flexShrink: 0,
                      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>
                {open && (
                  <p
                    style={{
                      fontSize: 13,
                      color: C.muted,
                      margin: 0,
                      padding: '0 16px 16px',
                      lineHeight: 1.65,
                      fontWeight: 500,
                    }}
                  >
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div
          style={{
            backgroundColor: C.white,
            borderRadius: 18,
            padding: '16px',
            boxShadow: `0 3px 16px ${C.shadow}`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              backgroundColor: C.tealLight,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Mail size={18} color={C.teal} strokeWidth={2} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, margin: '0 0 2px' }}>Masih butuh bantuan?</p>
            <p style={{ fontSize: 12, color: C.teal, margin: 0, fontWeight: 600 }}>bantuan@aturperjalanan.id</p>
          </div>
        </div>
      </div>
    </div>
  );
}

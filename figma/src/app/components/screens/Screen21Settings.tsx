import { ArrowLeft, Bell, Shield, HelpCircle, FileText, Info, ChevronRight, LogOut } from 'lucide-react';
import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';

const settingsGroups = [
  {
    title: 'Akun',
    items: [
      { icon: Bell, label: 'Notifikasi', sub: 'Push notification & reminder', color: C.coral },
      { icon: Shield, label: 'Privasi & Keamanan', sub: 'Pengaturan visibilitas akun', color: '#8B7CF6' },
    ],
  },
  {
    title: 'Dukungan',
    items: [
      { icon: HelpCircle, label: 'Bantuan & FAQ', sub: 'Panduan penggunaan aplikasi', color: '#60A5FA' },
      { icon: FileText, label: 'Syarat & Ketentuan', sub: 'Kebijakan layanan kami', color: C.teal },
      { icon: Info, label: 'Tentang Aplikasi', sub: 'Versi 2.4.1', color: C.muted },
    ],
  },
];

export function Screen21Settings() {
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
        position: 'relative',
      }}
    >
      <div style={{ height: 60 }} />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '4px 20px 18px',
          backgroundColor: C.light,
        }}
      >
        <div style={{ width: 36, height: 36, backgroundColor: C.white, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 2px 10px ${C.shadow}` }}>
          <ArrowLeft size={18} color={C.charcoal} strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.5 }}>
          Pengaturan
        </h1>
      </div>

      {/* Profile mini-card */}
      <div
        style={{
          margin: '0 20px 16px',
          backgroundColor: C.white,
          borderRadius: 18,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow: `0 3px 16px ${C.shadow}`,
        }}
      >
        <div
          style={{
            width: 48, height: 48,
            background: `linear-gradient(135deg, ${C.coral} 0%, #FF8E8E 100%)`,
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: 'white',
            boxShadow: `0 6px 18px ${C.coral}40`, flexShrink: 0,
          }}
        >
          B
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: C.charcoal, margin: 0 }}>Budi Santoso</p>
          <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>@budi_santoso · Edit Profil →</p>
        </div>
        <ChevronRight size={18} color={C.mutedLight} />
      </div>

      {/* Settings groups */}
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.2 }}>
              {group.title}
            </p>
            <div
              style={{
                backgroundColor: C.white,
                borderRadius: 18,
                overflow: 'hidden',
                boxShadow: `0 3px 16px ${C.shadow}`,
              }}
            >
              {group.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 16px',
                      cursor: 'pointer',
                      borderBottom: idx < group.items.length - 1 ? `1px solid ${C.border}` : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 38, height: 38,
                        backgroundColor: `${item.color}18`,
                        borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={17} color={item.color} strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, margin: '0 0 1px' }}>{item.label}</p>
                      <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>{item.sub}</p>
                    </div>
                    <ChevronRight size={16} color={C.mutedLight} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div
          style={{
            backgroundColor: C.white,
            borderRadius: 18,
            boxShadow: `0 3px 16px ${C.shadow}`,
            overflow: 'hidden',
          }}
        >
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: FONT,
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 38, height: 38,
                backgroundColor: '#FFF0F0',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <LogOut size={17} color={C.coral} strokeWidth={2} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.coral, margin: 0 }}>Keluar (Logout)</p>
              <p style={{ fontSize: 11, color: `${C.coral}80`, margin: '1px 0 0', fontWeight: 500 }}>
                Kamu akan keluar dari akun ini
              </p>
            </div>
            <ChevronRight size={16} color={`${C.coral}80`} />
          </button>
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}

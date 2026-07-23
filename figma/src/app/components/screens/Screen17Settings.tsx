import { HelpCircle, FileText, ChevronRight, LogOut, UserX } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { C, FONT } from '../colors';
import { PageHeader, SafeAreaTop } from '../ui/ScreenChrome';

type SettingsItem = {
  icon: LucideIcon;
  label: string;
  sub: string;
  color: string;
};

const legalItems: SettingsItem[] = [
  { icon: HelpCircle, label: 'Bantuan & FAQ', sub: 'Panduan & pertanyaan umum', color: '#60A5FA' },
  { icon: FileText, label: 'Kebijakan Privasi', sub: 'Cara kami mengelola datamu', color: C.teal },
  {
    icon: FileText,
    label: 'Syarat & Ketentuan',
    sub: 'Ketentuan penggunaan layanan',
    color: '#8B7CF6',
  },
];

function SettingsRow({ item, isLast }: { item: SettingsItem; isLast?: boolean }) {
  const Icon = item.icon;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 16px',
        cursor: 'pointer',
        borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          backgroundColor: `${item.color}18`,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={17} color={item.color} strokeWidth={2} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.charcoal, margin: '0 0 1px' }}>
          {item.label}
        </p>
        <p style={{ fontSize: 11, color: C.muted, margin: 0, fontWeight: 500 }}>{item.sub}</p>
      </div>
      <ChevronRight size={16} color={C.mutedLight} />
    </div>
  );
}

export function Screen17Settings() {
  const deleteItem: SettingsItem = {
    icon: UserX,
    label: 'Hapus Akun',
    sub: 'Hapus akun dan data secara permanen',
    color: C.muted,
  };

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
      <PageHeader title="Pengaturan" background={C.light} />

      <div
        style={{
          margin: '0 22px 16px',
          backgroundColor: C.white,
          borderRadius: 18,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow: `0 3px 16px ${C.shadow}`,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            background: `linear-gradient(135deg, ${C.coral} 0%, #FF8E8E 100%)`,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 800,
            color: 'white',
            boxShadow: `0 6px 18px ${C.coral}40`,
            flexShrink: 0,
          }}
        >
          B
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: C.charcoal, margin: 0 }}>
            Budi Santoso
          </p>
          <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0', fontWeight: 500 }}>
            @budi_santoso
          </p>
        </div>
        <ChevronRight size={18} color={C.mutedLight} />
      </div>

      <div
        style={{
          flex: 1,
          padding: '0 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflow: 'auto',
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.muted,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
            }}
          >
            Bantuan & Legal
          </p>
          <div
            style={{
              backgroundColor: C.white,
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: `0 3px 16px ${C.shadow}`,
            }}
          >
            {legalItems.map((item, idx) => (
              <SettingsRow key={item.label} item={item} isLast={idx === legalItems.length - 1} />
            ))}
          </div>
        </div>

        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.muted,
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
            }}
          >
            Akun
          </p>
          <div
            style={{
              backgroundColor: C.white,
              borderRadius: 18,
              overflow: 'hidden',
              boxShadow: `0 3px 16px ${C.shadow}`,
            }}
          >
            <SettingsRow item={deleteItem} isLast />
          </div>
        </div>

        <div
          style={{
            backgroundColor: C.white,
            borderRadius: 18,
            boxShadow: `0 3px 16px ${C.shadow}`,
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
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
                width: 38,
                height: 38,
                backgroundColor: C.coralLight,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <LogOut size={17} color={C.coral} strokeWidth={2} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.coral, margin: 0 }}>Keluar</p>
              <p
                style={{ fontSize: 11, color: `${C.coral}99`, margin: '1px 0 0', fontWeight: 500 }}
              >
                Keluar dari akun di perangkat ini
              </p>
            </div>
            <ChevronRight size={16} color={`${C.coral}80`} />
          </button>
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: 11,
            color: C.mutedLight,
            margin: '4px 0 12px',
            fontWeight: 500,
          }}
        >
          Atur Perjalanan · v2.4.1
        </p>
      </div>
    </div>
  );
}

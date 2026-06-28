import { CheckCircle, WifiOff, Loader, X, RefreshCw, Info } from 'lucide-react';
import { C, FONT } from '../colors';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  submessage?: string;
  action?: string;
  icon: React.ReactNode;
}

function ToastCard({ type, message, submessage, action, icon }: ToastProps) {
  const bg =
    type === 'success' ? C.teal :
    type === 'error'   ? C.coral :
    C.charcoal;

  return (
    <div
      style={{
        backgroundColor: bg,
        borderRadius: 18,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        boxShadow:
          type === 'success' ? `0 12px 32px ${C.teal}55` :
          type === 'error'   ? `0 12px 32px ${C.coral}55` :
          '0 12px 32px rgba(26,26,46,0.40)',
      }}
    >
      {/* Icon */}
      <div style={{ flexShrink: 0, marginTop: 1 }}>{icon}</div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
          {message}
        </p>
        {submessage && (
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, margin: '3px 0 0', fontWeight: 500, lineHeight: 1.4 }}>
            {submessage}
          </p>
        )}
        {action && (
          <button
            style={{
              marginTop: 8,
              backgroundColor: 'rgba(255,255,255,0.22)',
              border: '1.5px solid rgba(255,255,255,0.35)',
              color: 'white',
              fontSize: 12,
              fontWeight: 700,
              padding: '5px 12px',
              borderRadius: 8,
              cursor: 'pointer',
              fontFamily: FONT,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <RefreshCw size={11} strokeWidth={2.5} />
            {action}
          </button>
        )}
      </div>

      {/* Dismiss */}
      <button
        style={{
          width: 24, height: 24,
          backgroundColor: 'rgba(255,255,255,0.18)',
          borderRadius: 8,
          border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}
      >
        <X size={12} color="white" strokeWidth={2.5} />
      </button>
    </div>
  );
}

const toasts: ToastProps[] = [
  {
    type: 'success',
    message: 'Tautan berhasil disalin ✔',
    submessage: 'Siap untuk dibagikan ke teman-teman!',
    icon: <CheckCircle size={20} color="white" strokeWidth={2.5} />,
  },
  {
    type: 'error',
    message: 'Koneksi terputus. Coba lagi.',
    submessage: 'Tidak dapat terhubung ke server.',
    action: 'Coba Lagi',
    icon: <WifiOff size={20} color="white" strokeWidth={2.5} />,
  },
  {
    type: 'info',
    message: 'Menyimpan perubahan...',
    submessage: 'Harap tunggu sebentar.',
    icon: <Loader size={20} color="white" strokeWidth={2.5} />,
  },
];

const labels = [
  { label: 'Sukses', color: C.teal, dot: C.teal },
  { label: 'Error', color: C.coral, dot: C.coral },
  { label: 'Info', color: C.charcoal, dot: C.charcoal },
];

export function Screen23ToastComponents() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F7F6F2',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ height: 60 }} />

      {/* Screen header */}
      <div style={{ padding: '8px 22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div
            style={{
              width: 7, height: 7,
              backgroundColor: C.coral,
              borderRadius: '50%',
            }}
          />
          <p style={{ fontSize: 10, fontWeight: 700, color: C.muted, margin: 0, textTransform: 'uppercase', letterSpacing: 1.8 }}>
            Komponen UI
          </p>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.4 }}>
          Toast & Snackbar
        </h2>
        <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0', fontWeight: 500 }}>
          3 variasi notifikasi sistem
        </p>
      </div>

      {/* Toast components */}
      <div style={{ flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {toasts.map((toast, i) => (
          <div key={i}>
            {/* Type label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <div style={{ width: 7, height: 7, backgroundColor: labels[i].color, borderRadius: '50%' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: labels[i].color, textTransform: 'uppercase', letterSpacing: 1 }}>
                {labels[i].label}
              </span>
            </div>
            <ToastCard {...toast} />
          </div>
        ))}

        {/* Usage note */}
        <div
          style={{
            backgroundColor: C.white,
            borderRadius: 16,
            padding: '14px 16px',
            border: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <Info size={15} color={C.muted} style={{ flexShrink: 0, marginTop: 1 }} strokeWidth={2} />
          <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
            Toast muncul dari bawah layar selama <span style={{ fontWeight: 700, color: C.charcoal }}>3 detik</span> lalu otomatis hilang. Tap [✕] untuk tutup.
          </p>
        </div>
      </div>
    </div>
  );
}

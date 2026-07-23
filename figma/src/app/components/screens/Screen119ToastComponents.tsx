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
  const isInfo = type === 'info';

  const bg = type === 'success' ? C.teal : type === 'error' ? C.coral : C.white;

  const shadow =
    type === 'success'
      ? `0 12px 32px ${C.teal}55`
      : type === 'error'
        ? `0 12px 32px ${C.coral}55`
        : `0 8px 24px ${C.shadow}`;

  const titleColor = isInfo ? C.charcoal : 'white';
  const subColor = isInfo ? C.muted : 'rgba(255,255,255,0.75)';

  return (
    <div
      style={{
        backgroundColor: bg,
        borderRadius: 18,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        boxShadow: shadow,
        border: isInfo ? `1.5px solid ${C.border}` : 'none',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: 1 }}>{icon}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: titleColor, fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
          {message}
        </p>
        {submessage && (
          <p
            style={{
              color: subColor,
              fontSize: 12,
              margin: '3px 0 0',
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            {submessage}
          </p>
        )}
        {action && (
          <button
            type="button"
            style={{
              marginTop: 8,
              backgroundColor: isInfo ? C.coralLight : 'rgba(255,255,255,0.22)',
              border: isInfo ? `1.5px solid ${C.coral}30` : '1.5px solid rgba(255,255,255,0.35)',
              color: isInfo ? C.coral : 'white',
              fontSize: 12,
              fontWeight: 700,
              padding: '5px 12px',
              borderRadius: 8,
              cursor: 'pointer',
              fontFamily: FONT,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <RefreshCw size={11} strokeWidth={2.5} />
            {action}
          </button>
        )}
      </div>

      <button
        type="button"
        style={{
          width: 24,
          height: 24,
          backgroundColor: isInfo ? C.light : 'rgba(255,255,255,0.18)',
          borderRadius: 8,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <X size={12} color={isInfo ? C.muted : 'white'} strokeWidth={2.5} />
      </button>
    </div>
  );
}

const toasts: ToastProps[] = [
  {
    type: 'success',
    message: 'Perjalanan berhasil dibuat',
    submessage: 'Kamu bisa mulai undang teman sekarang.',
    icon: <CheckCircle size={20} color="white" strokeWidth={2.5} />,
  },
  {
    type: 'error',
    message: 'Koneksi terputus',
    submessage: 'Tidak dapat terhubung ke server.',
    action: 'Coba Lagi',
    icon: <WifiOff size={20} color="white" strokeWidth={2.5} />,
  },
  {
    type: 'info',
    message: 'Menyimpan perubahan...',
    submessage: 'Harap tunggu sebentar.',
    icon: <Loader size={20} color={C.teal} strokeWidth={2.5} />,
  },
];

const labels = [
  { label: 'Sukses', color: C.teal },
  { label: 'Error', color: C.coral },
  { label: 'Info', color: C.teal },
];

export function Screen119ToastComponents() {
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
      <div style={{ height: 60, flexShrink: 0 }} />

      <div style={{ padding: '8px 22px 20px', flexShrink: 0 }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.muted,
            margin: '0 0 4px',
            textTransform: 'uppercase',
            letterSpacing: 1.6,
          }}
        >
          Komponen UI
        </p>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: C.charcoal,
            margin: 0,
            letterSpacing: -0.4,
          }}
        >
          Toast & Snackbar
        </h2>
        <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0', fontWeight: 500 }}>
          Sukses · Error · Info
        </p>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: '0 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          overflowY: 'auto',
        }}
      >
        {toasts.map((toast, i) => (
          <div key={toast.type}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <div
                style={{
                  width: 7,
                  height: 7,
                  backgroundColor: labels[i].color,
                  borderRadius: '50%',
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: labels[i].color,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {labels[i].label}
              </span>
            </div>
            <ToastCard {...toast} />
          </div>
        ))}

        <div
          style={{
            backgroundColor: C.white,
            borderRadius: 14,
            padding: '12px 14px',
            border: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <Info
            size={15}
            color={C.teal}
            style={{ flexShrink: 0, marginTop: 1 }}
            strokeWidth={2.5}
          />
          <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
            Toast muncul dari bawah selama{' '}
            <span style={{ fontWeight: 700, color: C.charcoal }}>3 detik</span>, atau tutup manual.
          </p>
        </div>
      </div>
    </div>
  );
}

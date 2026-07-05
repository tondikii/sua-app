import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { C, FONT } from '../colors';

/** Token destructive — sumber tunggal dari C.danger */
export const DESTRUCTIVE = {
  text: C.white,
  bg: C.danger,
  border: C.dangerDark,
  softText: C.danger,
  softBg: C.dangerLight,
  softBorder: C.dangerBorder,
};

type ConfirmDialogModalProps = {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  onConfirmAccent?: string;
};

/** Modal konfirmasi reusable — layout simetris & centered */
export function ConfirmDialogModal({
  title,
  description,
  icon,
  confirmLabel,
  cancelLabel = 'Batal',
  variant = 'default',
  onConfirmAccent = C.coral,
}: ConfirmDialogModalProps) {
  const isDestructive = variant === 'destructive';

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 52px)',
        maxWidth: 300,
        backgroundColor: C.white,
        borderRadius: 20,
        padding: '22px 20px 20px',
        zIndex: 20,
        boxShadow: '0 20px 56px rgba(0,0,0,0.24)',
        fontFamily: FONT,
        textAlign: 'center',
      }}
    >
      <button
        type="button"
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 28,
          height: 28,
          backgroundColor: C.light,
          border: 'none',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <X size={13} color={C.muted} strokeWidth={2.5} />
      </button>

      {icon && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>{icon}</div>}

      <h2
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: C.charcoal,
          margin: '0 0 8px',
          letterSpacing: -0.2,
          lineHeight: 1.35,
          paddingRight: 20,
          paddingLeft: 20,
        }}
      >
        {title}
      </h2>

      {description && (
        <div
          style={{
            fontSize: 12,
            color: C.muted,
            margin: '0 0 20px',
            lineHeight: 1.55,
            fontWeight: 500,
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          {description}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          style={{
            flex: 1,
            height: 44,
            backgroundColor: C.white,
            color: C.charcoal,
            border: `1.5px solid ${C.border}`,
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: FONT,
          }}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          style={{
            flex: 1,
            height: 44,
            backgroundColor: isDestructive ? DESTRUCTIVE.bg : onConfirmAccent,
            color: isDestructive ? DESTRUCTIVE.text : 'white',
            border: isDestructive ? `1.5px solid ${DESTRUCTIVE.border}` : 'none',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: FONT,
            boxShadow: isDestructive ? `0 6px 16px ${DESTRUCTIVE.bg}35` : `0 6px 18px ${onConfirmAccent}40`,
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

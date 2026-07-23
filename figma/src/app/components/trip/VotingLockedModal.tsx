import { X } from 'lucide-react';
import { C, FONT } from '../colors';
import { VOTING_TYPE_META, type VotingType } from './VotingParts';

type VotingLockedModalProps = {
  type: VotingType;
  /** Judul voting yang user buat — bukan label jenis */
  title: string;
  resultValue: string;
  hint?: string;
};

/** Modal — voting selesai / dikunci (minimal) */
export function VotingLockedModal({ type, title, resultValue, hint = '' }: VotingLockedModalProps) {
  const meta = VOTING_TYPE_META[type];
  const Icon = meta.icon;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 52px)',
        maxWidth: 288,
        backgroundColor: C.white,
        borderRadius: 20,
        padding: '18px 18px 16px',
        zIndex: 20,
        boxShadow: '0 20px 56px rgba(0,0,0,0.24)',
        fontFamily: FONT,
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

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
          paddingRight: 28,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            backgroundColor: meta.bg,
            color: meta.color,
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 20,
            flexShrink: 0,
          }}
        >
          <Icon size={10} strokeWidth={2.5} />
          {meta.label}
        </span>
      </div>

      <h2
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: C.charcoal,
          margin: '0 0 12px',
          letterSpacing: -0.2,
          lineHeight: 1.35,
          paddingRight: 8,
        }}
      >
        Voting {title} Selesai
      </h2>

      <div
        style={{
          backgroundColor: C.light,
          borderRadius: 12,
          padding: '11px 13px',
          marginBottom: 10,
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.muted,
            margin: '0 0 3px',
            letterSpacing: 0.4,
          }}
        >
          Hasil dipilih
        </p>
        <p
          style={{ fontSize: 14, fontWeight: 800, color: C.charcoal, margin: 0, lineHeight: 1.35 }}
        >
          {resultValue}
        </p>
      </div>

      <p
        style={{
          fontSize: 11,
          color: C.muted,
          margin: '0 0 14px',
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        {hint}
      </p>

      <button
        type="button"
        style={{
          width: '100%',
          height: 42,
          backgroundColor: C.coral,
          color: 'white',
          border: 'none',
          borderRadius: 12,
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: FONT,
        }}
      >
        Oke
      </button>
    </div>
  );
}

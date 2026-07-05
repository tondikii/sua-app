import { C, FONT } from '../colors';

export type AddCandidateButtonProps = {
  /** Teks setelah "+" — contoh: "Tambah kandidat" atau "Tambah Kandidat Tanggal" */
  label?: string;
  compact?: boolean;
  /** Coral dashed — saat sedang memilih / menambah kandidat aktif */
  highlighted?: boolean;
};

/**
 * Tombol tambah kandidat — gaya konsisten di seluruh app.
 * neutral: dashed abu (idle) · highlighted: dashed coral (mode pilih aktif)
 */
export function AddCandidateButton({
  label = 'Tambah kandidat',
  compact = false,
  highlighted = false,
}: AddCandidateButtonProps) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        height: compact ? 44 : 46,
        backgroundColor: highlighted ? C.coralLight : 'transparent',
        border: highlighted ? `2px dashed ${C.coral}` : `2px dashed ${C.border}`,
        borderRadius: compact ? 12 : 14,
        fontSize: compact ? 12 : 14,
        fontWeight: highlighted ? 700 : 600,
        color: highlighted ? C.coral : C.muted,
        cursor: 'pointer',
        marginTop: compact ? 0 : 12,
        fontFamily: FONT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      + {label}
    </button>
  );
}

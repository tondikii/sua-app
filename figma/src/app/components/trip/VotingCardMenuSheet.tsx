import { Pencil, Trash2, CircleStop } from 'lucide-react';
import { C, FONT } from '../colors';
import { DESTRUCTIVE } from '../ui/ConfirmDialogModal';

type VotingCardMenuSheetProps = {
  /** aktif = edit/akhiri/hapus · selesai = hapus saja */
  variant?: 'active' | 'ended';
};

/** Menu ⋮ pada card voting collapse */
export function VotingCardMenuSheet({ variant = 'active' }: VotingCardMenuSheetProps) {
  const isEnded = variant === 'ended';

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 4,
        width: 176,
        backgroundColor: C.white,
        borderRadius: 12,
        padding: '4px 0',
        zIndex: 30,
        boxShadow: `0 10px 32px ${C.shadow}, 0 0 0 1px ${C.border}`,
        fontFamily: FONT,
      }}
    >
      {!isEnded && (
        <>
          <button
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '11px 14px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: FONT,
              textAlign: 'left',
            }}
          >
            <Pencil size={15} color={C.charcoal} strokeWidth={2.5} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>Edit</span>
          </button>
          <button
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '11px 14px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: FONT,
              textAlign: 'left',
            }}
          >
            <CircleStop size={15} color={C.coral} strokeWidth={2.5} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.coral }}>Akhiri Voting</span>
          </button>
        </>
      )}
      <button
        type="button"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '11px 14px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontFamily: FONT,
          textAlign: 'left',
        }}
      >
        <Trash2 size={15} color={DESTRUCTIVE.softText} strokeWidth={2.5} />
        <span style={{ fontSize: 13, fontWeight: 600, color: DESTRUCTIVE.softText }}>Hapus</span>
      </button>
    </div>
  );
}

import { Trash2 } from 'lucide-react';
import { C } from '../colors';
import { ConfirmDialogModal, DESTRUCTIVE } from '../ui/ConfirmDialogModal';
import { ITINERARY_VOTING_TITLE } from './ItineraryParts';

type VotingDeleteModalProps = {
  votingTitle?: string;
};

export function VotingDeleteModal({ votingTitle = ITINERARY_VOTING_TITLE }: VotingDeleteModalProps) {
  return (
    <ConfirmDialogModal
      variant="destructive"
      title="Hapus voting?"
      description={
        <>
          Voting <strong style={{ color: C.charcoal }}>{votingTitle}</strong> akan dihapus.
        </>
      }
      icon={
        <div
          style={{
            width: 48,
            height: 48,
            backgroundColor: DESTRUCTIVE.softBg,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Trash2 size={22} color={DESTRUCTIVE.softText} strokeWidth={2.5} />
        </div>
      }
      confirmLabel="Hapus"
    />
  );
}

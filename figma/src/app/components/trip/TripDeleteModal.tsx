import { Trash2 } from 'lucide-react';
import { C } from '../colors';
import { ConfirmDialogModal, DESTRUCTIVE } from '../ui/ConfirmDialogModal';

type TripDeleteModalProps = {
  tripName?: string;
};

export function TripDeleteModal({ tripName = 'Lombok Weekend Escape' }: TripDeleteModalProps) {
  return (
    <ConfirmDialogModal
      variant="destructive"
      title="Hapus perjalanan?"
      description={
        <>
          <strong style={{ color: C.charcoal }}>{tripName}</strong> dan semua datanya akan dihapus permanen.
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

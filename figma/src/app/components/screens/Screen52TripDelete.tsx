import { TripDetailBackdrop } from '../trip/TripDetailBackdrop';
import { TripDeleteModal } from '../trip/TripDeleteModal';

/** Modal — konfirmasi hapus perjalanan (via menu ⋮) */
export function Screen52TripDelete() {
  return (
    <TripDetailBackdrop menuHighlightId="delete">
      <TripDeleteModal />
    </TripDetailBackdrop>
  );
}

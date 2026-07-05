import { TripDetailBackdrop } from '../trip/TripDetailBackdrop';
import { CalendarEventModal } from '../trip/CalendarEventParts';

/** Modal — tambah ke Google Calendar (via menu ⋮) */
export function Screen22CalendarSyncModal() {
  return (
    <TripDetailBackdrop menuHighlightId="calendar">
      <CalendarEventModal />
    </TripDetailBackdrop>
  );
}

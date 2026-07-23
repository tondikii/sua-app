import { CalendarDays } from 'lucide-react';
import { C } from '../colors';
import { TRIP_LOCKED_DATES } from './CreateTripParts';
import { ConfirmDialogModal } from '../ui/ConfirmDialogModal';

type CalendarEventModalProps = {
  dateLabel?: string;
};

/** Modal tambah event ke Google Calendar — hanya kalender pengguna sendiri */
export function CalendarEventModal({
  dateLabel = TRIP_LOCKED_DATES.subtitle,
}: CalendarEventModalProps) {
  return (
    <ConfirmDialogModal
      title="Tambah ke Google Calendar?"
      description={<>{dateLabel} · kalender kamu</>}
      icon={
        <div
          style={{
            width: 48,
            height: 48,
            backgroundColor: C.tealLight,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CalendarDays size={24} color={C.teal} strokeWidth={2} />
        </div>
      }
      confirmLabel="Tambah"
      onConfirmAccent={C.coral}
    />
  );
}

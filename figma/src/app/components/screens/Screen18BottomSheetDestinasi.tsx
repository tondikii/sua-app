import { FONT } from '../colors';
import {
  ActivityFormSheet,
  ActivitySheetBackdrop,
  DEMO_ACTIVITY_NEW,
} from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_PENDING } from '../trip/ActivitySheetBackdropPresets';

/** Sheet tambah aktivitas — form awal */
export function Screen18BottomSheetDestinasi() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <ActivitySheetBackdrop {...ACTIVITY_BACKDROP_PENDING} />
      <ActivityFormSheet title="Tambah Aktivitas" activity={DEMO_ACTIVITY_NEW} mode="add" />
    </div>
  );
}

import { ActivityFormSheet, ActivitySheetScreen, DEMO_ACTIVITY_NEW } from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_PENDING } from '../trip/ActivitySheetBackdropPresets';

/** Sheet tambah aktivitas — form awal */
export function Screen45BottomSheetDestinasi() {
  return (
    <ActivitySheetScreen backdrop={ACTIVITY_BACKDROP_PENDING}>
      <ActivityFormSheet title="Tambah Aktivitas" activity={DEMO_ACTIVITY_NEW} mode="add" />
    </ActivitySheetScreen>
  );
}

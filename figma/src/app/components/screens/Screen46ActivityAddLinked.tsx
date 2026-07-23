import {
  ActivityFormSheet,
  ActivitySheetScreen,
  DEMO_ACTIVITY_MAPS_LINKED_ADD,
} from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_FIXED } from '../trip/ActivitySheetBackdropPresets';

/** Sheet tambah aktivitas — Maps terhubung, cover otomatis */
export function Screen46ActivityAddLinked() {
  return (
    <ActivitySheetScreen backdrop={ACTIVITY_BACKDROP_FIXED}>
      <ActivityFormSheet
        title="Tambah Aktivitas"
        activity={DEMO_ACTIVITY_MAPS_LINKED_ADD}
        mode="add"
      />
    </ActivitySheetScreen>
  );
}

import {
  ActivityFormSheet,
  ActivitySheetScreen,
  DEMO_ACTIVITY_MAPS_NO_THUMB,
} from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_PENDING } from '../trip/ActivitySheetBackdropPresets';

/** Sheet tambah aktivitas — Maps tanpa thumbnail */
export function Screen47ActivityMapsNoThumb() {
  return (
    <ActivitySheetScreen backdrop={ACTIVITY_BACKDROP_PENDING}>
      <ActivityFormSheet
        title="Tambah Aktivitas"
        activity={DEMO_ACTIVITY_MAPS_NO_THUMB}
        mode="add"
      />
    </ActivitySheetScreen>
  );
}

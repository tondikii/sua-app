import {
  ActivityFormSheet,
  ActivitySheetScreen,
  DEMO_ACTIVITY_WITH_MAPS_COVER,
} from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_FIXED } from '../trip/ActivitySheetBackdropPresets';

/** Sheet edit aktivitas */
export function Screen54ActivityEdit() {
  return (
    <ActivitySheetScreen backdrop={ACTIVITY_BACKDROP_FIXED}>
      <ActivityFormSheet
        title="Edit Aktivitas"
        activity={DEMO_ACTIVITY_WITH_MAPS_COVER}
        mode="edit"
      />
    </ActivitySheetScreen>
  );
}

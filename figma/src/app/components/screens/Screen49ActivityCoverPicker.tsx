import {
  ActivityCoverPickerSheet,
  ActivitySheetScreen,
  DEMO_ACTIVITY_MAPS_NO_THUMB,
} from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_PENDING } from '../trip/ActivitySheetBackdropPresets';

/** Sheet pilih cover — media perjalanan */
export function Screen49ActivityCoverPicker() {
  return (
    <ActivitySheetScreen backdrop={ACTIVITY_BACKDROP_PENDING}>
      <ActivityCoverPickerSheet activity={DEMO_ACTIVITY_MAPS_NO_THUMB} activeSection="trip_media" />
    </ActivitySheetScreen>
  );
}

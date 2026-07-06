import { ActivityCoverPickerSheet, ActivitySheetScreen, DEMO_ACTIVITY_MAPS_NO_THUMB } from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_PENDING } from '../trip/ActivitySheetBackdropPresets';

/** Sheet pilih cover — tab icon */
export function Screen50ActivityCoverIconPicker() {
  return (
    <ActivitySheetScreen backdrop={ACTIVITY_BACKDROP_PENDING}>
      <ActivityCoverPickerSheet activity={DEMO_ACTIVITY_MAPS_NO_THUMB} activeSection="icon" selectedIcon="bus" />
    </ActivitySheetScreen>
  );
}

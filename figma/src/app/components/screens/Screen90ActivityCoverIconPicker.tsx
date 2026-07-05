import { FONT } from '../colors';
import { ActivityCoverPickerSheet, ActivitySheetBackdrop, DEMO_ACTIVITY_MAPS_NO_THUMB } from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_PENDING } from '../trip/ActivitySheetBackdropPresets';

/** Sheet pilih cover — tab icon */
export function Screen90ActivityCoverIconPicker() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <ActivitySheetBackdrop {...ACTIVITY_BACKDROP_PENDING} />
      <ActivityCoverPickerSheet activity={DEMO_ACTIVITY_MAPS_NO_THUMB} activeSection="icon" selectedIcon="bus" />
    </div>
  );
}

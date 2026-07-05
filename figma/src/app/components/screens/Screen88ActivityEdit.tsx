import { FONT } from '../colors';
import {
  ActivityFormSheet,
  ActivitySheetBackdrop,
  DEMO_ACTIVITY_WITH_MAPS_COVER,
} from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_FIXED } from '../trip/ActivitySheetBackdropPresets';

/** Sheet edit aktivitas */
export function Screen88ActivityEdit() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <ActivitySheetBackdrop {...ACTIVITY_BACKDROP_FIXED} />
      <ActivityFormSheet title="Edit Aktivitas" activity={DEMO_ACTIVITY_WITH_MAPS_COVER} mode="edit" />
    </div>
  );
}

import { FONT } from '../colors';
import {
  ActivityDetailSheet,
  ActivitySheetBackdrop,
  DEMO_ACTIVITY_ICON_COVER,
} from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_FIXED } from '../trip/ActivitySheetBackdropPresets';

/** Detail aktivitas — cover icon */
export function Screen87ActivityDetailNoCover() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <ActivitySheetBackdrop {...ACTIVITY_BACKDROP_FIXED} />
      <ActivityDetailSheet activity={DEMO_ACTIVITY_ICON_COVER} />
    </div>
  );
}

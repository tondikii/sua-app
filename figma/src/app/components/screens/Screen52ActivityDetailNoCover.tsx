import {
  ActivityDetailSheet,
  ActivitySheetScreen,
  DEMO_ACTIVITY_ICON_COVER,
} from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_FIXED } from '../trip/ActivitySheetBackdropPresets';

/** Detail aktivitas — cover icon */
export function Screen52ActivityDetailNoCover() {
  return (
    <ActivitySheetScreen backdrop={ACTIVITY_BACKDROP_FIXED}>
      <ActivityDetailSheet activity={DEMO_ACTIVITY_ICON_COVER} />
    </ActivitySheetScreen>
  );
}

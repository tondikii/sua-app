import {
  ActivityDetailSheet,
  ActivitySheetScreen,
  DEMO_ACTIVITY_NO_COVER,
} from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_FIXED } from '../trip/ActivitySheetBackdropPresets';

/** Detail aktivitas — tanpa cover */
export function Screen53ActivityDetailBare() {
  return (
    <ActivitySheetScreen backdrop={ACTIVITY_BACKDROP_FIXED}>
      <ActivityDetailSheet activity={DEMO_ACTIVITY_NO_COVER} />
    </ActivitySheetScreen>
  );
}

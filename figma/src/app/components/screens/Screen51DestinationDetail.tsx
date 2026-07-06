import {
  ActivityDetailSheet,
  ActivitySheetScreen,
  DEMO_ACTIVITY_WITH_MAPS_COVER,
} from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_FIXED } from '../trip/ActivitySheetBackdropPresets';

/** Detail aktivitas — cover foto dari Google Maps */
export function Screen51DestinationDetail() {
  return (
    <ActivitySheetScreen backdrop={ACTIVITY_BACKDROP_FIXED}>
      <ActivityDetailSheet activity={DEMO_ACTIVITY_WITH_MAPS_COVER} />
    </ActivitySheetScreen>
  );
}

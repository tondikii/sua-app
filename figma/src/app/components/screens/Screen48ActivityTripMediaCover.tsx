import {
  ActivityFormSheet,
  ActivitySheetScreen,
  DEMO_ACTIVITY_TRIP_MEDIA,
} from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_FIXED } from '../trip/ActivitySheetBackdropPresets';

/** Sheet tambah aktivitas — cover dari media perjalanan */
export function Screen48ActivityTripMediaCover() {
  return (
    <ActivitySheetScreen backdrop={ACTIVITY_BACKDROP_FIXED}>
      <ActivityFormSheet title="Tambah Aktivitas" activity={DEMO_ACTIVITY_TRIP_MEDIA} mode="add" />
    </ActivitySheetScreen>
  );
}

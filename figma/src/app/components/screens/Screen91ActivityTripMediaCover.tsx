import { FONT } from '../colors';
import {
  ActivityFormSheet,
  ActivitySheetBackdrop,
  DEMO_ACTIVITY_TRIP_MEDIA,
} from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_FIXED } from '../trip/ActivitySheetBackdropPresets';

/** Sheet tambah aktivitas — cover dari media perjalanan */
export function Screen91ActivityTripMediaCover() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <ActivitySheetBackdrop {...ACTIVITY_BACKDROP_FIXED} />
      <ActivityFormSheet title="Tambah Aktivitas" activity={DEMO_ACTIVITY_TRIP_MEDIA} mode="add" />
    </div>
  );
}

import { FONT } from '../colors';
import {
  ActivityFormSheet,
  ActivitySheetBackdrop,
  DEMO_ACTIVITY_MAPS_LINKED_ADD,
} from '../trip/ActivityParts';
import { ACTIVITY_BACKDROP_FIXED } from '../trip/ActivitySheetBackdropPresets';

/** Sheet tambah aktivitas — Maps terhubung, cover otomatis */
export function Screen85ActivityAddLinked() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <ActivitySheetBackdrop {...ACTIVITY_BACKDROP_FIXED} />
      <ActivityFormSheet title="Tambah Aktivitas" activity={DEMO_ACTIVITY_MAPS_LINKED_ADD} mode="add" />
    </div>
  );
}

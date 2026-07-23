import { FONT } from '../colors';
import { MediaTabBackdrop, MediaPhotoViewer } from '../trip/MediaViewerParts';

/** Viewer foto — tap thumbnail di tab Media */
export function Screen121MediaViewerPhoto() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: FONT,
      }}
    >
      <MediaTabBackdrop />
      <MediaPhotoViewer />
    </div>
  );
}

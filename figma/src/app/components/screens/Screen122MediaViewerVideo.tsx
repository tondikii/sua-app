import { FONT } from '../colors';
import { MediaTabBackdrop, MediaVideoViewer } from '../trip/MediaViewerParts';

/** Viewer video — tap thumbnail video di tab Media */
export function Screen122MediaViewerVideo() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <MediaTabBackdrop />
      <MediaVideoViewer />
    </div>
  );
}

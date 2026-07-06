import { FONT } from '../colors';
import { MediaTabBackdrop, MediaVideoViewer } from '../trip/MediaViewerParts';

/** Viewer video — state sedang diputar */
export function Screen123MediaViewerVideoPlaying() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <MediaTabBackdrop />
      <MediaVideoViewer playing />
    </div>
  );
}

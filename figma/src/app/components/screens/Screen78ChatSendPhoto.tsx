import { TRIP_IMAGES } from '../tripImages';
import { ChatComposerScreen, ChatMediaComposer } from '../trip/ChatParts';

/** Composer — kirim foto + caption (kosong) */
export function Screen78ChatSendPhoto() {
  return (
    <ChatComposerScreen>
      <ChatMediaComposer kind="photo" mediaUrl={TRIP_IMAGES.giliBeach} />
    </ChatComposerScreen>
  );
}

/** Composer — kirim foto + caption terisi */
export function Screen79ChatSendPhotoCaption() {
  return (
    <ChatComposerScreen>
      <ChatMediaComposer kind="photo" mediaUrl={TRIP_IMAGES.lombok} caption="Pantai pas low tide 🌊" />
    </ChatComposerScreen>
  );
}

/** Composer — kirim video + caption (kosong) */
export function Screen80ChatSendVideo() {
  return (
    <ChatComposerScreen>
      <ChatMediaComposer kind="video" mediaUrl={TRIP_IMAGES.bromo} mediaDuration="0:24" />
    </ChatComposerScreen>
  );
}

/** Composer — kirim video + caption terisi */
export function Screen81ChatSendVideoCaption() {
  return (
    <ChatComposerScreen>
      <ChatMediaComposer
        kind="video"
        mediaUrl={TRIP_IMAGES.bromo}
        mediaDuration="0:24"
        caption="Sunrise dari atas awan ☁️"
      />
    </ChatComposerScreen>
  );
}

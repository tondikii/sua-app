import { ChatThreadView, DEMO_CHAT_MESSAGES, DEMO_CHAT_PHOTO_RECEIVED } from '../trip/ChatParts';

/** Tab Chat — foto dari anggota lain */
export function Screen84ChatPhotoReceived() {
  return <ChatThreadView messages={[...DEMO_CHAT_MESSAGES.slice(0, 5), DEMO_CHAT_PHOTO_RECEIVED]} />;
}

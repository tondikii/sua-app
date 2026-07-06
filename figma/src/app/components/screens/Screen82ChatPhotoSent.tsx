import { ChatThreadView, DEMO_CHAT_MESSAGES, DEMO_CHAT_PHOTO_SENT } from '../trip/ChatParts';

/** Tab Chat — foto terkirim dengan caption */
export function Screen82ChatPhotoSent() {
  return <ChatThreadView messages={[...DEMO_CHAT_MESSAGES.slice(0, 5), DEMO_CHAT_PHOTO_SENT]} />;
}

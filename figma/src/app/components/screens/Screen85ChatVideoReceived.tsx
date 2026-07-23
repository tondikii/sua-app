import { ChatThreadView, DEMO_CHAT_MESSAGES, DEMO_CHAT_VIDEO_RECEIVED } from '../trip/ChatParts';

/** Tab Chat — video dari anggota lain */
export function Screen85ChatVideoReceived() {
  return (
    <ChatThreadView messages={[...DEMO_CHAT_MESSAGES.slice(0, 5), DEMO_CHAT_VIDEO_RECEIVED]} />
  );
}

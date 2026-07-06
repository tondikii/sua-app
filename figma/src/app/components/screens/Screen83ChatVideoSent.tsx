import { ChatThreadView, DEMO_CHAT_MESSAGES, DEMO_CHAT_VIDEO_SENT } from '../trip/ChatParts';

/** Tab Chat — video terkirim dengan caption */
export function Screen83ChatVideoSent() {
  return <ChatThreadView messages={[...DEMO_CHAT_MESSAGES.slice(0, 5), DEMO_CHAT_VIDEO_SENT]} />;
}

import { ChatThreadView, DEMO_CHAT_MESSAGES } from '../trip/ChatParts';

/** Tab Chat — menu lampiran foto/video terbuka */
export function Screen77ChatAttachMenu() {
  return <ChatThreadView messages={DEMO_CHAT_MESSAGES} attachMenuOpen />;
}

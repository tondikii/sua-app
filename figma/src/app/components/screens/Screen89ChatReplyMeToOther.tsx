import {
  ChatThreadView,
  DEMO_REPLY_ME_TO_OTHER,
  DEMO_REPLY_ME_TO_SELF,
  DEMO_REPLY_OTHER_TO_OTHER,
  DEMO_REPLY_OTHER_TO_ME,
} from '../trip/ChatParts';

/** Saya balas pesan anggota lain */
export function Screen89ChatReplyMeToOther() {
  return <ChatThreadView messages={DEMO_REPLY_ME_TO_OTHER} />;
}

/** Saya balas pesan sendiri */
export function Screen90ChatReplyMeToSelf() {
  return <ChatThreadView messages={DEMO_REPLY_ME_TO_SELF} />;
}

/** Anggota lain balas pesan anggota lain */
export function Screen91ChatReplyOtherToOther() {
  return <ChatThreadView messages={DEMO_REPLY_OTHER_TO_OTHER} />;
}

/** Anggota lain balas pesan saya */
export function Screen92ChatReplyOtherToMe() {
  return <ChatThreadView messages={DEMO_REPLY_OTHER_TO_ME} />;
}

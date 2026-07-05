import { AVATAR_COLORS } from '../colors';
import { TRIP_COUNTS_DATE_PENDING } from '../trip/TripDetailParts';
import { TRIP_DATE_PENDING } from '../trip/CreateTripParts';
import {
  TripDetailChatLayout,
  ChatDateSeparator,
  ChatMessageBubble,
  DEMO_CHAT_MESSAGES,
} from '../trip/ChatParts';

const messages = DEMO_CHAT_MESSAGES.slice(0, 6).map((m, i) => ({
  ...m,
  color: m.isMe ? AVATAR_COLORS[4] : AVATAR_COLORS[i % 4],
}));

/** Chat — menu lampiran foto/video terbuka */
export function Screen97ChatAttachMenu() {
  return (
    <TripDetailChatLayout subtitle={TRIP_DATE_PENDING} counts={TRIP_COUNTS_DATE_PENDING} attachMenuOpen>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '16px 16px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <ChatDateSeparator />
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} msg={msg} />
        ))}
      </div>
    </TripDetailChatLayout>
  );
}

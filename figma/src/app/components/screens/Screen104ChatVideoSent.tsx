import { AVATAR_COLORS } from '../colors';
import { TRIP_COUNTS_DATE_PENDING } from '../trip/TripDetailParts';
import { TRIP_DATE_PENDING } from '../trip/CreateTripParts';
import {
  TripDetailChatLayout,
  ChatDateSeparator,
  ChatMessageBubble,
  DEMO_CHAT_MESSAGES,
  DEMO_CHAT_VIDEO_SENT,
} from '../trip/ChatParts';

const messages = [...DEMO_CHAT_MESSAGES.slice(0, 5), DEMO_CHAT_VIDEO_SENT].map((m, i) => ({
  ...m,
  color: m.isMe ? AVATAR_COLORS[4] : AVATAR_COLORS[i % 4],
}));

/** Tab Chat — video terkirim dengan caption */
export function Screen104ChatVideoSent() {
  return (
    <TripDetailChatLayout subtitle={TRIP_DATE_PENDING} counts={TRIP_COUNTS_DATE_PENDING}>
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

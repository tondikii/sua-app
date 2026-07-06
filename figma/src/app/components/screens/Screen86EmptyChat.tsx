import { TRIP_DATE_PENDING } from '../trip/CreateTripParts';
import { TRIP_COUNTS_DATE_PENDING } from '../trip/TripDetailParts';
import { TripDetailChatLayout, ChatEmptyState } from '../trip/ChatParts';

const EMPTY_CHAT_COUNTS = { ...TRIP_COUNTS_DATE_PENDING, chat: 0 };

/** Tab Chat — empty state */
export function Screen86EmptyChat() {
  return (
    <TripDetailChatLayout subtitle={TRIP_DATE_PENDING} counts={EMPTY_CHAT_COUNTS} inputDisabled>
      <ChatEmptyState />
    </TripDetailChatLayout>
  );
}

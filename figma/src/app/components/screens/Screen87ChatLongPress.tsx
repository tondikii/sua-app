import { ChatLongPressView } from '../trip/ChatParts';

/** Long press pesan orang lain — tanpa Hapus */
export function Screen87ChatLongPress() {
  return <ChatLongPressView highlightedId={4} />;
}

/** Long press pesan sendiri — dengan Hapus */
export function Screen88ChatLongPressOwn() {
  return <ChatLongPressView highlightedId={5} />;
}

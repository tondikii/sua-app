import { InvitePrimaryButton, InviteShell } from '../trip/InviteParts';

/** Langkah awal setelah tap "Buat Perjalanan" — cari teman untuk diundang */
export function Screen35BottomSheetUndang() {
  return (
    <InviteShell
      searchPlaceholder="Cari username / email..."
      footer={<InvitePrimaryButton label="Masuk ke Perjalanan" />}
    />
  );
}

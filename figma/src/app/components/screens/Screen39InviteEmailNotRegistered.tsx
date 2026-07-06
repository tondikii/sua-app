import {
  EXAMPLE_INVITE_EMAIL,
  EmailInviteSearchResult,
  InvitePrimaryButton,
  InviteShell,
} from '../trip/InviteParts';

/** Undang — cari email belum terdaftar di aplikasi */
export function Screen39InviteEmailNotRegistered() {
  return (
    <InviteShell searchValue={EXAMPLE_INVITE_EMAIL} footer={<InvitePrimaryButton label="Masuk ke Perjalanan" />}>
      <EmailInviteSearchResult email={EXAMPLE_INVITE_EMAIL} />
    </InviteShell>
  );
}

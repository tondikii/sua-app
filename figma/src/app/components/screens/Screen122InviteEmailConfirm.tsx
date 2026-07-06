import {
  EXAMPLE_INVITE_EMAIL,
  EmailInviteConfirmCard,
  InvitePrimaryButton,
  InviteShell,
} from '../trip/InviteParts';

/** Undang — konfirmasi kirim undangan email */
export function Screen122InviteEmailConfirm() {
  return (
    <InviteShell searchValue={EXAMPLE_INVITE_EMAIL} footer={<InvitePrimaryButton label="Lewati dulu" />}>
      <EmailInviteConfirmCard email={EXAMPLE_INVITE_EMAIL} />
    </InviteShell>
  );
}

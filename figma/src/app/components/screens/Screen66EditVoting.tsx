import {
  CreateVotingScreen,
  CreateVotingPrimaryButton,
  CreateVotingDetailsForm,
  EDIT_VOTING_TITLE,
  EDIT_VOTING_SUBTITLE,
} from '../trip/CreateVotingSheetParts';

/** Sheet edit voting aktivitas — dari menu ⋮ → Edit Voting */
export function Screen66EditVoting() {
  return (
    <CreateVotingScreen
      height="fixed"
      title={EDIT_VOTING_TITLE}
      subtitle={EDIT_VOTING_SUBTITLE}
      footer={<CreateVotingPrimaryButton label="Simpan" />}
    >
      <CreateVotingDetailsForm />
    </CreateVotingScreen>
  );
}

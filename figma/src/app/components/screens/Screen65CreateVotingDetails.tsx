import {
  CreateVotingScreen,
  CreateVotingPrimaryButton,
  CreateVotingDetailsForm,
  CREATE_VOTING_DETAILS_TITLE,
  CREATE_VOTING_DETAILS_SUBTITLE,
} from '../trip/CreateVotingSheetParts';

/** Sheet buat voting — langkah 2: judul, kandidat, deadline */
export function Screen65CreateVotingDetails() {
  return (
    <CreateVotingScreen
      height="fixed"
      title={CREATE_VOTING_DETAILS_TITLE}
      subtitle={CREATE_VOTING_DETAILS_SUBTITLE}
      onBack
      footer={<CreateVotingPrimaryButton label="Buat Voting" />}
    >
      <CreateVotingDetailsForm />
    </CreateVotingScreen>
  );
}

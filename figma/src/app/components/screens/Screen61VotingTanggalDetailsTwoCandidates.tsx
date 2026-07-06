import {
  CreateVotingScreen,
  CreateVotingPrimaryButton,
  CreateVotingTanggalDetailsForm,
  CREATE_VOTING_DETAILS_TITLE,
  CREATE_VOTING_TANGGAL_DETAILS_SUBTITLE,
} from '../trip/CreateVotingSheetParts';
import { TRIP_CURRENT_DATE_CANDIDATE, TRIP_DATE_CANDIDATES } from '../trip/CreateTripParts';

/** Kembali ke detail: 2 kandidat tersimpan, tenggat muncul */
export function Screen61VotingTanggalDetailsTwoCandidates() {
  return (
    <CreateVotingScreen
      height="fixed"
      title={CREATE_VOTING_DETAILS_TITLE}
      subtitle={CREATE_VOTING_TANGGAL_DETAILS_SUBTITLE}
      onBack
      footer={<CreateVotingPrimaryButton label="Buat Voting" />}
    >
      <CreateVotingTanggalDetailsForm
        candidates={[TRIP_CURRENT_DATE_CANDIDATE, TRIP_DATE_CANDIDATES[1]]}
        showAddButton
        highlightAddButton
      />
    </CreateVotingScreen>
  );
}

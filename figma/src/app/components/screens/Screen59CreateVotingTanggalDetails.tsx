import {
  CreateVotingScreen,
  CreateVotingPrimaryButton,
  CreateVotingTanggalDetailsForm,
  CREATE_VOTING_DETAILS_TITLE,
  CREATE_VOTING_TANGGAL_DETAILS_SUBTITLE,
} from '../trip/CreateVotingSheetParts';
import { TRIP_CURRENT_DATE_CANDIDATE } from '../trip/CreateTripParts';

/** Awal: 1 kandidat default (tanggal perjalanan saat ini) */
export function Screen59CreateVotingTanggalDetails() {
  return (
    <CreateVotingScreen
      height="fixed"
      title={CREATE_VOTING_DETAILS_TITLE}
      subtitle={CREATE_VOTING_TANGGAL_DETAILS_SUBTITLE}
      onBack
      footer={<CreateVotingPrimaryButton label="Buat Voting" />}
    >
      <CreateVotingTanggalDetailsForm
        candidates={[TRIP_CURRENT_DATE_CANDIDATE]}
        showAddButton
        highlightAddButton
      />
    </CreateVotingScreen>
  );
}

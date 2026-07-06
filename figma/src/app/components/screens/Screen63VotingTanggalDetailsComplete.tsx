import {
  CreateVotingScreen,
  CreateVotingPrimaryButton,
  CreateVotingTanggalDetailsForm,
  CREATE_VOTING_DETAILS_TITLE,
  CREATE_VOTING_TANGGAL_DETAILS_SUBTITLE,
} from '../trip/CreateVotingSheetParts';
import { TRIP_DATE_CANDIDATES } from '../trip/CreateTripParts';

/** 3 kandidat + tenggat, siap buat voting */
export function Screen63VotingTanggalDetailsComplete() {
  return (
    <CreateVotingScreen
      height="fixed"
      title={CREATE_VOTING_DETAILS_TITLE}
      subtitle={CREATE_VOTING_TANGGAL_DETAILS_SUBTITLE}
      onBack
      footer={<CreateVotingPrimaryButton label="Buat Voting" />}
    >
      <CreateVotingTanggalDetailsForm
        candidates={TRIP_DATE_CANDIDATES}
        deadline="18 Jun 2026, 18:00"
        showAddButton={false}
      />
    </CreateVotingScreen>
  );
}

import {
  CreateVotingScreen,
  CreateVotingPrimaryButton,
  CreateVotingTanggalDetailsForm,
  EDIT_VOTING_TITLE,
  EDIT_VOTING_TANGGAL_SUBTITLE,
} from '../trip/CreateVotingSheetParts';
import { TRIP_DATE_CANDIDATES } from '../trip/CreateTripParts';

/** Sheet edit voting tanggal — UI sama Detail Voting, tanpa tombol kembali */
export function Screen67EditVotingTanggal() {
  return (
    <CreateVotingScreen
      height="fixed"
      title={EDIT_VOTING_TITLE}
      subtitle={EDIT_VOTING_TANGGAL_SUBTITLE}
      footer={<CreateVotingPrimaryButton label="Simpan" />}
    >
      <CreateVotingTanggalDetailsForm
        candidates={TRIP_DATE_CANDIDATES}
        deadline="18 Jun 2026, 18:00"
        showAddButton
      />
    </CreateVotingScreen>
  );
}

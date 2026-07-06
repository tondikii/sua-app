import {
  CreateVotingScreen,
  CreateVotingPrimaryButton,
  VotingTypeOptionList,
  CREATE_VOTING_TITLE,
  CREATE_VOTING_TYPE_SUBTITLE,
} from '../trip/CreateVotingSheetParts';

/** Sheet buat voting — langkah 1: pilih jenis */
export function Screen64CreateVoting() {
  return (
    <CreateVotingScreen
      title={CREATE_VOTING_TITLE}
      subtitle={CREATE_VOTING_TYPE_SUBTITLE}
      footer={<CreateVotingPrimaryButton label="Lanjutkan" />}
    >
      <VotingTypeOptionList selected="destinasi" disabledTypes={['tanggal']} ongoingTypes={['tanggal']} />
    </CreateVotingScreen>
  );
}

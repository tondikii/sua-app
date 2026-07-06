import {
  CreateVotingScreen,
  CreateVotingPrimaryButton,
  VotingTypeOptionList,
  CREATE_VOTING_TITLE,
  CREATE_VOTING_TYPE_SUBTITLE,
} from '../trip/CreateVotingSheetParts';

/** Buat voting tanggal baru — hanya setelah voting tanggal sebelumnya berakhir */
export function Screen58CreateVotingTanggal() {
  return (
    <CreateVotingScreen
      title={CREATE_VOTING_TITLE}
      subtitle={CREATE_VOTING_TYPE_SUBTITLE}
      footer={<CreateVotingPrimaryButton label="Lanjutkan" />}
    >
      <VotingTypeOptionList selected="tanggal" disabledTypes={['destinasi']} />
    </CreateVotingScreen>
  );
}

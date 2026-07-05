import { C, FONT } from '../colors';
import {
  CreateVotingBackdrop,
  CreateVotingSheet,
  CreateVotingPrimaryButton,
  VotingTypeOptionList,
} from '../trip/CreateVotingSheetParts';

/** Buat voting tanggal baru — hanya setelah voting tanggal sebelumnya berakhir */
export function Screen60CreateVotingTanggal() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <CreateVotingBackdrop />

      <CreateVotingSheet
        title="Buat Voting Tanggal"
        subtitle="Voting tanggal baru dimulai dari nol — pilih kandidat ulang di kalender."
        height="fixed"
        footer={<CreateVotingPrimaryButton label="Lanjutkan" />}
      >
        <VotingTypeOptionList selected="tanggal" disabledTypes={['destinasi']} />
      </CreateVotingSheet>
    </div>
  );
}

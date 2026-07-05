import { C, FONT } from '../colors';
import {
  CreateVotingBackdrop,
  CreateVotingSheet,
  CreateVotingPrimaryButton,
  VotingTypeOptionList,
} from '../trip/CreateVotingSheetParts';

/** Sheet buat voting — langkah 1: pilih jenis */
export function Screen42CreateVoting() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <CreateVotingBackdrop />

      <CreateVotingSheet
        title="Buat Voting Aktivitas"
        subtitle="Pilih aktivitas atau destinasi untuk slot kosong di itinerary."
        height="fixed"
        footer={<CreateVotingPrimaryButton label="Lanjutkan" />}
      >
        <VotingTypeOptionList selected="destinasi" disabledTypes={['tanggal']} />
      </CreateVotingSheet>
    </div>
  );
}

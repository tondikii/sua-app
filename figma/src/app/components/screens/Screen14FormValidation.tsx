import { CreateTripFooter, CreateTripFormBody, CreateTripShell } from '../trip/CreateTripParts';

/** [Belum pasti] Validasi — nama & minimal 1 kandidat */
export function Screen14FormValidation() {
  return (
    <CreateTripShell footer={<CreateTripFooter disabled errors={['Nama perjalanan wajib diisi', 'Pilih minimal 1 kandidat tanggal']} />}>
      <CreateTripFormBody
        name=""
        tags={[]}
        nameError="Nama perjalanan tidak boleh kosong."
        dateMode="candidates"
        dateMuted
        dateError="Pilih rentang tanggal, lalu tambahkan sebagai kandidat."
        showCandidateList
        showEmptySlot
        showAddButton
      />
    </CreateTripShell>
  );
}

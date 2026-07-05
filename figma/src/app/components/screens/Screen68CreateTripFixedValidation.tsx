import { CreateTripFooter, CreateTripFormBody, CreateTripShell } from '../trip/CreateTripParts';

/** [A] Tanggal pasti — validasi error setelah submit (nama & tanggal kosong) */
export function Screen68CreateTripFixedValidation() {
  return (
    <CreateTripShell footer={<CreateTripFooter disabled errors={['Nama perjalanan wajib diisi', 'Pilih tanggal perjalanan']} />}>
      <CreateTripFormBody
        name=""
        tags={[]}
        nameError="Nama perjalanan tidak boleh kosong."
        dateMode="fixed"
        dateMuted
        noDateSelected
        dateError="Pilih rentang tanggal perjalanan."
      />
    </CreateTripShell>
  );
}

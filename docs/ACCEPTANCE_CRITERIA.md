# Acceptance Criteria (Kriteria Penerimaan)

## 1. Autentikasi & Onboarding
- [ ] Tampilan depan (Frontend) menampilkan layar *Onboarding* menggunakan *slider/carousel* informasi hanya saat pengguna baru pertama kali membuka aplikasi.
- [ ] Pengguna dapat masuk (*login*) dengan sukses menggunakan akun Google melalui tombol "Lanjutkan dengan Google".
- [ ] Sistem berhasil mengekstrak dan menyimpan data dasar (Nama, Email, Avatar) dari Google ke tabel `users` di *database*.
- [ ] Pengguna baru diarahkan ke form pembuatan *username* dan sistem menolak jika *username* sudah digunakan oleh orang lain.
- [ ] Pengguna lama yang berhasil *login* langsung diarahkan ke halaman Beranda secara otomatis tanpa melewati form *username* lagi.

## 2. Beranda, Profil & Sistem Sosial
- [ ] Halaman Beranda menampilkan sapaan pengguna, ikon lonceng untuk Notifikasi, dan memisahkan daftar perjalanan ke dalam tab: "Mendatang", "Selesai", dan "Undangan".
- [ ] *Card* perjalanan di Beranda menampilkan informasi Judul, *Tags* (bentuk *chips*), Rentang Tanggal, dan foto profil kecil bertumpuk (*stacked avatars*) dari seluruh partisipan.
- [ ] Halaman profil pribadi menampilkan foto, *username*, bio, statistik pengikut (*followers/following*), dan daftar riwayat perjalanan.
- [ ] Pengguna dapat mengubah bio dan mengatur *toggle* visibilitas profil (`is_public`).
- [ ] Jika preferensi visibilitas profil di-set privat (`is_public = false`), pengguna lain yang mencari tidak dapat melihat daftar riwayat perjalanan orang tersebut.
- [ ] Pengguna dapat mencari akun lain di tab Pencarian menggunakan *username* atau nama, lalu mem-*follow* atau *unfollow* akun tersebut.
- [ ] Menerima undangan perjalanan otomatis membuat status saling *follow* (mutual) antara pengundang dan yang diundang di tabel `follows`.

## 3. Manajemen Perjalanan & Destinasi
- [ ] Pengguna dapat membuka form pembuatan perjalanan baru melalui tombol "+" dengan tampilan *Modal Full-Screen* atau *Bottom Sheet*.
- [ ] Pengguna dapat mengisi "Nama Perjalanan" dan menginput "Tags" secara dinamis (mengetik lalu tekan *enter/space* untuk mengubah teks menjadi *chip*).
- [ ] Pengguna dapat memilih *toggle* "Tanggal Pasti" (menentukan *start* & *end date*) atau "Belum Pasti (Voting)" (menambahkan beberapa kandidat rentang tanggal).
- [ ] Pembuat perjalanan dapat mengubah nama trip, rentang tanggal, atau pilihan kandidat tanggal kapan saja.
- [ ] Pengguna dapat menambahkan destinasi ke dalam perjalanan dengan form: "Nama Tempat" (wajib), "Link Google Maps" (opsional), dan "Link Referensi TikTok/IG" (opsional).
- [ ] Tab Destinasi menampilkan *Empty State* (ilustrasi + tombol tambah) jika belum ada tempat yang dimasukkan.
- [ ] *Card* destinasi berhasil menampilkan tombol pintasan langsung untuk membuka tautan Google Maps atau tautan referensi media sosial yang tertera.

## 4. Kolaborasi, Voting & Grup Chat
- [ ] Pembuat perjalanan dapat mencari dan mengundang partisipan menggunakan *username* (mengirim notifikasi *in-app*) atau email (undangan kalender).
- [ ] Partisipan yang diundang via *username* dapat melihat undangan di tab "Undangan" pada halaman Beranda, serta dapat memilih untuk menerima atau menolak.
- [ ] Undangan yang dikirim via email berhasil memicu pengiriman undangan *event* ke Google Calendar target via Google Calendar API.
- [ ] Khusus untuk status tanggal "Belum Pasti", muncul *banner* "Butuh Voting Tanggal" di halaman detail, dan seluruh partisipan bisa memberikan suara (*vote*) pada kandidat tanggal yang tersedia.
- [ ] **Hanya pembuat perjalanan (creator)** yang memiliki akses untuk menekan tombol "Kunci Tanggal Ini" berdasarkan hasil *voting*.
- [ ] Proses penguncian tanggal otomatis mengubah status trip menjadi *fixed* dan langsung menyinkronkan jadwal sebagai *event* di Google Calendar seluruh partisipan.
- [ ] Ruang obrolan (*Chat*) internal hanya dapat diakses oleh pengguna yang sudah berstatus sebagai partisipan resmi di perjalanan tersebut.
- [ ] Pesan di dalam grup *chat* terkirim dan diterima secara berurutan (*chronological order*) sesuai waktu kirim.

## 5. Wishlist
- [ ] Pengguna dapat membuat item Wishlist baru melalui tombol FAB "+" dengan mengisi nama tempat, tautan pendukung, *tags*, dan memilih skala prioritas (Tinggi, Menengah, Rendah).
- [ ] Daftar Wishlist berhasil ditampilkan dalam bentuk *Grid* atau *List View*.
- [ ] Fitur *Filter* dan *Sort* di bagian atas halaman berfungsi dengan benar untuk menyaring destinasi berdasarkan *Tags* atau mengurutkannya sesuai Tingkat Prioritas.
- [ ] Halaman Wishlist menampilkan status kosong jika pengguna belum pernah menyimpan destinasi impian.
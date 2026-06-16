# Acceptance Criteria (Kriteria Penerimaan)

## 1. Autentikasi & Onboarding
* Pengguna dapat masuk (*login*) dengan sukses menggunakan akun Google.
* Sistem berhasil mengambil data dasar (Nama, Email, Avatar) dari Google.
* Pengguna baru diwajibkan membuat *username* unik yang belum terdaftar di sistem.
* Pengguna lama yang masuk akan langsung diarahkan ke halaman utama.

## 2. Profil & Sistem Sosial
* Halaman profil menampilkan *username*, foto, bio, dan riwayat perjalanan (jika diatur publik) dengan tepat.
* Pengguna dapat mencari akun lain menggunakan *username* yang valid.
* Pengguna dapat mengikuti (*follow*) dan berhenti mengikuti (*unfollow*) akun pengguna lain.
* Penerimaan undangan perjalanan memicu sistem untuk otomatis membuat status saling *follow* antara pengundang dan partisipan.

## 3. Manajemen Perjalanan
* Pengguna dapat membuat perjalanan baru dengan mengisi nama trip dan *tag*.
* Pembuat perjalanan dapat menentukan rentang tanggal pasti atau memasukkan beberapa kandidat tanggal jika jadwal belum pasti.
* Jika tanggalnya belum pasti, partisipan baru bisa melakukan *voting* kandidat tanggal yang tersedia.
* Pembuat perjalanan dapat mengubah rentang tanggal atau pilihan kandidat tanggal kapan saja.
* Pengguna dapat menambahkan destinasi, lengkap dengan tautan peta (Google Maps) dan tautan referensi visual eksternal.

## 4. Kolaborasi & Integrasi
* Pembuat perjalanan dapat mencari dan mengundang partisipan menggunakan *username* atau email.
* Partisipan yang diundang via *username* dapat melihat, menerima, atau menolak undangan di dalam aplikasi.
* Undangan yang dikirim via email berhasil memicu pengiriman undangan (*event*) ke Google Calendar target.
* Ruang obrolan (*chat room*) internal di setiap perjalanan hanya dapat diakses oleh partisipan yang telah menerima undangan.
* Sistem berhasil menyinkronkan jadwal ke Google Calendar seluruh partisipan setelah tanggal perjalanan difinalisasi.

## 5. Wishlist
* Pengguna dapat membuat item Wishlist baru dengan menyertakan nama tempat dan tautan terkait.
* Pengguna dapat mengelompokkan item Wishlist menggunakan *tag*.
* Pengguna dapat mengatur tingkat prioritas pada masing-masing item Wishlist.
* Daftar Wishlist dapat diurutkan dengan benar berdasarkan tingkat prioritas.

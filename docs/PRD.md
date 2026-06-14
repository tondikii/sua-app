# Product Requirements Document (PRD)

## 1. Autentikasi & Onboarding
* **Tujuan**: Akses masuk yang cepat dan tanpa hambatan.
* **Alur**:
  * Menggunakan otentikasi Google Sign-In.
  * **Pengguna Baru**: Pembuatan akun otomatis mengambil metadata Google (Nama, Email, Avatar) dilanjutkan dengan pembuatan *username* unik.
  * **Pengguna Lama**: Validasi sesi dan langsung diarahkan ke beranda.

## 2. Profil & Sistem Sosial
* **Tujuan**: Membangun ekosistem kolaborasi dan interaksi antar pengguna.
* **Fitur Utama**:
  * **Profil Pengguna**: Menampilkan *username*, bio singkat, dan riwayat perjalanan publik.
  * **Sistem Follow**: 
    * Manual: Pencarian *username* untuk mengikuti pengguna lain.
    * Otomatis: Hubungan saling *follow* (mutual) langsung terbentuk saat pengguna menerima undangan perjalanan.

## 3. Manajemen Perjalanan (Core)
* **Tujuan**: Wadah terpusat untuk *itinerary*, penentuan jadwal, dan referensi.
* **Fitur Utama**:
  * **Pembuatan Trip**: Mengatur nama perjalanan dan *tagging* kategori ala Instagram.
  * **Penentuan Jadwal (Voting)**: Pembuat dapat memasukkan beberapa kandidat rentang tanggal (mulai - selesai) untuk dipilih (*vote*) oleh para partisipan.
  * **Penyusunan Destinasi**: Menambahkan daftar tempat, dilengkapi tautan peta dan *link* referensi visual (opsional) dari media sosial seperti TikTok atau Instagram.

## 4. Kolaborasi & Integrasi
* **Tujuan**: Sentralisasi komunikasi dan sinkronisasi jadwal seluruh partisipan.
* **Fitur Utama**:
  * **Sistem Undangan**:
    * *Via Username*: Notifikasi *in-app*. Jika diterima, perjalanan otomatis masuk ke daftar "Trip Saya".
    * *Via Email*: Mengirim undangan langsung ke Google Calendar (solusi untuk non-pengguna).
  * **Grup Chat Internal**: Ruang obrolan khusus (*dedicated*) di setiap perjalanan untuk diskusi partisipan.
  * **Sinkronisasi Kalender**: Otomatis membuat jadwal di Google Calendar partisipan setelah tanggal perjalanan dikunci (*fixed*).

## 5. Wishlist (Daftar Keinginan)
* **Tujuan**: Mengelola destinasi impian terstruktur untuk rencana mendatang.
* **Fitur Utama**:
  * Penyimpanan referensi tempat wisata beserta *link* pendukung.
  * Pengelompokan destinasi menggunakan sistem *tagging*.
  * Penyortiran daftar tempat berdasarkan prioritas kunjungan.

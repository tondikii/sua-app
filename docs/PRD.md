# Product Requirements Document (PRD)

## 1. Autentikasi & Onboarding
* Aplikasi menampilkan layar *Onboarding* (informasi aplikasi) khusus saat pengguna baru pertama kali membuka aplikasi di perangkatnya.
* Pengguna dapat masuk (*login*) dengan sukses menggunakan akun Google.
* Sistem berhasil mengambil data dasar (Nama, Email, Avatar) dari Google.
* Pengguna baru diwajibkan membuat *username* unik yang belum terdaftar di sistem.
* Pengguna lama yang masuk akan langsung diarahkan ke halaman utama.

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
  * **Penentuan Jadwal**: Mendukung pengisian tanggal langsung (jika sudah yakin) atau pembuatan beberapa kandidat tanggal jika jadwal belum pasti. Pilihan jadwal atau kandidat tetap dapat diubah setelahnya.
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

# WorkFlow - Atur Perjalanan

Dokumen ini mencatat alur kerja (*workflow*) pengguna dari awal membuka aplikasi hingga menggunakan seluruh fitur di dalamnya. Alur ini juga dirancang sebagai panduan pembuatan antarmuka (UI/UX) dan skema basis data (*database*).

---

## Struktur Navigasi Utama (Bottom Tab Bar)
Untuk panduan UI/UX, aplikasi menggunakan *Bottom Navigation Bar* dengan 5 menu utama:
1. **Beranda (Home)**: Daftar perjalanan.
2. **Pencarian (Explore)**: Mencari pengguna lain.
3. **[+] Buat (Create)**: Tombol *Floating Action Button* (FAB) di tengah untuk membuat perjalanan.
4. **Wishlist**: Daftar destinasi impian.
5. **Profil**: Halaman akun pengguna.

---

## 1. Onboarding Layar Awal (Frontend)
* Saat aplikasi pertama kali dibuka setelah instalasi, Frontend (FE) akan mengecek status (*flag*) pengguna.
* Jika ini adalah kali pertama pengguna membuka aplikasi, sistem akan menampilkan layar *Onboarding*.
* **UI/UX**: Layar ini menampilkan *slider/carousel* ilustrasi untuk mengedukasi pengguna mengenai apa itu "Atur Perjalanan" dan bagaimana aplikasi ini dapat membantu merencanakan liburan (Manajemen Perjalanan, Voting Jadwal, Grup Chat).
* Setelah melewati layar perkenalan, pengguna diarahkan ke halaman Autentikasi.

## 2. Autentikasi (Google Sign-In)
* **UI/UX**: Halaman bersih dengan logo aplikasi dan satu tombol utama "Lanjutkan dengan Google".
* Sistem mengambil data profil dasar dari Google (Email, Nama, Avatar) dan menyimpannya ke dalam *database*.
* **Bagi Pengguna Baru**: Diarahkan ke form pengisian untuk membuat *username* unik terlebih dahulu sebelum masuk ke sistem utama.
* **Bagi Pengguna Lama**: Sistem memvalidasi sesi secara otomatis dan langsung mengarahkan pengguna ke halaman Beranda.
* **Interaksi Data**: Menyimpan atau memvalidasi baris di tabel `users` (`id`, `google_id`, `email`, `name`, `username`, `avatar_url`).

## 3. Beranda (Home) - Tab 1
* Setelah berhasil masuk, pengguna diarahkan ke halaman Beranda.
* **UI/UX & Layout**:
  * **Header**: Sapaan (contoh: "Halo, [Nama]!") beserta *icon* lonceng untuk Notifikasi (undangan trip, *follow* baru).
  * **Tab View**: Terdapat *segmented control* atau *swipeable tabs* dengan kategori: "Mendatang", "Selesai", dan "Undangan".
  * **Komponen Card**: Setiap perjalanan ditampilkan dalam bentuk *Card* modern (mirip Airbnb). *Card* memuat Judul Trip, *Tags* (berupa *chips*), Rentang Tanggal, dan *Stacked Avatars* (foto profil kecil yang bertumpuk) dari para partisipan.
* **Interaksi Data**:
  * FE melakukan *fetch* data dari tabel `trips` yang di-*join* dengan tabel `trip_participants` berdasarkan `user_id` pengguna yang sedang masuk.
  * **Data yang ditampilkan**: `trip_id`, `trip_name`, `tags`, `start_date`, `end_date`, `status`, dan relasi ke `users.avatar` untuk menampilkan wajah partisipan.

## 4. Pencarian & Profil - Tab 2 & Tab 5
* **Alur Pencarian (Tab 2 - Explore)**:
  * **UI/UX**: Halaman berisi *Search Bar* di bagian atas. Saat mengetik, muncul *list view* hasil pencarian. Setiap baris menampilkan Avatar, Username, Nama Asli, dan tombol "Follow/Unfollow".
  * **Interaksi Data**: FE mengirim *query* pencarian via API. Backend (BE) mencari `LIKE %query%` di tabel `users` pada kolom `username` dan `name`.
* **Alur Profil Pribadi (Tab 5 - Profile)**:
  * **UI/UX**: Menampilkan Foto Profil besar, Username, Bio singkat, angka statistik "Followers" & "Following". Di bawahnya terdapat *Grid* riwayat perjalanan publik. Terdapat tombol "Edit Profil".
  * **Interaksi Data**: FE mengambil data dari tabel `users`, menghitung baris di tabel `follows` untuk statistik, dan menarik `trips` dengan `is_public = true`.

## 5. Pembuatan Perjalanan (Trip Initialization) - Tab 3 [+]
* Pengguna menekan tombol "+" di tengah *Bottom Navigation*.
* **UI/UX & Layout**:
  * Menggunakan *Modal Full-Screen* atau *Bottom Sheet*.
  * **Form Info**: Input "Nama Perjalanan", dan input dinamis untuk "Tags" (ketik lalu *enter* menjadi *Chip*).
  * **Toggle Switch**: Pilihan antara "Tanggal Pasti" vs "Belum Pasti (Voting)".
  * **Date Picker**: Jika "Tanggal Pasti", muncul kalender untuk memilih rentang (*Start* - *End*). Jika "Voting", kalender memungkinkan pengguna memilih beberapa rentang secara bergantian (menambah *Card* kandidat tanggal ke bawah form).
* **Interaksi Data**:
  * BE membuat *record* di tabel `trips` (`trip_id`, `trip_name`, `tags`, `creator_id`).
  * **Jika Tanggal Pasti**: Menyimpan `start_date` dan `end_date` ke `trips`, set status `fixed`.
  * **Jika Voting**: Set status `trips` ke `voting_pending`. Menyimpan setiap rentang waktu ke tabel `trip_date_candidates` (`candidate_id`, `trip_id`, `start_date`, `end_date`).

## 6. Pengisian Destinasi Perjalanan
* Di dalam halaman *Detail Trip*, pengguna masuk ke tab "Destinasi".
* **UI/UX & Layout**:
  * Menampilkan *Vertical List* tempat yang akan dikunjungi. Jika kosong, tampilkan *Empty State* (ilustrasi + tombol "Tambah Destinasi").
  * Menekan tombol memunculkan *Bottom Sheet* berisi form: "Nama Tempat" (Wajib), "Link Google Maps" (Opsional), "Link Referensi TikTok/IG" (Opsional).
  * Tempat yang ditambahkan muncul sebagai *Card* dengan tombol kecil "Buka Peta" atau ikon referensi sosial media.
* **Interaksi Data**: BE menyimpan data ke tabel `trip_destinations` (`destination_id`, `trip_id`, `place_name`, `maps_link`, `reference_link`).

## 7. Mengundang Partisipan & Kolaborasi
* Di halaman *Detail Trip*, terdapat tombol "+ Undang Teman".
* **UI/UX & Layout**: Muncul *Bottom Sheet* dengan kolom pencarian *username* atau input alamat email.
* **Interaksi Data**:
  * **Via Username**: Menyimpan ke tabel `trip_invitations` (`trip_id`, `invited_user_id`, `status='pending'`). Saat diterima, BE menambahkan pengguna ke `trip_participants` dan otomatis menambahkan *record* saling mengikuti di tabel `follows`.
  * **Via Email**: BE langsung menembak *Google Calendar API* untuk mengirim undangan *event*.

## 8. Voting Tanggal (Jika Jadwal Belum Pasti)
* Berlaku untuk perjalanan dengan status `voting_pending`.
* **UI/UX & Layout**: Di bagian atas *Detail Trip*, muncul *Banner* "Butuh Voting Tanggal". Mengkliknya membuka halaman berisi *Card* kandidat tanggal. Setiap partisipan dapat menekan tombol "Vote" (ikon jempol/ceklis) pada tanggal yang cocok.
* **Penguncian Tanggal**: Pembuat perjalanan dapat melihat jumlah *vote* dan menekan tombol "Kunci Tanggal Ini" pada opsi dengan suara terbanyak.
* **Interaksi Data**:
  * *Voting*: Menyimpan data ke tabel `trip_date_votes` (`candidate_id`, `user_id`).
  * *Penguncian*: BE memperbarui `start_date` dan `end_date` di tabel `trips`, mengubah status menjadi `fixed`, lalu memicu (*trigger*) *Google Calendar API* untuk sinkronisasi jadwal ke kalender seluruh partisipan.

## 9. Grup Chat Internal Perjalanan
* Di dalam *Detail Trip*, terdapat tab khusus "Chat".
* **UI/UX & Layout**: Antarmuka *chat* standar (seperti WhatsApp/Telegram). Terdapat area pesan (*message bubbles*), kolom input teks di bawah, dan tombol kirim.
* **Interaksi Data**: Menyimpan dan mengambil (*fetch real-time* jika memungkinkan) data dari tabel `trip_messages` (`message_id`, `trip_id`, `sender_id`, `message_text`, `created_at`).

## 10. Wishlist (Daftar Keinginan) - Tab 4
* **UI/UX & Layout**:
  * Menampilkan *Grid* atau *List View* dari destinasi yang disimpan pengguna.
  * Memiliki opsi *Filter/Sort* di bagian atas berdasarkan *Tags* atau Tingkat Prioritas.
  * Terdapat tombol FAB "+" untuk menambah *Wishlist* baru. Form pengisian meminta: Nama Tempat, Link Referensi/Peta, *Tags*, dan Pemilihan Prioritas (Tinggi, Menengah, Rendah).
* **Interaksi Data**: Menyimpan ke tabel `wishlists` (`wishlist_id`, `user_id`, `place_name`, `link`, `tags`, `priority_level`).
# Project Brief: Atur Perjalanan

## 🧩 Masalah (The Problem)
Merencanakan perjalanan bersama teman sering kali menghadapi hambatan yang membuat rencana sekadar menjadi wacana:
1. **Sepakat Jadwal Susah Banget**: Poll tanggal numpuk di chat, tapi keputusan liburan tidak pernah jadi — minggu ini sibuk, minggu depan juga.
2. **Rencana Berserakan, Urutan Nggak Jelas**: Link TikTok, pin Maps, catatan di Notes — semua ada, tapi tidak ada yang tahu jam berapa berangkat, ke mana dulu, makan di mana.
3. **Chat Trip Kecampur**: Obrolan trip nyasar ke grup chat harian — pesan penting tenggelam, foto liburan susah dilacak lagi.

## 💡 Solusi (The Solution)
Atur Perjalanan hadir sebagai *hub* terpusat yang menjembatani wacana liburan dan eksekusi nyata melalui:
* **Vote Bareng, Hasil Jelas**: Multi kandidat tanggal saat buat trip → voting di satu tempat → kunci jadwal. Voting juga untuk aktivitas itinerary dan keputusan lain (multi-voting concurrent).
* **Timeline Harian yang Jelas**: Itinerary aktivitas berjadwal per jam — urutan hari, waktu senggang, status jalan (lalu/sudah/belum) kelihatan sekilas. Thumbnail Google Maps atau cover icon/media per aktivitas.
* **Ruang Diskusi Khusus Trip**: Grup chat per perjalanan — ngobrol, kirim foto/video; media otomatis tersimpan rapi di tab Media.
* **Media & Cover**: Tab Media untuk foto/video trip; cover card Beranda dipilih dari media yang diunggah.
* **Wishlist Aktivitas**: Tabungan aktivitas impian (waktu, Maps, prioritas) — filter/sort, lalu **Jadikan Perjalanan** untuk konversi ke trip + itinerary.
* **Beranda Terpusat** (WORKFLOW §3 / `App.tsx` id: 3): Tab **Perjalananku** — Mendatang, Selesai, Undangan + lonceng notifikasi; empty state Mendatang; satu hub melihat semua trip aktif.

## 🎯 Target Audiens (Target Audience)
* **Si "Planner"**: Anggota grup yang selalu berinisiatif menyusun jadwal dan membutuhkan alat organisasi yang praktis.
* **Si "Terima Beres"**: Anggota grup yang pasif dalam merencanakan, tetapi butuh satu sumber informasi yang jelas tentang detail perjalanan.
* **Solo Traveler**: Individu yang ingin merapikan daftar kunjungan dan *wishlist* perjalanan pribadi mereka.

## 🎨 Filosofi Brand (Brand Philosophy)
* **Nama**: Atur Perjalanan (Sebuah *call-to-action* yang jelas dan fungsional).
* **Tagline**: *Rencanakan. Jelajahi. Kenang.* — dipakai di splash (`Screen1Splash`) dan layar login (`Screen3Auth`).
* **Vibe**: Energik, kolaboratif, dan solutif.
* **Tone**: *Fun*, *playful*, santai, dan bersahabat—tidak kaku seperti aplikasi produktivitas korporat.
* **Visual Identity**: Palette Sunset & Beach dengan warna Warm Coral primary, Soft Teal secondary, dan typography Plus Jakarta Sans. Detail lengkap (HEX, spacing, radius): [docs/FIGMA.md § Design Tokens](docs/FIGMA.md#-design-tokens).

## 🚀 Onboarding Edukasi (First Launch)

Carousel 4 slide (`Screen2EduOnboarding`, WORKFLOW §1 / `App.tsx` id: 1) memetakan tiga masalah inti di atas ke solusi produk — copy masalah/solusi selaras bagian **Masalah** dan **Solusi** dokumen ini:

| Slide | Masalah (`BRIEF`) | Solusi (`BRIEF`) |
|-------|-------------------|------------------|
| 1 (intro) | — | *Realisasikan Wacana Liburanmu* — value prop kolaborasi trip |
| 2 | Sepakat Jadwal Susah Banget | Vote Bareng, Hasil Jelas |
| 3 | Rencana Berserakan, Urutan Nggak Jelas | Timeline Harian yang Jelas |
| 4 | Chat Trip Kecampur | Ruang Diskusi Khusus Trip |

Setelah onboarding → **Autentikasi** (WORKFLOW §2 / `App.tsx` id: 2): Google Sign-In + username unik untuk pengguna baru.

## 🔍 Pencarian & Profil (Tab Cari & Tab Profil)

| Area | WORKFLOW | Layar | Fungsi inti |
|------|----------|-------|-------------|
| Pencarian | §4 / id: 4 | 10–14 | Cari teman by nama/username; riwayat lokal; profil publik + grid trip publik |
| Profil | §5 / id: 5 | 15–20 | Profil pribadi, pengaturan, edit bio, FAQ, hapus akun |
| Buat perjalanan | §6 / id: 6 | 21–41 | Modal buat trip (tanggal pasti / kandidat) + undang teman pasca-create |
| Itinerary trip | §7 / id: 7 | 42–55 | Timeline multi-hari, tambah/edit aktivitas, cover, detail, menu item |
| Voting trip | §8 / id: 8 | 56–75 | Multi-poll collapse, buat/edit, pipeline selesai, modal akhiri |
| Chat trip | §9 / id: 9 | 76–92 | Grup, lampiran, media composer, long press, reply quote |
| Media trip | §10 / id: 10 | 93–94 | Grid unggah, set cover, badge dari chat |
| Kelola trip | §11 / id: 11 | 95–103 | Menu ⋮: anggota, pending, edit, hapus, kalender |
| Wishlist | §12 / id: 12 | 104–117 | Grid, form, detail, Jadikan Perjalanan, konversi itinerary |
| System states | §13 / id: 13 | 118–125 | Skeleton, toast, offline, media viewer, dark mode, design tokens |

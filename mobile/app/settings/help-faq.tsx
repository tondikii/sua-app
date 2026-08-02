import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { goBackSmart } from '@/lib/navigation';
import { openExternalLink } from '@/lib/externalLink';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { ChevronDown } from '@/components/icons/ChevronDown';
import { Mail } from '@/components/icons/Mail';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

const CONTACT_EMAIL = 'bantuan@aturperjalanan.id';

const FAQ_ITEMS = [
  {
    q: 'Bagaimana cara membuat perjalanan?',
    a: 'Tap tombol + di tengah tab bar, isi nama perjalanan, pilih mode tanggal (tanggal pasti atau kandidat yang nanti divoting), lalu tap Buat Perjalanan. Setelah itu kamu bisa langsung mengundang teman atau lewati dulu.',
  },
  {
    q: 'Apa bedanya tanggal pasti dan kandidat tanggal?',
    a: 'Mode "tanggal pasti" langsung menetapkan tanggal perjalanan. Mode "kandidat" membuat voting tanggal otomatis — semua anggota memilih tanggal yang cocok, dan tanggal pemenang dikunci menjadi tanggal perjalanan.',
  },
  {
    q: 'Bagaimana cara mengundang teman?',
    a: 'Dari detail perjalanan, buka menu ⋮ di pojok kanan atas → Daftar Anggota → tap ikon undang. Cari username atau email teman, lalu kirim undangan. Mereka akan melihat undangan di tab Undangan di Beranda.',
  },
  {
    q: 'Apa yang bisa dilakukan di Itinerary?',
    a: 'Itinerary menampilkan aktivitas per hari sesuai tanggal perjalanan. Kamu bisa menambah, mengedit, dan menghapus aktivitas (berkumpul, transport, makan, aktivitas, atau tujuan) lengkap dengan waktu, lokasi, link Google Maps, dan cover.',
  },
  {
    q: 'Bagaimana cara menggunakan voting?',
    a: 'Setiap perjalanan punya halaman voting untuk memutuskan tanggal, aktivitas, atau hal lainnya. Buat voting baru, isi kandidat, lalu anggota bisa memilih. Voting bisa ditutup/dikunci saat sudah cukup — pemenang otomatis dipakai (misalnya tanggal perjalanan).',
  },
  {
    q: 'Bagaimana cara berkomunikasi dengan anggota trip?',
    a: 'Tab Chat di detail perjalanan adalah grup chat untuk semua anggota. Kamu bisa mengirim teks, foto, dan video, membalas pesan, serta menghapus pesan yang kamu kirim sendiri.',
  },
  {
    q: 'Bagaimana cara menambah foto atau video ke perjalanan?',
    a: 'Buka tab Media di detail perjalanan lalu tap tile unggah untuk memilih dari galeri. Media yang dikirim lewat chat juga otomatis tersimpan di tab Media. Kamu bisa menjadikan salah satu media sebagai cover perjalanan.',
  },
  {
    q: 'Bagaimana cara mengubah cover perjalanan?',
    a: 'Buka tab Media → tap "Jadikan Cover" pada foto/video yang diinginkan. Cover perjalanan juga bisa diambil dari thumbnail Google Maps atau galeri saat membuat aktivitas di Itinerary.',
  },
  {
    q: 'Apa itu Wishlist dan bagaimana mengubahnya jadi perjalanan?',
    a: 'Wishlist adalah daftar tempat/aktivitas yang ingin kamu kunjungi. Tap "Jadikan Perjalanan" pada item wishlist untuk langsung mengubahnya menjadi perjalanan baru — datanya (waktu, lokasi, link, catatan) otomatis menjadi aktivitas pertama di Itinerary.',
  },
  {
    q: 'Siapa yang bisa melihat perjalanan di profilku?',
    a: 'Grid perjalanan di profilmu menampilkan semua perjalanan yang kamu buat. Untuk pengguna lain, hanya perjalanan publik yang muncul di profil publik mereka — perjalanan privat hanya terlihat oleh kamu dan partisipan trip.',
  },
  {
    q: 'Bagaimana cara mengedit profil atau mengubah foto?',
    a: 'Buka Pengaturan → tap kartu profil di bagian atas. Di sana kamu bisa mengubah nama lengkap, bio, website/sosial media, dan foto profil.',
  },
  {
    q: 'Bagaimana cara menghapus akun?',
    a: 'Buka Pengaturan → Hapus Akun, ketik username kamu untuk konfirmasi, lalu tap Hapus Akun. Tindakan ini permanen dan tidak bisa dibatalkan — semua data akan hilang.',
  },
];

function FaqItem({ item, isOpen, onToggle }: { item: typeof FAQ_ITEMS[number]; isOpen: boolean; onToggle: () => void }) {
  return (
    <View>
      <TouchableOpacity style={styles.faqQuestion} onPress={onToggle} activeOpacity={0.7}>
        <Text style={styles.faqQuestionText}>{item.q}</Text>
        <ChevronDown
          size={18}
          color={colors.muted}
          style={isOpen ? { transform: [{ rotate: '180deg' }] } : undefined}
        />
      </TouchableOpacity>
      {isOpen && <Text style={styles.faqAnswer}>{item.a}</Text>}
    </View>
  );
}

export default function HelpFaqScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBackSmart(router)} style={styles.backBtn}>
          <ChevronLeft size={18} color={colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bantuan & FAQ</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.faqCard}>
          {FAQ_ITEMS.map((item, i) => (
            <React.Fragment key={i}>
              <FaqItem
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
              {i < FAQ_ITEMS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => openExternalLink(`mailto:${CONTACT_EMAIL}`)}
          activeOpacity={0.7}
        >
          <View style={styles.contactIconContainer}>
            <Mail size={18} color={colors.teal} />
          </View>
          <View>
            <Text style={styles.contactTitle}>Masih butuh bantuan?</Text>
            <Text style={styles.contactEmail}>{CONTACT_EMAIL}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.light },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.cardCompact,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    letterSpacing: -0.4,
    marginLeft: 12,
  },
  headerSpacer: { width: 36 },
  content: { padding: 8, paddingHorizontal: 22, paddingBottom: 24 },
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    ...shadows.cardCompact,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 16,
    gap: 12,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
    lineHeight: 19.6,
  },
  faqAnswer: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    lineHeight: 21.45,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: { height: 1, backgroundColor: colors.border },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    gap: 14,
    marginBottom: 24,
    ...shadows.cardCompact,
  },
  contactIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.teal,
  },
});

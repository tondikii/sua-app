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
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { ChevronDown } from '@/components/icons/ChevronDown';
import { Mail } from '@/components/icons/Mail';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

const FAQ_ITEMS = [
  {
    q: 'Bagaimana cara membuat perjalanan?',
    a: 'Tap tombol + di tengah tab bar, isi nama perjalanan dan kandidat tanggal, lalu tap Buat Perjalanan. Setelah itu kamu bisa undang teman atau lewati dulu.',
  },
  {
    q: 'Apa itu voting tanggal?',
    a: 'Semua anggota trip memilih tanggal yang cocok. Setelah voting selesai, tanggal pemenang dikunci dan bisa disinkronkan ke kalender.',
  },
  {
    q: 'Bagaimana cara mengundang teman?',
    a: 'Setelah buat perjalanan, atau dari detail perjalanan → tap ikon undang di header → cari username teman. Mereka akan melihat undangan di tab Undangan di Beranda.',
  },
  {
    q: 'Siapa yang bisa lihat perjalanan di profil?',
    a: 'Hanya perjalanan yang kamu tandai publik yang muncul di grid profil. Perjalanan privat hanya terlihat oleh kamu dan partisipan trip.',
  },
  {
    q: 'Bagaimana menghapus akun?',
    a: 'Buka Pengaturan → Hapus Akun. Kamu juga bisa mengajukan penghapusan lewat situs web kami.',
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
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

        <View style={styles.contactCard}>
          <View style={styles.contactIconContainer}>
            <Mail size={18} color={colors.teal} />
          </View>
          <View>
            <Text style={styles.contactTitle}>Masih butuh bantuan?</Text>
            <Text style={styles.contactEmail}>bantuan@aturperjalanan.id</Text>
          </View>
        </View>
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

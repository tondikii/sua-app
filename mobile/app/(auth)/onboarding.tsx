import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewToken,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

import { theme } from '../../src/theme';

const IMAGES = {
  intro: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=700&fit=crop&auto=format',
  voting: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&h=700&fit=crop&auto=format',
  itinerary:
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=700&fit=crop&auto=format',
  collaboration:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=700&fit=crop&auto=format',
};

interface SlideData {
  kind: 'intro' | 'pair';
  image: string;
  title: string;
  subtitle?: string;
  problem?: { title: string; body: string };
  solution?: { title: string; body: string };
  previewKind?: 'voting' | 'itinerary' | 'chat';
}

const SLIDES: SlideData[] = [
  {
    kind: 'intro',
    image: IMAGES.intro,
    title: 'Realisasikan Wacana Liburanmu',
    subtitle:
      'Janjian "nanti jalan-jalan" sering mandeg? Sepakat jadwal, susun aktivitas, dan update bareng — semuanya di satu trip.',
  },
  {
    kind: 'pair',
    image: IMAGES.voting,
    problem: {
      title: 'Sepakat Jadwal Susah Banget',
      body: 'Minggu ini sibuk, minggu depan juga — poll di chat udah puluhan, tapi tanggal liburan tetap nggak pernah keputusan.',
    },
    solution: {
      title: 'Vote Bareng, Hasil Jelas',
      body: 'Ajukan beberapa opsi tanggal, semua anggota vote di satu tempat, lihat mana yang paling banyak suara, lalu kunci.',
    },
    previewKind: 'voting',
    title: '',
  },
  {
    kind: 'pair',
    image: IMAGES.itinerary,
    problem: {
      title: 'Rencana Berserakan, Urutan Nggak Jelas',
      body: 'Link TikTok, pin Maps, catatan di Notes — semua ada, tapi nggak ada yang tahu jam berapa berangkat, ke mana dulu, dan makan di mana.',
    },
    solution: {
      title: 'Timeline Harian yang Jelas',
      body: 'Susun aktivitas berurutan per jam — urutan hari, waktu senggang, dan status jalan semua kelihatan sekilas tanpa tanya-tanya lagi.',
    },
    previewKind: 'itinerary',
    title: '',
  },
  {
    kind: 'pair',
    image: IMAGES.collaboration,
    problem: {
      title: 'Chat Trip Kecampur',
      body: 'Ngobrol soal trip masih lewat grup yang sama dengan chat harian — nggak ada ruang khusus, jadi pesan penting tenggelam dan foto liburan susah dilacak lagi.',
    },
    solution: {
      title: 'Ruang Diskusi Khusus Trip',
      body: 'Grup chat khusus anggota trip — ngobrol, kirim foto, dan semua media otomatis tersimpan rapi di satu tempat.',
    },
    previewKind: 'chat',
    title: '',
  },
];

function AppBadge() {
  return (
    <View style={styles.badgeRow}>
      <View style={styles.badgeIcon}>
        <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={10} stroke="white" strokeWidth={2} />
          <Path
            d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z"
            fill="white"
          />
        </Svg>
      </View>
      <Text style={styles.badgeLabel}>Atur Perjalanan</Text>
    </View>
  );
}

function MiniVotingPreview() {
  return (
    <View style={previewStyles.card}>
      <View style={previewStyles.cardHeader}>
        <View style={[previewStyles.typeIcon, { backgroundColor: theme.colors.coralLight }]}>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Rect x={3} y={3} width={18} height={18} rx={2} stroke={theme.colors.coral} strokeWidth={2} />
            <Path d="M3 9h18" stroke={theme.colors.coral} strokeWidth={2} />
            <Path d="M9 21V9" stroke={theme.colors.coral} strokeWidth={2} />
          </Svg>
        </View>
        <View style={previewStyles.cardHeaderText}>
          <Text style={previewStyles.cardTitle}>Tanggal Perjalanan</Text>
          <Text style={previewStyles.cardSub}>3 kandidat · tenggat 18 Jun</Text>
        </View>
      </View>
      {[
        { range: '20–22 Jun 2026', days: '3 hari · Mulai Jumat', votes: 4, voted: true },
        { range: '27–29 Jun 2026', days: '3 hari · Mulai Jumat', votes: 2, voted: false },
        { range: '4–6 Jul 2026', days: '3 hari · Mulai Jumat', votes: 1, voted: false },
      ].map((c, i) => (
        <View key={i} style={[previewStyles.candidateRow, c.voted && previewStyles.candidateVoted]}>
          <View style={{ flex: 1 }}>
            <Text style={previewStyles.candidateRange}>{c.range}</Text>
            <Text style={previewStyles.candidateDays}>{c.days}</Text>
          </View>
          <Text style={[previewStyles.voteBadge, c.voted && previewStyles.voteBadgeVoted]}>
            {c.votes} suara
          </Text>
          {c.voted ? (
            <Text style={previewStyles.votedLabel}>✓ Voted</Text>
          ) : (
            <Text style={previewStyles.voteBtn}>Vote</Text>
          )}
        </View>
      ))}
    </View>
  );
}

function MiniItineraryPreview() {
  return (
    <View style={previewStyles.card}>
      <Text style={previewStyles.summary}>21 aktivitas · 4 hari</Text>
      <View style={previewStyles.dayTabs}>
        {['Hari 1', 'Hari 2', 'Hari 3', 'Hari 4'].map((d, i) => (
          <View key={d} style={[previewStyles.dayTab, i === 0 && previewStyles.dayTabActive]}>
            <Text style={[previewStyles.dayTabLabel, i === 0 && previewStyles.dayTabLabelActive]}>
              {d}
            </Text>
          </View>
        ))}
      </View>
      <View style={previewStyles.dayHeader}>
        <Text style={previewStyles.dayLabel}>HARI 1</Text>
        <View style={previewStyles.dayMeta}>
          <Text style={previewStyles.dayDate}>19 Juni 2026</Text>
          <Text style={previewStyles.dayWindow}>07:00 – 24:00</Text>
        </View>
      </View>
      {[
        { time: '07:00–08:30', title: 'Titik kumpul — Terminal travel', state: 'past' },
        { time: '08:30–10:30', title: 'Perjalanan ke penginapan', state: 'past' },
        { time: '12:00–13:00', title: 'Makan siang — warung lokal', state: 'past' },
        { time: '14:00–16:30', title: 'Pantai Tiga Warna', state: 'present' },
        { time: '17:00–18:30', title: 'Bukit Merese — sunset', state: 'future' },
      ].map((item, i) => {
        const isPresent = item.state === 'present';
        const color = isPresent
          ? theme.colors.coral
          : item.state === 'past'
            ? theme.colors.muted
            : theme.colors.teal;
        return (
          <View key={i} style={previewStyles.activityRow}>
            <View style={[previewStyles.activityDot, { backgroundColor: color }]} />
            <View
              style={[
                previewStyles.activityCard,
                isPresent && { borderColor: theme.colors.coral, backgroundColor: theme.colors.coralLight },
              ]}
            >
              <Text style={[previewStyles.activityTime, isPresent && { color: theme.colors.coral }]}>
                {item.time}
              </Text>
              <Text style={previewStyles.activityName}>{item.title}</Text>
              {isPresent && <Text style={previewStyles.nowBadge}>Sekarang</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function MiniChatPreview() {
  return (
    <View style={[previewStyles.card, { backgroundColor: theme.colors.light }]}>
      <View style={previewStyles.chatReceived}>
        <View style={[previewStyles.chatAvatar, { backgroundColor: theme.colors.teal }]}>
          <Text style={previewStyles.chatAvatarText}>R</Text>
        </View>
        <View style={previewStyles.chatBubbleReceived}>
          <Text style={previewStyles.chatText}>
            Besok kita berangkat jam 7 ya? Jangan lupa check itinerary 📋
          </Text>
        </View>
      </View>
      <View style={previewStyles.chatSent}>
        <View style={previewStyles.chatBubbleSent}>
          <Text style={previewStyles.chatTextSent}>
            Siap! Undangan udah aku kirim ke yang belum join ✉️
          </Text>
        </View>
      </View>
      <View style={previewStyles.chatReceived}>
        <View style={[previewStyles.chatAvatar, { backgroundColor: theme.colors.coral }]}>
          <Text style={previewStyles.chatAvatarText}>B</Text>
        </View>
        <View style={previewStyles.chatBubbleReceived}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&h=120&fit=crop&auto=format',
            }}
            style={previewStyles.chatImage}
          />
          <Text style={previewStyles.chatText}>Referensi buat besok 📸</Text>
        </View>
      </View>
    </View>
  );
}

function SlidePreview({ kind }: { kind: string }) {
  switch (kind) {
    case 'voting':
      return <MiniVotingPreview />;
    case 'itinerary':
      return <MiniItineraryPreview />;
    case 'chat':
      return <MiniChatPreview />;
    default:
      return null;
  }
}

function IntroSlide({ slide }: { slide: SlideData }) {
  return (
    <View style={styles.slideContent}>
      <Text style={styles.eyebrowCoral}>Selamat datang</Text>
      <Text style={styles.slideTitle}>{slide.title}</Text>
      {slide.subtitle ? <Text style={styles.slideBody}>{slide.subtitle}</Text> : null}
    </View>
  );
}

function PairSlide({ slide }: { slide: SlideData }) {
  return (
    <View style={styles.slideContent}>
      <View style={{ marginBottom: 14 }}>
        <Text style={styles.eyebrowCoral}>MASALAH</Text>
        <Text style={styles.problemTitle}>{slide.problem?.title}</Text>
        <Text style={styles.problemBody}>{slide.problem?.body}</Text>
      </View>
      <View style={styles.gradientDivider} />
      <View>
        <Text style={styles.eyebrowTeal}>SOLUSI</Text>
        <Text style={styles.solutionTitle}>{slide.solution?.title}</Text>
        <Text style={styles.solutionBody}>{slide.solution?.body}</Text>
      </View>
      {slide.previewKind ? (
        <View style={{ marginTop: 12 }}>
          <SlidePreview kind={slide.previewKind} />
        </View>
      ) : null}
    </View>
  );
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = 280;

export default function Onboarding() {
  const [active, setActive] = useState(0);
  const flatListRef = useRef<FlatList<SlideData>>(null);
  const router = useRouter();
  const isLast = active === SLIDES.length - 1;

  const onViewableChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActive(viewableItems[0].index ?? 0);
    }
  }, []);

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const goNext = () => {
    if (isLast) {
      handleFinish();
    } else {
      goToSlide(active + 1);
    }
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem('has_completed_onboarding', 'true');
    router.replace('/(auth)/sign-in');
  };

  const renderSlide = ({ item }: { item: SlideData }) => (
    <View style={styles.slideContainer}>
      <View style={styles.heroContainer}>
        <Image source={{ uri: item.image }} style={styles.heroImage} />
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.98)']}
          style={styles.heroFade}
        />
        {item.kind === 'intro' && (
          <View style={styles.heroBadge}>
            <AppBadge />
          </View>
        )}
      </View>
      <View style={styles.slideScroll}>
        {item.kind === 'intro' ? <IntroSlide slide={item} /> : <PairSlide slide={item} />}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => goToSlide(i)}
              style={[styles.dot, i === active && styles.dotActive]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.cta} onPress={goNext} activeOpacity={0.9}>
          <Text style={styles.ctaText}>
            {isLast ? 'Mulai Sekarang' : 'Selanjutnya →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  heroContainer: {
    height: HERO_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#C9E8E6',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover' as const,
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  heroBadge: {
    position: 'absolute',
    top: 68,
    left: 24,
  },
  slideScroll: {
    flex: 1,
  },
  slideContent: {
    padding: 14,
    paddingHorizontal: 28,
    paddingBottom: 20,
  },
  eyebrowCoral: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.coral,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  eyebrowTeal: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.teal,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  slideTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.charcoal,
    letterSpacing: -0.4,
    lineHeight: 26,
    marginBottom: 8,
  },
  slideBody: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: theme.colors.muted,
    lineHeight: 22,
  },
  problemTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.charcoal,
    marginBottom: 3,
    lineHeight: 18,
  },
  problemBody: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: theme.colors.muted,
    lineHeight: 17,
  },
  solutionTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.charcoal,
    marginBottom: 3,
    lineHeight: 18,
  },
  solutionBody: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: theme.colors.muted,
    lineHeight: 17,
    marginBottom: 12,
  },
  gradientDivider: {
    height: 1,
    marginBottom: 14,
    backgroundColor: theme.colors.border,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeIcon: {
    width: 34,
    height: 34,
    backgroundColor: theme.colors.coral,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.33,
    shadowRadius: 18,
    elevation: 5,
  },
  badgeLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.charcoal,
  },
  footer: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 28,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 7,
    marginBottom: 16,
  },
  dot: {
    width: 7,
    height: 7,
    backgroundColor: theme.colors.border,
    borderRadius: 20,
  },
  dotActive: {
    width: 22,
    backgroundColor: theme.colors.coral,
  },
  cta: {
    height: 52,
    backgroundColor: theme.colors.coral,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.coral,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.27,
    shadowRadius: 26,
    elevation: 6,
  },
  ctaText: {
    color: theme.colors.white,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});

const previewStyles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  typeIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.charcoal,
  },
  cardSub: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: theme.colors.muted,
    marginTop: 1,
  },
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.light,
    borderRadius: 8,
    padding: 6,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  candidateVoted: {
    backgroundColor: theme.colors.coralLight,
    borderWidth: 1.5,
    borderColor: theme.colors.coral,
  },
  candidateRange: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.charcoal,
  },
  candidateDays: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: theme.colors.muted,
    marginTop: 1,
  },
  voteBadge: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: theme.colors.muted,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 20,
    marginRight: 6,
  },
  voteBadgeVoted: {
    color: theme.colors.coral,
    backgroundColor: theme.colors.coralLight,
  },
  votedLabel: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: theme.colors.teal,
  },
  voteBtn: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: theme.colors.muted,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summary: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: theme.colors.muted,
    marginBottom: 6,
  },
  dayTabs: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 6,
  },
  dayTab: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: theme.colors.light,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dayTabActive: {
    backgroundColor: theme.colors.coralLight,
    borderColor: theme.colors.coral,
  },
  dayTabLabel: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: theme.colors.muted,
  },
  dayTabLabelActive: {
    color: theme.colors.coral,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
  },
  dayHeader: {
    marginBottom: 5,
  },
  dayLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.coral,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  dayMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayDate: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.charcoal,
  },
  dayWindow: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: theme.colors.muted,
    backgroundColor: theme.colors.light,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activityRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  activityCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 7,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
  },
  activityTime: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: theme.colors.muted,
  },
  activityName: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.charcoal,
    lineHeight: 13,
  },
  nowBadge: {
    fontSize: 6,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: theme.colors.coral,
    backgroundColor: theme.colors.coralLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 5,
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  chatReceived: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginBottom: 8,
  },
  chatAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatAvatarText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.white,
  },
  chatBubbleReceived: {
    maxWidth: '75%',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    borderBottomLeftRadius: 4,
    padding: 7,
    paddingHorizontal: 10,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  chatBubbleSent: {
    maxWidth: '72%',
    backgroundColor: theme.colors.coral,
    borderRadius: 12,
    borderBottomRightRadius: 4,
    padding: 7,
    paddingHorizontal: 10,
    alignSelf: 'flex-end',
    shadowColor: theme.colors.coral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  chatSent: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  chatText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: theme.colors.charcoal,
    lineHeight: 15,
  },
  chatTextSent: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: theme.colors.white,
    lineHeight: 15,
  },
  chatImage: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    marginBottom: 4,
    resizeMode: 'cover' as const,
  },
});

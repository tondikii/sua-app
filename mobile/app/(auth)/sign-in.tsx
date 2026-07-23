import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';

import { useAuth } from '../../src/auth/AuthProvider';
import { useGoogleAuth } from '../../src/hooks/useGoogleAuth';
import { theme } from '../../src/theme';

function GoogleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="white"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="rgba(255,255,255,0.85)"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="rgba(255,255,255,0.7)"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="rgba(255,255,255,0.9)"
      />
    </Svg>
  );
}

function CompassIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke="white" strokeWidth={2} />
      <Polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="white" />
    </Svg>
  );
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=700&fit=crop&auto=format';

export default function SignIn() {
  const { signInGoogle, isNewUser, isAuthenticated } = useAuth();
  const { promptAsync, idToken, configured } = useGoogleAuth();
  const router = useRouter();
  const signingInRef = useRef(false);

  useEffect(() => {
    if (idToken && !signingInRef.current) {
      signingInRef.current = true;
      (async () => {
        try {
          await signInGoogle(idToken);
        } catch {
          Alert.alert('Gagal Masuk', 'Autentikasi Google gagal. Coba lagi.');
        } finally {
          signingInRef.current = false;
        }
      })();
    }
  }, [idToken, signInGoogle]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(isNewUser ? '/(auth)/username-setup' : '/(tabs)/');
    }
  }, [isAuthenticated, isNewUser, router]);

  const handleGoogleSignIn = async () => {
    if (!configured) {
      Alert.alert(
        'Belum Dikonfigurasi',
        'Google Sign-In belum dikonfigurasi. Tambahkan EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID / EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ke .env.',
      );
      return;
    }
    await promptAsync();
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} />
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.30)',
            'rgba(0,0,0,0.05)',
            'rgba(255,255,255,0.85)',
            'rgba(255,255,255,1)',
          ]}
          locations={[0, 0.45, 0.88, 1]}
          style={styles.heroOverlay}
        />
        <View style={styles.heroBrand}>
          <View style={styles.logoBox}>
            <CompassIcon />
          </View>
          <Text style={styles.heroTitle}>Atur Perjalanan</Text>
          <Text style={styles.heroTagline}>Rencanakan. Jelajahi. Kenang.</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.bottom}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.bottomContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Mulai Perjalananmu</Text>
          <Text style={styles.description}>
            Bergabung dan rencanakan perjalanan seru bersama orang-orang tersayang.
          </Text>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.9}
          >
            <GoogleIcon />
            <Text style={styles.googleButtonText}>Lanjutkan dengan Google</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email login — hidden in MVP per PRD §1.3 */}
          {false && (
            <TouchableOpacity style={styles.emailButton} activeOpacity={0.85}>
              <Text style={styles.emailButtonText}>Masuk dengan Email</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.legal}>
            Dengan melanjutkan, kamu menyetujui{' '}
            <Text style={styles.legalLink}>Syarat & Ketentuan</Text> serta{' '}
            <Text style={styles.legalLink}>Kebijakan Privasi</Text> kami.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const { width: screenWidth } = Dimensions.get('window');
const heroHeight = screenWidth > 430 ? 430 * 0.46 : screenWidth * 0.46;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  hero: {
    height: heroHeight,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#D4C8BC',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover' as const,
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
  },
  heroBrand: {
    position: 'absolute',
    top: 68,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 52,
    height: 52,
    backgroundColor: theme.colors.coral,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.coral,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38,
    shadowRadius: 28,
    elevation: 8,
  },
  heroTitle: {
    color: theme.colors.white,
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  heroTagline: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  bottom: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  bottomContent: {
    padding: 22,
    paddingTop: 22,
    paddingBottom: 34,
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.charcoal,
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: theme.colors.muted,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 21,
  },
  googleButton: {
    width: '100%',
    height: 52,
    backgroundColor: theme.colors.coral,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: theme.colors.coral,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.27,
    shadowRadius: 28,
    elevation: 6,
  },
  googleButtonText: {
    color: theme.colors.white,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: theme.colors.mutedLight,
  },
  emailButton: {
    width: '100%',
    height: 48,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailButtonText: {
    color: theme.colors.charcoal,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  legal: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: theme.colors.mutedLight,
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 18,
  },
  legalLink: {
    color: theme.colors.coral,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});

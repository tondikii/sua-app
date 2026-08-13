import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { useToast } from '../../src/components/Toast';
import { ApiError } from '../../src/api/client';
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
  const { signInGoogle, isNewUser, isAuthenticated, isSigningOut } = useAuth();
  const { promptAsync, loading, idToken, error, configured } = useGoogleAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const signingInRef = useRef(false);
  const [signingIn, setSigningIn] = useState(false);

  // Native flow: promptAsync resolves the id_token directly.
  // Web flow: id_token arrives via the URL hash and is picked up below.
  const handleGoogleSignIn = async () => {
    if (!configured) {
      showToast('Masuk Google belum siap nih. Hubungi developer atau coba lagi nanti.');
      return;
    }
    if (Platform.OS === 'web') {
      await promptAsync();
      return;
    }
    const token = await promptAsync();
    if (!token || signingInRef.current) return;
    signingInRef.current = true;
    setSigningIn(true);
    try {
      await signInGoogle(token);
    } catch (err) {
      console.log('Sign-in error:', err);
      if (err instanceof ApiError && err.code === 'USER_LIMIT_REACHED') {
        showToast('Ups, kapasitas pengguna lagi penuh nih. Coba lagi nanti ya.');
      } else {
        showToast('Gagal masuk pakai Google. Coba lagi ya.');
      }
    } finally {
      signingInRef.current = false;
      setSigningIn(false);
    }
  };

  // Web flow: exchange the id_token captured from the URL hash.
  useEffect(() => {
    if (idToken && !signingInRef.current) {
      signingInRef.current = true;
      setSigningIn(true);
      (async () => {
        try {
          await signInGoogle(idToken);
        } catch (err) {
          if (err instanceof ApiError && err.code === 'USER_LIMIT_REACHED') {
            showToast('Ups, kapasitas pengguna lagi penuh nih. Coba lagi nanti ya.');
          } else {
            showToast('Gagal masuk pakai Google. Coba lagi ya.');
          }
        } finally {
          signingInRef.current = false;
          setSigningIn(false);
        }
      })();
    }
  }, [idToken, signInGoogle, showToast]);

  useEffect(() => {
    if (error) {
      showToast(error.message || 'Gagal masuk pakai Google. Coba lagi ya.');
    }
  }, [error, showToast]);

  // Auto-redirect after a successful sign-in. Guard `isSigningOut` so a sign-out
  // in flight (state not committed yet) never bounces the user back to (tabs).
  useEffect(() => {
    if (isAuthenticated && !isSigningOut) {
      router.replace(isNewUser ? '/(auth)/username-setup' : '/(tabs)');
    }
  }, [isAuthenticated, isNewUser, isSigningOut, router]);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} />
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.15)',
            'rgba(0,0,0,0.03)',
            'rgba(255,255,255,0.55)',
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
          <Text style={styles.heading}>Atur Perjalananmu</Text>
          <Text style={styles.description}>
            Atur perjalanan bareng teman-temanmu di satu tempat — dari rencana sampai jadwal harian.
          </Text>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.9}
            disabled={loading || signingIn}
          >
            {loading || signingIn ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <GoogleIcon />
            )}
            <Text style={styles.googleButtonText}>
              {loading || signingIn ? 'Sebentar...' : 'Lanjutkan dengan Google'}
            </Text>
          </TouchableOpacity>

          {/* Email login — hidden in MVP per PRD §1.3 */}
          {false && (
            <TouchableOpacity style={styles.emailButton} activeOpacity={0.85}>
              <Text style={styles.emailButtonText}>Masuk dengan Email</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.legal}>
            Dengan lanjut, kamu setuju sama <Text style={styles.legalLink}>Syarat & Ketentuan</Text>{' '}
            dan <Text style={styles.legalLink}>Kebijakan Privasi</Text> kami.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {signingIn && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={theme.colors.coral} />
            <Text style={styles.loadingText}>Sedang masuk…</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const { width: screenWidth } = Dimensions.get('window');
const heroHeight = screenWidth > 430 ? 430 * 0.56 : screenWidth * 0.56;

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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 3,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  loadingCard: {
    alignItems: 'center',
    gap: 14,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: theme.colors.charcoal,
  },
});

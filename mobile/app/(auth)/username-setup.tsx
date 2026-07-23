import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';

import { apiClient } from '../../src/api/client';
import { useAuth } from '../../src/auth/AuthProvider';
import { theme } from '../../src/theme';

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

type FieldState = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

function AtSign() {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={theme.colors.muted}
      strokeWidth={2.5}
      strokeLinecap="round"
    >
      <Circle cx={12} cy={12} r={4} />
      <Path d="M16 12v1a3 3 0 006 0v-1a10 10 0 10-3.5 7.5" />
    </Svg>
  );
}

function CheckCircle() {
  return (
    <Svg
      width={17}
      height={17}
      viewBox="0 0 24 24"
      fill="none"
      stroke={theme.colors.teal}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx={12} cy={12} r={10} />
      <Path d="M8 12l3 3 5-5" />
    </Svg>
  );
}

function XCircle() {
  return (
    <Svg
      width={17}
      height={17}
      viewBox="0 0 24 24"
      fill="none"
      stroke={theme.colors.danger}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx={12} cy={12} r={10} />
      <Path d="M15 9l-6 6M9 9l6 6" />
    </Svg>
  );
}

function generateSuggestions(name: string): string[] {
  const base = name.toLowerCase().replace(/\s+/g, '_').slice(0, 20);
  const suggestions: string[] = [];
  if (base.length >= 3) {
    suggestions.push(base);
  }
  suggestions.push(`${base}_travel`.slice(0, 30));
  if (base.length > 0) {
    const parts = base.split('_').filter(Boolean);
    if (parts.length > 1) {
      suggestions.push(`${parts[0]}_explore`.slice(0, 30));
      suggestions.push(`${parts[0]}_${parts[parts.length - 1]}`.slice(0, 30));
    }
  }
  return [...new Set(suggestions.filter((s) => s.length >= 3))].slice(0, 3);
}

export default function UsernameSetup() {
  const { user, completeRegistration } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [fieldState, setFieldState] = useState<FieldState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const suggestions = user?.name ? generateSuggestions(user.name) : [];

  const validateUsername = useCallback(async (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value) {
      setFieldState('idle');
      setErrorMessage('');
      return;
    }

    if (!USERNAME_REGEX.test(value)) {
      setFieldState('invalid');
      setErrorMessage('Huruf, angka, dan underscore (_) · min. 3 karakter');
      return;
    }

    setFieldState('checking');

    debounceRef.current = setTimeout(async () => {
      try {
        const { available } = await apiClient.get<{ available: boolean }>(
          `/users/check-username?username=${encodeURIComponent(value)}`,
          false,
        );
        if (!mountedRef.current) return;
        if (available) {
          setFieldState('available');
          setErrorMessage('');
        } else {
          setFieldState('taken');
          setErrorMessage('Username sudah digunakan. Coba yang lain.');
        }
      } catch {
        if (!mountedRef.current) return;
        setFieldState('taken');
        setErrorMessage('Gagal memeriksa username. Coba lagi.');
      }
    }, 300);
  }, []);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^a-zA-Z0-9_]/g, '');
    setUsername(cleaned);
    validateUsername(cleaned);
  };

  const handleSubmit = async () => {
    if (fieldState !== 'available') return;
    setSubmitting(true);
    try {
      await completeRegistration(username);
      router.replace('/(tabs)');
    } catch {
      setSubmitting(false);
    }
  };

  const isCtaDisabled =
    submitting ||
    !username ||
    fieldState === 'idle' ||
    fieldState === 'checking' ||
    fieldState === 'invalid' ||
    fieldState === 'taken';

  const borderColor =
    fieldState === 'available'
      ? theme.colors.teal
      : fieldState === 'invalid' || fieldState === 'taken'
        ? theme.colors.danger
        : fieldState === 'checking'
          ? theme.colors.teal
          : theme.colors.border;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.spacer} />

      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Buat username</Text>
        <Text style={styles.description}>
          Ini nama yang akan dilihat teman saat kamu diundang ke perjalanan.
        </Text>

        <Text style={styles.label}>Username</Text>
        <View style={[styles.inputContainer, { borderColor }]}>
          <AtSign />
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={handleChange}
            placeholder=""
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={30}
            editable={!submitting}
          />
          {fieldState === 'available' && <CheckCircle />}
          {fieldState === 'checking' && (
            <ActivityIndicator size="small" color={theme.colors.teal} />
          )}
          {(fieldState === 'invalid' || fieldState === 'taken') && <XCircle />}
        </View>

        {fieldState === 'available' && <Text style={styles.availableText}>Username tersedia</Text>}
        {errorMessage && fieldState !== 'available' && (
          <Text style={[styles.errorText, fieldState === 'invalid' ? styles.hintText : undefined]}>
            {errorMessage}
          </Text>
        )}
        {fieldState === 'idle' && (
          <Text style={styles.hintText}>Huruf, angka, dan underscore (_) · min. 3 karakter</Text>
        )}

        {suggestions.length > 0 && (
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsLabel}>Saran</Text>
            <View style={styles.chips}>
              {suggestions.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.chip}
                  onPress={() => {
                    setUsername(s);
                    validateUsername(s);
                  }}
                  disabled={submitting}
                >
                  <Text style={styles.chipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.cta, isCtaDisabled && styles.ctaDisabled]}
          onPress={handleSubmit}
          disabled={isCtaDisabled}
          activeOpacity={0.9}
        >
          {submitting ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <Text style={[styles.ctaText, isCtaDisabled && styles.ctaTextDisabled]}>Lanjutkan</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  spacer: {
    height: 60,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: theme.colors.charcoal,
    letterSpacing: -0.5,
    lineHeight: 30,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: theme.colors.muted,
    lineHeight: 22,
    marginBottom: 28,
  },
  label: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: theme.colors.charcoal,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: theme.colors.charcoal,
    padding: 0,
  },
  availableText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: theme.colors.teal,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: theme.colors.danger,
    marginTop: 8,
  },
  hintText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: theme.colors.mutedLight,
    marginTop: 6,
    lineHeight: 18,
  },
  suggestions: {
    marginTop: 24,
  },
  suggestionsLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: theme.colors.muted,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.light,
    borderRadius: 10,
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: theme.colors.charcoal,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
  },
  cta: {
    width: '100%',
    height: 52,
    backgroundColor: theme.colors.coral,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.coral,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 26,
    elevation: 6,
  },
  ctaDisabled: {
    backgroundColor: theme.colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: theme.colors.white,
  },
  ctaTextDisabled: {
    color: theme.colors.mutedLight,
  },
});

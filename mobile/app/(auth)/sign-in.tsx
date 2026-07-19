import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../../src/auth/AuthProvider';
import { theme } from '../../src/theme';

export default function SignIn() {
  const { signInGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    // TODO (M12): open Google Sign-In via expo-auth-session, then pass the
    // returned ID token to signInGoogle(idToken).
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Atur Perjalanan</Text>
        <Text style={styles.tagline}>Rencanakan. Jelajahi. Kenang.</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGoogleSignIn}
        disabled={loading}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <Text style={styles.buttonText}>Lanjutkan dengan Google</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: 96,
    paddingBottom: 48,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.coral,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
  button: {
    backgroundColor: theme.colors.coral,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    ...theme.shadows.button,
  },
  buttonText: {
    ...theme.typography.h3,
    color: theme.colors.white,
  },
});

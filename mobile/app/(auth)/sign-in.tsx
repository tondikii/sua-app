import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { apiClient } from '../../src/api/client';

export default function SignIn() {
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleGoogleSignIn = async () => {
    // TODO (M12): Integrate expo-auth-session Google OAuth
    // For now this is a placeholder — the backend POST /v1/auth/google is ready
    console.log('Google Sign-In — implement in M12');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atur Perjalanan</Text>
      <Text style={styles.tagline}>Rencanakan. Jelajahi. Kenang.</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
        <Text style={styles.buttonText}>Lanjutkan dengan Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#FF6B6B', marginBottom: 8 },
  tagline: { fontSize: 14, color: '#9091A0', marginBottom: 48 },
  button: { backgroundColor: '#FF6B6B', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

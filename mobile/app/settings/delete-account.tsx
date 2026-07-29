import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthProvider';
import { useDeleteAccount } from '@/features/users/hooks/useDeleteAccount';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { UserX } from '@/components/icons/UserX';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

const webOutlineNone = Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {};

export default function DeleteAccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const deleteAccount = useDeleteAccount();
  const [confirmText, setConfirmText] = useState('');

  const canDelete = confirmText.trim() === (user?.username ?? '');

  const handleDelete = useCallback(() => {
    if (!canDelete) return;
    Alert.alert(
      'Hapus Akun?',
      'Tindakan ini tidak bisa dibatalkan. Semua data akan hilang permanen.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => deleteAccount.mutate(),
        },
      ],
    );
  }, [canDelete, deleteAccount]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={18} color={colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hapus Akun</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningCard}>
          <View style={styles.iconContainer}>
            <UserX size={28} color={colors.muted} />
          </View>
          <Text style={styles.warningTitle}>Hapus akun permanen?</Text>
          <Text style={styles.warningDesc}>
            Profil, perjalanan, wishlist, dan data lainnya akan dihapus dan tidak bisa dipulihkan.
          </Text>
        </View>

        <View style={styles.confirmSection}>
          <Text style={styles.confirmLabel}>Ketik username untuk konfirmasi</Text>
          <TextInput
            style={[styles.confirmInput, webOutlineNone]}
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder={user?.username ?? ''}
            placeholderTextColor={colors.mutedLight}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.deleteBtn, !canDelete && styles.deleteBtnDisabled]}
          onPress={handleDelete}
          disabled={!canDelete || deleteAccount.isPending}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteBtnText}>
            {deleteAccount.isPending ? 'Menghapus...' : 'Hapus Akun'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.cancelBtnText}>Batal</Text>
        </TouchableOpacity>
      </View>
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
  warningCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    ...shadows.card,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: 'center',
  },
  warningDesc: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    lineHeight: 20.8,
    textAlign: 'center',
  },
  confirmSection: { marginTop: 20 },
  confirmLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
    marginBottom: 8,
  },
  confirmInput: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 13,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.charcoal,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.cardCompact,
  },
  footer: {
    padding: 16,
    paddingHorizontal: 22,
    paddingBottom: 32,
    backgroundColor: colors.light,
  },
  deleteBtn: {
    width: '100%',
    height: 50,
    backgroundColor: colors.danger,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.dangerDark,
    marginBottom: 10,
  },
  deleteBtnDisabled: { opacity: 0.5 },
  deleteBtnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.white,
  },
  cancelBtn: {
    width: '100%',
    height: 48,
    backgroundColor: colors.white,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.cardCompact,
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.charcoal,
  },
});

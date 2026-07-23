import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthProvider';
import { useUpdateProfile } from '@/features/users/hooks/useUpdateProfile';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { avatarColorFor } from '@/theme/colors';

type SettingsView = 'main' | 'edit';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const updateProfile = useUpdateProfile();

  const [view, setView] = useState<SettingsView>('main');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [website, setWebsite] = useState(user?.website_url ?? '');

  const handleSave = useCallback(async () => {
    try {
      await updateProfile.mutateAsync({ bio: bio.trim() || undefined, website_url: website.trim() || undefined });
      setView('main');
    } catch {
      Alert.alert('Gagal', 'Tidak dapat menyimpan profil');
    }
  }, [bio, website, updateProfile]);

  const handleSignOut = useCallback(() => {
    Alert.alert('Keluar?', 'Kamu akan keluar dari akun di perangkat ini.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: () => signOut() },
    ]);
  }, [signOut]);

  // Edit profile view
  if (view === 'edit') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setView('main')} style={styles.headerBtn}>
            <ChevronLeft size={20} color={colors.charcoal} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profil</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Simpan</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.editContent}>
          {/* Avatar */}
          <View style={styles.editAvatarSection}>
            <View style={styles.editAvatar}>
              {user?.avatar_url ? (
                <Image source={{ uri: user.avatar_url }} style={styles.editAvatarImg} />
              ) : (
                <View style={[styles.editAvatarFallback, { backgroundColor: avatarColorFor(user?.username ?? 'x') }]}>
                  <Text style={styles.editAvatarLetter}>{(user?.name ?? '?').charAt(0)}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity>
              <Text style={styles.changePhotoText}>Ubah Foto Profil</Text>
            </TouchableOpacity>
          </View>

          {/* Name (read-only) */}
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Nama Lengkap</Text>
            <Text style={styles.editReadOnly}>{user?.name ?? ''}</Text>
          </View>

          {/* Username (read-only) */}
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Username</Text>
            <Text style={styles.editReadOnly}>@{user?.username ?? ''}</Text>
          </View>

          {/* Bio */}
          <View style={styles.editField}>
            <View style={styles.editLabelRow}>
              <Text style={styles.editLabel}>Bio</Text>
              <Text style={styles.editCounter}>{bio.length} / 150</Text>
            </View>
            <TextInput
              style={[styles.editInput, styles.editTextArea]}
              value={bio}
              onChangeText={(t) => setBio(t.slice(0, 150))}
              placeholder="Ceritakan tentang dirimu..."
              placeholderTextColor={colors.mutedLight}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Website */}
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Website / Sosial Media</Text>
            <TextInput
              style={styles.editInput}
              value={website}
              onChangeText={setWebsite}
              placeholder="instagram.com/username"
              placeholderTextColor={colors.mutedLight}
              autoCapitalize="none"
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // Main settings
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ChevronLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.menuContent}>
        {/* Profile card */}
        <TouchableOpacity style={styles.profileCard} onPress={() => setView('edit')} activeOpacity={0.7}>
          <View style={styles.menuAvatar}>
            {user?.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={styles.menuAvatarImg} />
            ) : (
              <View style={[styles.menuAvatarFallback, { backgroundColor: avatarColorFor(user?.username ?? 'x') }]}>
                <Text style={styles.menuAvatarLetter}>{(user?.name ?? '?').charAt(0)}</Text>
              </View>
            )}
          </View>
          <View style={styles.menuProfileInfo}>
            <Text style={styles.menuProfileName}>{user?.name}</Text>
            <Text style={styles.menuProfileUsername}>@{user?.username}</Text>
          </View>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>

        {/* Help section */}
        <Text style={styles.sectionLabel}>BANTUAN & LEGAL</Text>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <Text style={styles.menuItemText}>Bantuan & FAQ</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <Text style={styles.menuItemText}>Kebijakan Privasi</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <Text style={styles.menuItemText}>Syarat & Ketentuan</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>

        {/* Account section */}
        <Text style={styles.sectionLabel}>AKUN</Text>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <Text style={[styles.menuItemText, { color: colors.danger }]}>Hapus Akun</Text>
          <Text style={styles.menuChevron}>›</Text>
        </TouchableOpacity>

        {/* Sign out */}
        <View style={styles.signOutCard}>
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.7}>
            <Text style={styles.signOutText}>Keluar</Text>
            <Text style={styles.signOutSub}>Keluar dari akun di perangkat ini</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Atur Perjalanan · v2.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.light },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, textAlign: 'center' },
  saveBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  saveBtnText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  menuContent: { padding: 16, paddingBottom: 40, gap: 12 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 18, padding: 14, gap: 12 },
  menuAvatar: { width: 48, height: 48, borderRadius: 14, overflow: 'hidden' },
  menuAvatarImg: { width: '100%', height: '100%', borderRadius: 14 },
  menuAvatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  menuAvatarLetter: { fontSize: 18, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  menuProfileInfo: { flex: 1 },
  menuProfileName: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  menuProfileUsername: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted },
  menuChevron: { fontSize: 22, color: colors.mutedLight },
  sectionLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.muted, marginTop: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 16, padding: 14, gap: 12 },
  menuItemText: { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.charcoal },
  signOutCard: { marginTop: 8 },
  signOutBtn: { backgroundColor: colors.white, borderRadius: 16, padding: 14 },
  signOutText: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  signOutSub: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted, marginTop: 2 },
  versionText: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.mutedLight, textAlign: 'center', marginTop: 24 },
  // Edit
  editContent: { padding: 16, paddingBottom: 40, gap: 16 },
  editAvatarSection: { alignItems: 'center', gap: 8, marginBottom: 8 },
  editAvatar: { width: 84, height: 84, borderRadius: 28, overflow: 'hidden' },
  editAvatarImg: { width: '100%', height: '100%', borderRadius: 28 },
  editAvatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 28 },
  editAvatarLetter: { fontSize: 32, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  changePhotoText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.coral },
  editField: { gap: 6 },
  editLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  editLabel: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  editCounter: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted },
  editReadOnly: { fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted, backgroundColor: colors.light, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13 },
  editInput: { backgroundColor: colors.white, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal, borderWidth: 1.5, borderColor: colors.border },
  editTextArea: { minHeight: 80 },
});

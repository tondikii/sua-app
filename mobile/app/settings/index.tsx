import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Platform,
  ActivityIndicator,
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/AuthProvider';
import { useTheme, useThemeContext } from '@/theme';
import { useUpdateProfile } from '@/features/users/hooks/useUpdateProfile';
import { useAvatarUpload } from '@/features/users/hooks/useAvatarUpload';
import { useToast } from '@/components/Toast';
import { ConfirmModal } from '@/components/ConfirmModal';
import { FocusedTextInput } from '@/components/FocusedTextInput';
import { goBackSmart } from '@/lib/navigation';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { ChevronRight } from '@/components/icons/ChevronRight';
import { HelpCircle } from '@/components/icons/HelpCircle';
import { FileText } from '@/components/icons/FileText';
import { UserX } from '@/components/icons/UserX';
import { LogOut } from '@/components/icons/LogOut';
import { Globe } from '@/components/icons/Globe';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';
import { avatarColorFor } from '@/theme/colors';

type SettingsView = 'main' | 'edit';

const webOutlineNone = Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {};

function SettingsRow({ icon, iconBg, label, sub, subColor, chevronColor, onPress }: {
  icon: React.ReactNode; iconBg: string; label: string; sub: string; subColor?: string; chevronColor?: string; onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIconContainer, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.menuRowText}>
        <Text style={styles.menuRowLabel}>{label}</Text>
        <Text style={[styles.menuRowSub, subColor ? { color: subColor } : undefined]}>{sub}</Text>
      </View>
      <ChevronRight size={16} color={chevronColor ?? colors.mutedLight} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { scheme, toggleScheme, isHydrated: themeHydrated } = useThemeContext();
  const { colors: c } = useTheme();
  const updateProfile = useUpdateProfile();
  const avatarUpload = useAvatarUpload();
  const { showToast } = useToast();

  const [view, setView] = useState<SettingsView>('main');
  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [website, setWebsite] = useState(user?.website_url ?? '');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  // Picked-but-not-saved avatar: { uri } for preview, plus blob/type for the
  // actual upload that happens only when "Simpan Perubahan" is pressed.
  const [avatarDraft, setAvatarDraft] = useState<{
    uri: string;
    blob: Blob;
    contentType: string;
  } | null>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      showToast('Nama lengkap wajib diisi');
      return;
    }
    setSavingAvatar(true);
    try {
      let avatarUrl: string | undefined;
      // Upload the drafted avatar only now — profile is not changed until save.
      if (avatarDraft) {
        const profile = await avatarUpload.uploadAvatar(avatarDraft.blob, avatarDraft.contentType);
        avatarUrl = profile.avatar_url ?? undefined;
      }
      await updateProfile.mutateAsync({
        name: name.trim(),
        bio: bio.trim() || undefined,
        website_url: website.trim() || undefined,
      });
      setAvatarDraft(null);
      setView('main');
      if (avatarUrl) showToast('Foto profil diperbarui');
    } catch {
      showToast('Tidak dapat menyimpan profil');
    } finally {
      setSavingAvatar(false);
    }
  }, [name, bio, website, avatarDraft, avatarUpload, updateProfile, showToast]);

  const handleSignOut = useCallback(() => {
    setShowSignOutConfirm(true);
  }, []);

  const handleConfirmSignOut = useCallback(async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.replace('/(auth)/sign-in');
    } finally {
      setSigningOut(false);
      setShowSignOutConfirm(false);
    }
  }, [signOut, router]);

  const handlePickAvatar = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    try {
      let blob: Blob;
      if (Platform.OS === 'web' && asset.file) {
        blob = asset.file;
      } else {
        const res = await fetch(asset.uri);
        blob = await res.blob();
      }
      const contentType = asset.mimeType ?? 'image/jpeg';
      // Only preview locally — upload happens on "Simpan Perubahan".
      setAvatarDraft({ uri: asset.uri, blob, contentType });
    } catch {
      showToast('Tidak dapat membaca foto yang dipilih');
    }
  }, [showToast]);

  // Edit profile view
  if (view === 'edit') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setView('main')} style={styles.headerBtn}>
            <ChevronLeft size={18} color={colors.charcoal} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profil</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Simpan</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.editContent} showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.editAvatarSection}>
            <View style={styles.editAvatar}>
              {avatarDraft ? (
                <Image source={{ uri: avatarDraft.uri }} style={styles.editAvatarImg} />
              ) : user?.avatar_url ? (
                <Image source={{ uri: user.avatar_url }} style={styles.editAvatarImg} />
              ) : (
                <View style={[styles.editAvatarFallback, { backgroundColor: avatarColorFor(user?.username ?? 'x') }]}>
                  <Text style={styles.editAvatarLetter}>{(user?.name ?? '?').charAt(0)}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.7}>
              <Text style={styles.changePhotoText}>
                {avatarDraft ? 'Ganti Foto' : 'Ubah Foto Profil'}
              </Text>
            </TouchableOpacity>
            {avatarDraft && (
              <Text style={styles.avatarDraftHint}>Foto akan disimpan saat kamu menekan "Simpan Perubahan".</Text>
            )}
          </View>

          {/* Name (editable) */}
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Nama Lengkap</Text>
            <FocusedTextInput
              style={styles.editFieldInputContainer}
              value={name}
              onChangeText={setName}
              placeholder="Nama lengkap kamu"
              placeholderTextColor={colors.mutedLight}
              autoCapitalize="words"
            />
          </View>

          {/* Username (read-only) */}
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Username</Text>
            <View style={styles.editInputRow}>
              <Text style={styles.editInputIconText}>@</Text>
              <Text style={styles.editInputText}>{user?.username ?? ''}</Text>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.editField}>
            <View style={styles.editLabelRow}>
              <Text style={styles.editLabel}>Bio</Text>
              <Text style={styles.editCounter}>{bio.length} / 150</Text>
            </View>
            <View style={[styles.editInputRow, styles.editTextAreaRow, focusedField === 'bio' && styles.editInputRowFocused]}>
              <Text style={[styles.editInputIconText, { marginTop: 2, flexShrink: 0 }]}>≡</Text>
              <TextInput
                style={[styles.editTextAreaInput, webOutlineNone]}
                value={bio}
                onChangeText={(t) => setBio(t.slice(0, 150))}
                onFocus={() => setFocusedField('bio')}
                onBlur={() => setFocusedField(null)}
                placeholder="Ceritakan tentang dirimu..."
                placeholderTextColor={colors.mutedLight}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Website */}
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Website / Sosial Media</Text>
            <View style={[styles.editInputRow, focusedField === 'website' && styles.editInputRowFocused]}>
              <Globe size={16} color={colors.muted} />
              <TextInput
                style={[styles.editFieldInput, webOutlineNone]}
                value={website}
                onChangeText={setWebsite}
                onFocus={() => setFocusedField('website')}
                onBlur={() => setFocusedField(null)}
                placeholder="instagram.com/username"
                placeholderTextColor={colors.mutedLight}
                autoCapitalize="none"
              />
            </View>
          </View>
        </ScrollView>

        {/* Sticky footer save button */}
        <View style={styles.editFooter}>
          <TouchableOpacity
            style={[styles.saveFullBtn, (savingAvatar || updateProfile.isPending) && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={savingAvatar || updateProfile.isPending}
            activeOpacity={0.8}
          >
            {savingAvatar || updateProfile.isPending ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.saveFullBtnText}>Simpan Perubahan</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Main settings
  return (
    <View style={[styles.screen, { backgroundColor: c.light, paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBackSmart(router)} style={[styles.headerBtn, { backgroundColor: c.white }]}>
          <ChevronLeft size={18} color={c.charcoal} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: c.charcoal }]}>Pengaturan</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.menuContent} showsVerticalScrollIndicator={false}>
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
          <ChevronRight size={18} color={colors.mutedLight} />
        </TouchableOpacity>

        {/* Help & Legal section */}
        <Text style={styles.sectionLabel}>Bantuan & Legal</Text>
        <View style={styles.menuCard}>
          <SettingsRow
            icon={<HelpCircle size={17} color="#60A5FA" />}
            iconBg="rgba(96, 165, 250, 0.12)"
            label="Bantuan & FAQ"
            sub="Panduan & pertanyaan umum"
            onPress={() => router.push('/settings/help-faq')}
          />
          <View style={styles.menuDivider} />
          <SettingsRow
            icon={<FileText size={17} color={colors.teal} />}
            iconBg="rgba(78, 205, 196, 0.12)"
            label="Kebijakan Privasi"
            sub="Cara kami mengelola datamu"
          />
          <View style={styles.menuDivider} />
          <SettingsRow
            icon={<FileText size={17} color="#8B7CF6" />}
            iconBg="rgba(139, 124, 246, 0.12)"
            label="Syarat & Ketentuan"
            sub="Ketentuan penggunaan layanan"
          />
        </View>

        {/* Tampilan section */}
        <Text style={styles.sectionLabel}>Tampilan</Text>
        <View style={styles.menuCard}>
          <View style={styles.menuRow}>
            <View style={[styles.menuIconContainer, { backgroundColor: colors.tealLight }]}>
              <HelpCircle size={17} color={colors.teal} />
            </View>
            <View style={styles.menuRowText}>
              <Text style={styles.menuRowLabel}>Mode Gelap</Text>
              <Text style={styles.menuRowSub}>Beranda & tab bar ikut tema gelap</Text>
            </View>
            <Switch
              value={themeHydrated ? scheme === 'dark' : false}
              onValueChange={toggleScheme}
              trackColor={{ false: colors.border, true: colors.coral }}
              thumbColor="#FFFFFF"
              disabled={!themeHydrated}
            />
          </View>
        </View>

        {/* Account section */}
        <Text style={styles.sectionLabel}>Akun</Text>
        <View style={styles.menuCard}>
          <SettingsRow
            icon={<UserX size={17} color={colors.muted} />}
            iconBg="rgba(144, 145, 160, 0.12)"
            label="Hapus Akun"
            sub="Hapus akun dan data secara permanen"
            onPress={() => router.push('/settings/delete-account')}
          />
        </View>

        {/* Sign out */}
        <View style={[styles.menuCard, { marginTop: 12 }]}>
          <TouchableOpacity style={styles.menuRow} onPress={handleSignOut} activeOpacity={0.7}>
            <View style={[styles.menuIconContainer, { backgroundColor: colors.coralLight }]}>
              <LogOut size={17} color={colors.coral} />
            </View>
            <View style={styles.menuRowText}>
              <Text style={[styles.menuRowLabel, { color: colors.coral }]}>Keluar</Text>
              <Text style={[styles.menuRowSub, { color: 'rgba(255, 107, 107, 0.6)' }]}>Keluar dari akun di perangkat ini</Text>
            </View>
            <ChevronRight size={16} color="rgba(255, 107, 107, 0.5)" />
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Atur Perjalanan · v{appVersion}</Text>
      </ScrollView>

      {/* Sign out confirmation modal */}
      <ConfirmModal
        visible={showSignOutConfirm}
        title="Keluar?"
        description="Kamu akan keluar dari akun di perangkat ini."
        icon={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={22} color={colors.danger} />
          </View>
        }
        confirmLabel="Keluar"
        destructive
        loading={signingOut}
        onConfirm={() => void handleConfirmSignOut()}
        onCancel={() => setShowSignOutConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.light },
  // Main header — left-aligned title (PageHeader style)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 14,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    ...shadows.cardCompact,
  },
  headerSpacer: { width: 36 },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: colors.charcoal,
    letterSpacing: -0.4,
    marginLeft: 12,
  },
  saveBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  saveBtnText: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  // Menu content
  menuContent: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 40, gap: 16 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    paddingHorizontal: 16,
    gap: 14,
    ...shadows.cardCompact,
  },
  menuAvatar: { width: 48, height: 48, borderRadius: 16, overflow: 'hidden' },
  menuAvatarImg: { width: '100%', height: '100%', borderRadius: 16 },
  menuAvatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  menuAvatarLetter: { fontSize: 20, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  menuProfileInfo: { flex: 1 },
  menuProfileName: { fontSize: 15, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal },
  menuProfileUsername: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted, marginTop: 2 },
  sectionLabel: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.muted, marginTop: 8, textTransform: 'uppercase', letterSpacing: 1.2 },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    ...shadows.cardCompact,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuRowText: { flex: 1 },
  menuRowLabel: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  menuRowSub: { fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted, marginTop: 1 },
  menuDivider: { height: 1, backgroundColor: colors.border, marginLeft: 68 },
  versionText: { fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium', color: colors.mutedLight, textAlign: 'center', marginTop: 4, marginBottom: 12 },
  // Edit profile
  editContent: { padding: 20, paddingHorizontal: 22, paddingBottom: 40 },
  editAvatarSection: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    paddingVertical: 24,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  editAvatar: { width: 84, height: 84, borderRadius: 26, overflow: 'hidden', marginBottom: 10 },
  editAvatarImg: { width: '100%', height: '100%', borderRadius: 26 },
  editAvatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 26 },
  editAvatarLetter: { fontSize: 34, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  changePhotoText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  avatarDraftHint: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
    textAlign: 'center',
    marginTop: -2,
  },
  editField: { marginBottom: 16 },
  editLabel: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal, marginBottom: 8 },
  editLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  editCounter: { fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium', color: colors.mutedLight },
  editInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.light,
    borderRadius: 14,
    padding: 13,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  editInputRowFocused: {
    borderColor: colors.coral,
    borderWidth: 2,
  },
  editInputText: { fontSize: 15, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted, flex: 1 },
  editInputIconText: { fontSize: 16, fontFamily: 'PlusJakartaSans_400Regular', color: colors.muted },
  editFieldInput: { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal },
  editFieldInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.light,
    borderRadius: 14,
    padding: 13,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.charcoal,
  },
  editTextAreaRow: { alignItems: 'flex-start', minHeight: 88 },
  editTextAreaInput: { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal, lineHeight: 22.4, minHeight: 62 },
  editFooter: {
    padding: 16,
    paddingHorizontal: 22,
    paddingBottom: 32,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveFullBtn: {
    width: '100%',
    height: 52,
    backgroundColor: colors.coral,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.275,
    shadowRadius: 26,
    elevation: 8,
  },
  saveFullBtnText: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.white },
});

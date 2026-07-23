import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTripDetail } from '@/features/trips/hooks/useTripDetail';
import { useMembers, type Member } from '@/features/trips/hooks/useMembers';
import { useRemoveMember } from '@/features/trips/hooks/useRemoveMember';
import { useDeleteTrip } from '@/features/trips/hooks/useDeleteTrip';
import { useUpdateTrip } from '@/features/trips/hooks/useUpdateTrip';
import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { Users } from '@/components/icons/Users';
import { Trash2 } from '@/components/icons/Trash2';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { avatarColorFor } from '@/theme/colors';
import { useAuth } from '@/auth/AuthProvider';

type ManageView = 'menu' | 'members' | 'edit' | 'delete';

function MemberRow({
  member,
  isCreator,
  currentUserId,
  onRemove,
}: {
  member: Member;
  isCreator: boolean;
  currentUserId: string;
  onRemove: () => void;
}) {
  const isSelf = member.id === currentUserId;

  return (
    <View style={styles.memberRow}>
      <View style={styles.memberAvatar}>
        {member.avatar_url ? (
          <Image source={{ uri: member.avatar_url }} style={styles.memberAvatarImg} />
        ) : (
          <View style={[styles.memberAvatarFallback, { backgroundColor: avatarColorFor(member.username) }]}>
            <Text style={styles.memberAvatarLetter}>{member.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}{isSelf ? ' (Kamu)' : ''}</Text>
        <Text style={styles.memberUsername}>@{member.username}</Text>
      </View>
      <View style={styles.memberRoleBadge}>
        <Text style={styles.memberRoleText}>
          {member.role === 'creator' ? 'Pembuat' : 'Anggota'}
        </Text>
      </View>
      {isCreator && !isSelf && (
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
          <Text style={styles.removeBtnText}>Keluarkan</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function ManageScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: trip, isLoading: tripLoading } = useTripDetail(tripId);
  const { data: membersData, isLoading: membersLoading } = useMembers(tripId);
  const removeMember = useRemoveMember(tripId);
  const deleteTrip = useDeleteTrip(tripId);
  const updateTrip = useUpdateTrip(tripId);

  const [view, setView] = useState<ManageView>('menu');
  const [editName, setEditName] = useState('');

  const isLoading = tripLoading || membersLoading;
  const isCreator = membersData?.is_creator ?? false;
  const members = membersData?.members ?? [];

  const handleStartEdit = useCallback(() => {
    setEditName(trip?.name ?? '');
    setView('edit');
  }, [trip]);

  const handleSaveEdit = useCallback(async () => {
    if (!editName.trim()) return;
    try {
      await updateTrip.mutateAsync({ name: editName.trim() });
      setView('menu');
    } catch {
      Alert.alert('Gagal', 'Tidak dapat menyimpan perubahan');
    }
  }, [editName, updateTrip]);

  const handleDeleteTrip = useCallback(() => {
    Alert.alert(
      'Hapus Perjalanan?',
      `${trip?.name} dan semua datanya akan dihapus permanen.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTrip.mutateAsync();
              router.replace('/(tabs)');
            } catch {
              Alert.alert('Gagal', 'Tidak dapat menghapus perjalanan');
            }
          },
        },
      ],
    );
  }, [trip, deleteTrip, router]);

  const handleRemoveMember = useCallback((memberId: string, memberName: string) => {
    Alert.alert('Keluarkan?', `${memberName} akan dikeluarkan dari trip.`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluarkan', style: 'destructive', onPress: () => removeMember.mutate(memberId) },
    ]);
  }, [removeMember]);

  if (isLoading) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.coral} /></View>
      </View>
    );
  }

  // Members view
  if (view === 'members') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setView('menu')} style={styles.headerBtn}>
            <ChevronLeft size={20} color={colors.charcoal} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Anggota Perjalanan</Text>
          <View style={styles.headerBtn} />
        </View>
        <ScrollView contentContainerStyle={styles.membersContent}>
          <Text style={styles.sectionLabel}>{members.length} anggota</Text>
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              isCreator={isCreator}
              currentUserId={user?.id ?? ''}
              onRemove={() => handleRemoveMember(member.id, member.name)}
            />
          ))}
        </ScrollView>
      </View>
    );
  }

  // Edit view
  if (view === 'edit') {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setView('menu')} style={styles.headerBtn}>
            <ChevronLeft size={20} color={colors.charcoal} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Perjalanan</Text>
          <TouchableOpacity onPress={handleSaveEdit} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Simpan</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.editContent}>
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Nama Perjalanan</Text>
            <TextInput
              style={styles.editInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nama perjalanan"
              placeholderTextColor={colors.mutedLight}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // Main menu
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ChevronLeft size={20} color={colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kelola Trip</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.menuContent}>
        <TouchableOpacity style={styles.menuItem} onPress={() => setView('members')} activeOpacity={0.7}>
          <View style={[styles.menuIconBox, { backgroundColor: colors.tealLight }]}>
            <Users size={16} color={colors.teal} />
          </View>
          <Text style={styles.menuItemText}>Daftar Anggota</Text>
          <Text style={styles.menuItemChevron}>›</Text>
        </TouchableOpacity>

        {isCreator && (
          <>
            <TouchableOpacity style={styles.menuItem} onPress={handleStartEdit} activeOpacity={0.7}>
              <View style={[styles.menuIconBox, { backgroundColor: colors.light }]}>
                <Text style={{ fontSize: 16 }}>⚙</Text>
              </View>
              <Text style={styles.menuItemText}>Edit Info Perjalanan</Text>
              <Text style={styles.menuItemChevron}>›</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleDeleteTrip} activeOpacity={0.7}>
              <View style={[styles.menuIconBox, { backgroundColor: colors.dangerLight }]}>
                <Trash2 size={16} color={colors.danger} />
              </View>
              <Text style={[styles.menuItemText, { color: colors.danger }]}>Hapus Perjalanan</Text>
              <Text style={styles.menuItemChevron}>›</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.charcoal, textAlign: 'center' },
  saveBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  saveBtnText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: colors.coral },
  // Menu
  menuContent: { padding: 16, gap: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderRadius: 16 },
  menuIconBox: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuItemText: { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.charcoal },
  menuItemChevron: { fontSize: 20, color: colors.muted },
  menuDivider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
  // Members
  membersContent: { padding: 22, paddingBottom: 40 },
  sectionLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.muted, marginBottom: 12 },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 10 },
  memberAvatar: { width: 44, height: 44, borderRadius: 14, overflow: 'hidden' },
  memberAvatarImg: { width: '100%', height: '100%', borderRadius: 14 },
  memberAvatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  memberAvatarLetter: { fontSize: 16, fontFamily: 'PlusJakartaSans_800ExtraBold', color: colors.white },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  memberUsername: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.muted },
  memberRoleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: colors.light },
  memberRoleText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.muted },
  removeBtn: { height: 32, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  removeBtnText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  // Edit
  editContent: { padding: 16, gap: 14 },
  editField: { gap: 6 },
  editLabel: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.charcoal },
  editInput: { backgroundColor: colors.light, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.charcoal, borderWidth: 1.5, borderColor: colors.border },
});

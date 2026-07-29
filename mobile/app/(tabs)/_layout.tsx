import React from 'react';
import { Redirect, Tabs, useRouter, usePathname } from 'expo-router';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/auth/AuthProvider';
import { Home } from '@/components/icons/Home';
import { Search } from '@/components/icons/Search';
import { Heart } from '@/components/icons/Heart';
import { User } from '@/components/icons/User';
import { Plus } from '@/components/icons/Plus';
import { colors } from '@/theme/colors';
import { shadows } from '@/theme/shadows';

const TABS = [
  { name: 'index', label: 'Beranda', Icon: Home },
  { name: 'search', label: 'Cari', Icon: Search },
  { name: '_fab', label: '', Icon: Plus, isFab: true },
  { name: 'wishlist', label: 'Wishlist', Icon: Heart },
  { name: 'profile', label: 'Profil', Icon: User },
];

function CustomTabBar({ state, navigation }: { state: any; navigation: any }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const isActive = (name: string) => {
    if (name === 'index') return pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index';
    return pathname.includes(`/${name}`);
  };

  const handlePress = (name: string, isFab?: boolean) => {
    if (isFab) {
      router.push('/trip/create');
      return;
    }
    navigation.navigate(name);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }]}>
      {TABS.map((tab) => {
        if (tab.isFab) {
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.fab}
              onPress={() => handlePress(tab.name, true)}
              activeOpacity={0.85}
            >
              <Plus size={24} color={colors.white} />
            </TouchableOpacity>
          );
        }
        const active = isActive(tab.name);
        const { Icon } = tab;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => handlePress(tab.name)}
            activeOpacity={0.7}
          >
            <Icon size={22} color={active ? colors.coral : colors.muted} />
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  const { isHydrated, isAuthenticated } = useAuth();

  if (!isHydrated) return null;
  if (!isAuthenticated) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Beranda' }} />
      <Tabs.Screen name="search" options={{ title: 'Cari' }} />
      <Tabs.Screen name="wishlist" options={{ title: 'Wishlist' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 88,
    ...Platform.select({
      web: { position: 'fixed' as any, bottom: 0, left: 0, right: 0, zIndex: 100 },
      default: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100 },
    }),
    ...shadows.elevated,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.muted,
  },
  tabLabelActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.coral,
  },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    ...shadows.button,
  },
});

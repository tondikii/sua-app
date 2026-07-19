import { Redirect, Tabs } from 'expo-router';

import { useAuth } from '../../src/auth/AuthProvider';

export default function TabsLayout() {
  const { isHydrated, isAuthenticated } = useAuth();

  if (!isHydrated) return null;
  if (!isAuthenticated) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Beranda' }} />
      <Tabs.Screen name="search" options={{ title: 'Cari' }} />
      <Tabs.Screen name="wishlist" options={{ title: 'Wishlist' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}

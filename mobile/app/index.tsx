import { Redirect } from 'expo-router';

import { useAuth } from '../src/auth/AuthProvider';

/**
 * Entry route — gates the app until the session has hydrated, then routes to
 * the signed-in tabs or the sign-in screen.
 */
export default function Index() {
  const { isHydrated, isAuthenticated } = useAuth();
  if (!isHydrated) return null;
  return <Redirect href={isAuthenticated ? '/(tabs)/' : '/(auth)/sign-in'} />;
}

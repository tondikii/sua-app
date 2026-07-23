import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../src/auth/AuthProvider';

export default function Index() {
  const { isHydrated, isAuthenticated } = useAuth();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('has_completed_onboarding').then((val) => {
      setHasCompletedOnboarding(val === 'true');
      setOnboardingChecked(true);
    });
  }, []);

  if (!isHydrated || !onboardingChecked) return null;

  if (isAuthenticated) return <Redirect href="/(tabs)" />;
  if (!hasCompletedOnboarding) return <Redirect href="/(auth)/onboarding" />;
  return <Redirect href="/(auth)/sign-in" />;
}

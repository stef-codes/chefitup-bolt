import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

export default function Index() {
  const { session, loading, guestMode } = useAuth();
  const { isOnboardingCompleted } = useUser();

  useEffect(() => {
    if (loading) return;

    if (guestMode) {
      // User is in guest mode, go directly to main app
      router.replace('/(tabs)');
    } else if (!session) {
      // User is not authenticated, redirect to sign in
      router.replace('/auth/sign-in');
    } else if (!isOnboardingCompleted) {
      // User is authenticated but hasn't completed onboarding
      router.replace('/onboarding');
    } else {
      // User is authenticated and has completed onboarding
      router.replace('/(tabs)');
    }
  }, [session, loading, isOnboardingCompleted, guestMode]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
      <Text style={{ fontSize: 16, color: '#374151' }}>Loading...</Text>
    </View>
  );
} 
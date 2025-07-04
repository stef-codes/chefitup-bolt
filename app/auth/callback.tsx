import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.replace('/onboarding');
          return;
        }

        if (data.session) {
          // User is authenticated, redirect to main app
          router.replace('/(tabs)');
        } else {
          // No session, redirect to onboarding
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/onboarding');
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
      <Text style={{ fontSize: 16, color: '#374151' }}>Completing sign-in...</Text>
    </View>
  );
} 
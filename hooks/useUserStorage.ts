import { useState, useEffect } from 'react';
import { UserProfile, OnboardingData } from '../types/user';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Simple in-memory storage for Expo Go compatibility
class MemoryStorage {
  private storage: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async deleteItem(key: string): Promise<void> {
    this.storage.delete(key);
  }
}

const memoryStorage = new MemoryStorage();

const USER_PROFILE_KEY = '@user_profile';
const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

export const useUserStorage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const { user } = useAuth();

  // Load user profile from storage
  const loadUserProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;

    try {
      // Try to load from Supabase first
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        const profile: UserProfile = {
          name: data.name || '',
          email: data.email || '',
          avatar: data.avatar || '',
          diabetesType: data.diabetes_type || '',
          age: data.age || '',
          carbBudget: data.carb_budget || '',
          restrictions: data.restrictions || [],
          goals: data.goals || [],
          cookingLevel: data.cooking_level || '',
          joinDate: data.join_date || new Date().toISOString(),
          preferences: data.preferences || {
            notifications: true,
            mealReminders: true,
            carbTracking: true,
            bloodSugarTracking: true,
          },
          stats: data.stats || {
            mealsPrepped: 0,
            recipesTried: 0,
            streakDays: 0,
            avgDailyCarbs: 0,
          },
        };

        setUserProfile(profile);
        setIsOnboardingCompleted(!!data.diabetes_type);
        return profile;
      }

      // Fallback to local storage
      const storedProfile = await memoryStorage.getItem(USER_PROFILE_KEY);
      if (storedProfile) {
        return JSON.parse(storedProfile);
      }
      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  // Save user profile to storage
  const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
    if (!user) return false;

    try {
      // Save to Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
          diabetes_type: profile.diabetesType,
          age: profile.age,
          carb_budget: profile.carbBudget,
          restrictions: profile.restrictions,
          goals: profile.goals,
          cooking_level: profile.cookingLevel,
          join_date: profile.joinDate,
          preferences: profile.preferences,
          stats: profile.stats,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Also save to local storage for offline access
      await memoryStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      setUserProfile(profile);
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  };

  // Update user profile (partial update)
  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    try {
      const currentProfile = userProfile || await loadUserProfile();
      if (currentProfile) {
        const updatedProfile = { ...currentProfile, ...updates };
        return await saveUserProfile(updatedProfile);
      }
      return false;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };

  // Save onboarding data and mark as completed
  const completeOnboarding = async (onboardingData: OnboardingData): Promise<boolean> => {
    if (!user) return false;

    try {
      const newProfile: UserProfile = {
        name: onboardingData.name || '',
        email: user.email || '',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
        ...onboardingData,
        joinDate: new Date().toISOString(),
        preferences: {
          notifications: true,
          mealReminders: true,
          carbTracking: true,
          bloodSugarTracking: true,
        },
        stats: {
          mealsPrepped: 0,
          recipesTried: 0,
          streakDays: 0,
          avgDailyCarbs: 0,
        },
      };

      const success = await saveUserProfile(newProfile);
      if (success) {
        await memoryStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
        setIsOnboardingCompleted(true);
      }
      return success;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  };

  // Check if onboarding is completed
  const checkOnboardingStatus = async (): Promise<boolean> => {
    try {
      const status = await memoryStorage.getItem(ONBOARDING_COMPLETED_KEY);
      return status === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  };

  // Clear user data (for logout/reset)
  const clearUserData = async (): Promise<boolean> => {
    try {
      await memoryStorage.deleteItem(USER_PROFILE_KEY);
      await memoryStorage.deleteItem(ONBOARDING_COMPLETED_KEY);
      setUserProfile(null);
      setIsOnboardingCompleted(false);
      return true;
    } catch (error) {
      console.error('Error clearing user data:', error);
      return false;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const [profile, onboardingStatus] = await Promise.all([
            loadUserProfile(),
            checkOnboardingStatus(),
          ]);
          
          setUserProfile(profile);
          setIsOnboardingCompleted(onboardingStatus);
        } else {
          setUserProfile(null);
          setIsOnboardingCompleted(false);
        }
      } catch (error) {
        console.error('Error initializing user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [user]);

  return {
    userProfile,
    isLoading,
    isOnboardingCompleted,
    saveUserProfile,
    updateUserProfile,
    completeOnboarding,
    clearUserData,
    loadUserProfile,
  };
}; 
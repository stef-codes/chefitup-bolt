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
const GUEST_PROFILE_KEY = '@guest_profile';

export const useUserStorage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const { user, guestMode } = useAuth();

  // Create default guest profile
  const createGuestProfile = (): UserProfile => ({
    name: 'Guest User',
    email: 'guest@chefitup.com',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    diabetesType: 'Type 2',
    age: '30',
    carbBudget: '150',
    restrictions: [],
    goals: ['Weight Management'],
    cookingLevel: 'Beginner',
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
  });

  // Load user profile from storage
  const loadUserProfile = async (): Promise<UserProfile | null> => {
    try {
      if (guestMode) {
        // In guest mode, load or create guest profile
        const storedGuestProfile = await memoryStorage.getItem(GUEST_PROFILE_KEY);
        if (storedGuestProfile) {
          const profile = JSON.parse(storedGuestProfile);
          setUserProfile(profile);
          setIsOnboardingCompleted(true);
          return profile;
        } else {
          // Create new guest profile
          const guestProfile = createGuestProfile();
          await memoryStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(guestProfile));
          setUserProfile(guestProfile);
          setIsOnboardingCompleted(true);
          return guestProfile;
        }
      }

      if (!user) return null;

      // Try to load from Supabase first
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn('Supabase error loading profile, falling back to local storage:', error);
        // Fallback to local storage
        const storedProfile = await memoryStorage.getItem(USER_PROFILE_KEY);
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setUserProfile(profile);
          setIsOnboardingCompleted(!!profile.diabetesType);
          return profile;
        }
        return null;
      }

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
        const profile = JSON.parse(storedProfile);
        setUserProfile(profile);
        setIsOnboardingCompleted(!!profile.diabetesType);
        return profile;
      }
      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Try to load from local storage as last resort
      try {
        const storedProfile = await memoryStorage.getItem(USER_PROFILE_KEY);
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setUserProfile(profile);
          setIsOnboardingCompleted(!!profile.diabetesType);
          return profile;
        }
      } catch (localError) {
        console.error('Error loading from local storage:', localError);
      }
      return null;
    }
  };

  // Save user profile to storage
  const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
    try {
      if (guestMode) {
        // In guest mode, save to local storage only
        await memoryStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(profile));
        setUserProfile(profile);
        return true;
      }
      
      if (!user) {
        console.warn('No user found during profile save, saving to local storage only');
        await memoryStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
        setUserProfile(profile);
        return true;
      }

      // Try to save to Supabase first
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

      if (error) {
        console.warn('Supabase error saving profile, falling back to local storage:', error);
        // Fallback: save to local storage only
        await memoryStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
        setUserProfile(profile);
        return true; // Return true even if Supabase failed
      }

      // Also save to local storage for offline access
      await memoryStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      setUserProfile(profile);
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      // Try to save to local storage as fallback
      try {
        await memoryStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
        setUserProfile(profile);
        return true;
      } catch (localError) {
        console.error('Error saving to local storage:', localError);
        return false;
      }
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
    try {
      if (guestMode) {
        // In guest mode, update guest profile with onboarding data
        const currentProfile = userProfile || createGuestProfile();
        const updatedProfile: UserProfile = {
          ...currentProfile,
          name: onboardingData.name || currentProfile.name,
          diabetesType: onboardingData.diabetesType || currentProfile.diabetesType,
          age: onboardingData.age || currentProfile.age,
          carbBudget: onboardingData.carbBudget || currentProfile.carbBudget,
          restrictions: onboardingData.restrictions || currentProfile.restrictions,
          goals: onboardingData.goals || currentProfile.goals,
          cookingLevel: onboardingData.cookingLevel || currentProfile.cookingLevel,
        };

        const success = await saveUserProfile(updatedProfile);
        if (success) {
          await memoryStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
          setIsOnboardingCompleted(true);
        }
        return success;
      }
      
      if (!user) {
        console.warn('No user found during onboarding completion, saving to local storage only');
        const newProfile: UserProfile = {
          name: onboardingData.name || '',
          email: 'guest@chefitup.com',
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
      }

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
      if (guestMode) {
        // Clear guest data
        await memoryStorage.deleteItem(GUEST_PROFILE_KEY);
        await memoryStorage.deleteItem(ONBOARDING_COMPLETED_KEY);
        setUserProfile(null);
        setIsOnboardingCompleted(false);
      } else {
        // Clear authenticated user data
        await memoryStorage.deleteItem(USER_PROFILE_KEY);
        await memoryStorage.deleteItem(ONBOARDING_COMPLETED_KEY);
        setUserProfile(null);
        setIsOnboardingCompleted(false);
      }
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
        if (guestMode) {
          // Initialize guest mode data
          const [profile, onboardingStatus] = await Promise.all([
            loadUserProfile(),
            checkOnboardingStatus(),
          ]);
          
          setUserProfile(profile);
          setIsOnboardingCompleted(onboardingStatus);
        } else if (user) {
          // Initialize authenticated user data
          const [profile, onboardingStatus] = await Promise.all([
            loadUserProfile(),
            checkOnboardingStatus(),
          ]);
          
          setUserProfile(profile);
          setIsOnboardingCompleted(onboardingStatus);
        } else {
          // No user and not in guest mode
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
  }, [user, guestMode]);

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
import { useState, useEffect } from 'react';
import { UserProfile, OnboardingData } from '../types/user';

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

  // Load user profile from storage
  const loadUserProfile = async (): Promise<UserProfile | null> => {
    try {
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
    try {
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
    try {
      const newProfile: UserProfile = {
        name: 'Sarah Johnson', // Default name, can be updated later
        email: 'sarah.johnson@email.com', // Default email, can be updated later
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
        ...onboardingData,
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
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
        const [profile, onboardingStatus] = await Promise.all([
          loadUserProfile(),
          checkOnboardingStatus(),
        ]);
        
        setUserProfile(profile);
        setIsOnboardingCompleted(onboardingStatus);
      } catch (error) {
        console.error('Error initializing user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

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
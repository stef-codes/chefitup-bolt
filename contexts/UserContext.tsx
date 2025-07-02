import React, { createContext, useContext, ReactNode } from 'react';
import { useUserStorage } from '../hooks/useUserStorage';
import { UserProfile, OnboardingData } from '../types/user';

interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  isOnboardingCompleted: boolean;
  saveUserProfile: (profile: UserProfile) => Promise<boolean>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  completeOnboarding: (onboardingData: OnboardingData) => Promise<boolean>;
  clearUserData: () => Promise<boolean>;
  loadUserProfile: () => Promise<UserProfile | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const userStorage = useUserStorage();

  return (
    <UserContext.Provider value={userStorage}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 
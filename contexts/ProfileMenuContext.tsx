import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './AuthContext';

interface ProfileMenuContextType {
  showProfileMenu: boolean;
  setShowProfileMenu: (show: boolean) => void;
  handleProfilePress: () => void;
  handleSignOut: () => Promise<void>;
  handleSignIn: () => void;
  guestMode: boolean;
}

const ProfileMenuContext = createContext<ProfileMenuContextType | undefined>(undefined);

export const ProfileMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const { signOut, guestMode } = useAuth();

  const handleProfilePress = () => {
    setShowProfileMenu(true);
  };

  const handleSignOut = async () => {
    setShowProfileMenu(false);
    await signOut();
    router.replace('/auth/sign-in');
  };

  const handleSignIn = () => {
    setShowProfileMenu(false);
    router.replace('/auth/sign-in');
  };

  return (
    <ProfileMenuContext.Provider value={{
      showProfileMenu,
      setShowProfileMenu,
      handleProfilePress,
      handleSignOut,
      handleSignIn,
      guestMode,
    }}>
      {children}
    </ProfileMenuContext.Provider>
  );
};

export const useProfileMenu = () => {
  const context = useContext(ProfileMenuContext);
  if (context === undefined) {
    throw new Error('useProfileMenu must be used within a ProfileMenuProvider');
  }
  return context;
}; 
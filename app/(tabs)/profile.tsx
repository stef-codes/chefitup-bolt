import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Heart, Target, TrendingUp, Bell, ChevronRight, Award, Calendar, Edit3 } from 'lucide-react-native';
import { useUser } from '../../contexts/UserContext';

const ProfileScreen = () => {
  const { userProfile, isLoading } = useUser();

  // Fallback data if userProfile is not loaded yet
  const displayProfile = userProfile || {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    diabetesType: 'Type 2',
    carbBudget: '150',
    joinDate: 'March 2024',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
    restrictions: [],
    goals: [],
    cookingLevel: '',
    age: '',
    preferences: {
      notifications: true,
      mealReminders: true,
      carbTracking: true,
      bloodSugarTracking: true,
    },
    stats: {
      mealsPrepped: 47,
      recipesTried: 23,
      streakDays: 12,
      avgDailyCarbs: 142,
    },
  };

  const achievements = [
    { id: 1, title: 'First Week Complete', icon: Calendar, earned: true },
    { id: 2, title: 'Carb Goal Master', icon: Target, earned: true },
    { id: 3, title: 'Recipe Explorer', icon: Heart, earned: true },
    { id: 4, title: 'Prep Master', icon: Award, earned: false },
  ];



  const menuItems = [
    { icon: Settings, title: 'Settings', subtitle: 'App preferences and notifications', action: () => {} },
    { icon: Heart, title: 'Health Profile', subtitle: 'Update diabetes and dietary info', action: () => {} },
    { icon: TrendingUp, title: 'Progress Report', subtitle: 'View detailed analytics', action: () => {} },
    { icon: Bell, title: 'Reminders', subtitle: 'Meal prep and eating reminders', action: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <Image source={{ uri: displayProfile.avatar }} style={styles.avatar} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{displayProfile.name}</Text>
              <Text style={styles.userEmail}>{displayProfile.email}</Text>
              <View style={styles.userMeta}>
                <Text style={styles.userType}>{displayProfile.diabetesType}</Text>
                <View style={styles.metaDivider} />
                <Text style={styles.userBudget}>{displayProfile.carbBudget}g carbs/day</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>



        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <Text style={styles.achievementsTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <View key={achievement.id} style={[
                  styles.achievementItem,
                  !achievement.earned && styles.achievementItemLocked
                ]}>
                  <View style={[
                    styles.achievementIcon,
                    achievement.earned && styles.achievementIconEarned
                  ]}>
                    <IconComponent 
                      size={20} 
                      color={achievement.earned ? '#16A34A' : '#9CA3AF'} 
                    />
                  </View>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.earned && styles.achievementTitleLocked
                  ]}>
                    {achievement.title}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Onboarding Preferences */}
        <View style={styles.preferencesCard}>
          <View style={styles.preferencesHeader}>
            <Text style={styles.preferencesTitle}>Your Preferences</Text>
            <TouchableOpacity style={styles.editIconButton}>
              <Edit3 size={16} color="#16A34A" />
            </TouchableOpacity>
          </View>
          
          {/* Health Profile */}
          <View style={styles.preferenceSection}>
            <Text style={styles.sectionTitle}>Health Profile</Text>
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Diabetes Type:</Text>
              <Text style={styles.preferenceValue}>{displayProfile.diabetesType || 'Not set'}</Text>
            </View>
            {displayProfile.age && (
              <View style={styles.preferenceRow}>
                <Text style={styles.preferenceLabel}>Age:</Text>
                <Text style={styles.preferenceValue}>{displayProfile.age}</Text>
              </View>
            )}
            <View style={styles.preferenceRow}>
              <Text style={styles.preferenceLabel}>Daily Carb Budget:</Text>
              <Text style={styles.preferenceValue}>{displayProfile.carbBudget ? `${displayProfile.carbBudget}g` : 'Not set'}</Text>
            </View>
          </View>

          {/* Dietary Restrictions */}
          {displayProfile.restrictions.length > 0 && (
            <View style={styles.preferenceSection}>
              <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
              <View style={styles.tagsContainer}>
                {displayProfile.restrictions.map((restriction, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{restriction}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Health Goals */}
          {displayProfile.goals.length > 0 && (
            <View style={styles.preferenceSection}>
              <Text style={styles.sectionTitle}>Health Goals</Text>
              <View style={styles.tagsContainer}>
                {displayProfile.goals.map((goal, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{goal}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Cooking Experience */}
          {displayProfile.cookingLevel && (
            <View style={styles.preferenceSection}>
              <Text style={styles.sectionTitle}>Cooking Experience</Text>
              <View style={styles.preferenceRow}>
                <Text style={styles.preferenceLabel}>Skill Level:</Text>
                <Text style={styles.preferenceValue}>{displayProfile.cookingLevel}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    <View>
              <IconComponent size={20} color="#16A34A" />
            </View>
                  </View>
                  <View style={styles.menuText}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>ChefItUp v1.0.0</Text>
          <Text style={styles.appInfoText}>Member since {displayProfile.joinDate}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userType: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  userBudget: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  editButton: {
    backgroundColor: '#16A34A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },

  achievementsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  achievementItemLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementIconEarned: {
    backgroundColor: '#DCFCE7',
  },
  achievementTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: '#9CA3AF',
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  appInfo: {
    alignItems: 'center',
    paddingBottom: 32,
    gap: 4,
  },
  appInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  // Preferences section styles
  preferencesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  preferencesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  preferencesTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  editIconButton: {
    padding: 8,
  },
  preferenceSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  preferenceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  preferenceValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#16A34A',
  },
});

export default ProfileScreen;
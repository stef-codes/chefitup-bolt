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
import { Clock, TrendingUp, Calendar, ChefHat, Heart, Target } from 'lucide-react-native';

const HomeScreen = () => {
  const todayStats = {
    carbsConsumed: 85,
    carbsTarget: 150,
    mealsPrepped: 3,
    nextMeal: 'Dinner',
    nextMealTime: '6:00 PM',
  };

  const weeklyGoals = [
    { title: 'Meals Prepped', current: 8, target: 12, icon: ChefHat },
    { title: 'Carb Goals Met', current: 5, target: 7, icon: Target },
    { title: 'Recipe Variety', current: 6, target: 8, icon: Heart },
  ];

  const recentRecipes = [
    {
      id: 1,
      name: 'Mediterranean Quinoa Bowl',
      carbs: 35,
      glycemicIndex: 'Low',
      prepTime: 25,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    },
    {
      id: 2,
      name: 'Herb-Crusted Salmon',
      carbs: 12,
      glycemicIndex: 'Very Low',
      prepTime: 30,
      image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
    },
    {
      id: 3,
      name: 'Cauliflower Rice Stir-Fry',
      carbs: 18,
      glycemicIndex: 'Low',
      prepTime: 20,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    },
  ];

  const getGIColor = (gi: string) => {
    switch (gi) {
      case 'Very Low':
        return '#10B981';
      case 'Low':
        return '#16A34A';
      case 'Medium':
        return '#F59E0B';
      case 'High':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.subtitle}>Ready to prep some healthy meals?</Text>
        </View>

        {/* Today's Progress */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{todayStats.carbsConsumed}g</Text>
              <Text style={styles.progressLabel}>Carbs</Text>
              <Text style={styles.progressTarget}>of {todayStats.carbsTarget}g</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{todayStats.mealsPrepped}</Text>
              <Text style={styles.progressLabel}>Meals Prepped</Text>
              <Text style={styles.progressTarget}>this week</Text>
            </View>
          </View>
          
          <View style={styles.nextMealContainer}>
            <Clock size={20} color="#16A34A" />
            <Text style={styles.nextMealText}>
              Next meal: {todayStats.nextMeal} at {todayStats.nextMealTime}
            </Text>
          </View>
        </View>

        {/* Weekly Goals */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weekly Goals</Text>
          {weeklyGoals.map((goal, index) => {
            const IconComponent = goal.icon;
            const progress = (goal.current / goal.target) * 100;
            
            return (
              <View key={index} style={styles.goalItem}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitleContainer}>
                    <IconComponent size={20} color="#16A34A" />
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                  </View>
                  <Text style={styles.goalProgress}>
                    {goal.current}/{goal.target}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[styles.progressBarFill, { width: `${progress}%` }]} 
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Calendar size={24} color="#16A34A" />
              <Text style={styles.actionText}>Plan This Week</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <ChefHat size={24} color="#16A34A" />
              <Text style={styles.actionText}>Browse Recipes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Recipes */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Recent Recipes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentRecipes.map((recipe) => (
              <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName}>{recipe.name}</Text>
                  <View style={styles.recipeStats}>
                    <View style={styles.recipeStat}>
                      <Text style={styles.recipeStatValue}>{recipe.carbs}g</Text>
                      <Text style={styles.recipeStatLabel}>carbs</Text>
                    </View>
                    <View style={styles.recipeStat}>
                      <View style={[
                        styles.giIndicator,
                        { backgroundColor: getGIColor(recipe.glycemicIndex) }
                      ]} />
                      <Text style={styles.recipeStatLabel}>{recipe.glycemicIndex} GI</Text>
                    </View>
                    <View style={styles.recipeStat}>
                      <Clock size={12} color="#6B7280" />
                      <Text style={styles.recipeStatLabel}>{recipe.prepTime}m</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    marginTop: 8,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  card: {
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
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressItem: {
    flex: 1,
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  progressTarget: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  nextMealContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 8,
  },
  nextMealText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#16A34A',
    marginLeft: 8,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginLeft: 8,
  },
  goalProgress: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 3,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  recipeCard: {
    width: 180,
    marginRight: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 120,
  },
  recipeInfo: {
    padding: 12,
  },
  recipeName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 18,
  },
  recipeStats: {
    gap: 4,
  },
  recipeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeStatValue: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  recipeStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  giIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default HomeScreen;
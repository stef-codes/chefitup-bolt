import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, TrendingUp, Calendar, Target, Plus, Activity, Droplets } from 'lucide-react-native';
import RecipeDetailModal from '../../components/RecipeDetailModal';
import CarbCounterModal from '../../components/CarbCounterModal';
import BloodSugarModal from '../../components/BloodSugarModal';

interface Recipe {
  id: number;
  name: string;
  image: string;
  carbs: number;
  protein: number;
  calories: number;
  prepTime: number;
  servings: number;
  glycemicIndex: string;
  category: string;
  difficulty: string;
  isFavorite: boolean;
}

interface CarbEntry {
  id: number;
  name: string;
  carbs: number;
  time: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  notes?: string;
}

interface BloodSugarReading {
  id: number;
  value: number;
  time: string;
  date: string;
  readingType: 'Fasting' | 'Before Meal' | 'After Meal' | 'Bedtime' | 'Random';
  notes?: string;
  mealContext?: string;
}

const HomeScreen = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [carbModalVisible, setCarbModalVisible] = useState(false);
  const [bloodSugarModalVisible, setBloodSugarModalVisible] = useState(false);
  const [todaysCarbEntries, setTodaysCarbEntries] = useState<CarbEntry[]>([]);
  const [bloodSugarReadings, setBloodSugarReadings] = useState<BloodSugarReading[]>([]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Initialize with some sample carb entries
  useEffect(() => {
    const sampleEntries: CarbEntry[] = [
      {
        id: 1,
        name: 'Greek Yogurt with Berries',
        carbs: 28,
        time: '8:30 AM',
        mealType: 'Breakfast',
      },
      {
        id: 2,
        name: 'Apple',
        carbs: 25,
        time: '10:15 AM',
        mealType: 'Snack',
      },
      {
        id: 3,
        name: 'Quinoa Salad',
        carbs: 45,
        time: '12:45 PM',
        mealType: 'Lunch',
      },
    ];
    setTodaysCarbEntries(sampleEntries);

    // Initialize with sample blood sugar readings
    const sampleReadings: BloodSugarReading[] = [
      {
        id: 1,
        value: 95,
        time: '7:30 AM',
        date: new Date().toLocaleDateString('en-US'),
        readingType: 'Fasting',
      },
      {
        id: 2,
        value: 140,
        time: '2:15 PM',
        date: new Date().toLocaleDateString('en-US'),
        readingType: 'After Meal',
        mealContext: 'Lunch',
      },
    ];
    setBloodSugarReadings(sampleReadings);
  }, []);

  // Get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Good morning!';
    } else if (hour >= 12 && hour < 17) {
      return 'Good afternoon!';
    } else if (hour >= 17 && hour < 22) {
      return 'Good evening!';
    } else {
      return 'Good night!';
    }
  };

  // Calculate today's carb totals
  const todaysCarbTotal = todaysCarbEntries.reduce((total, entry) => total + entry.carbs, 0);
  const carbTarget = 150; // User's daily carb target

  // Get latest blood sugar reading
  const latestBloodSugar = bloodSugarReadings.length > 0 
    ? bloodSugarReadings[bloodSugarReadings.length - 1] 
    : null;

  const getBloodSugarStatus = (value: number) => {
    if (value < 70) return { status: 'Low', color: '#EF4444' };
    if (value <= 140) return { status: 'Normal', color: '#10B981' };
    if (value <= 180) return { status: 'High', color: '#F59E0B' };
    return { status: 'Very High', color: '#DC2626' };
  };

  const todayStats = {
    carbsConsumed: todaysCarbTotal,
    carbsTarget: carbTarget,
    mealsPrepped: 3,
    nextMeal: 'Dinner',
    nextMealTime: '6:00 PM',
    bloodSugar: latestBloodSugar,
  };

  const recentRecipes: Recipe[] = [
    {
      id: 1,
      name: 'Mediterranean Quinoa Bowl',
      carbs: 35,
      protein: 18,
      calories: 420,
      glycemicIndex: 'Low',
      prepTime: 25,
      servings: 2,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      category: 'Lunch',
      difficulty: 'Easy',
      isFavorite: true,
    },
    {
      id: 2,
      name: 'Herb-Crusted Salmon',
      carbs: 12,
      protein: 32,
      calories: 380,
      glycemicIndex: 'Very Low',
      prepTime: 30,
      servings: 4,
      image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
      category: 'Dinner',
      difficulty: 'Medium',
      isFavorite: false,
    },
    {
      id: 3,
      name: 'Cauliflower Rice Stir-Fry',
      carbs: 18,
      protein: 14,
      calories: 280,
      glycemicIndex: 'Low',
      prepTime: 20,
      servings: 3,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      category: 'Dinner',
      difficulty: 'Easy',
      isFavorite: true,
    },
    {
      id: 4,
      name: 'Greek Yogurt Parfait',
      carbs: 28,
      protein: 20,
      calories: 320,
      glycemicIndex: 'Medium',
      prepTime: 10,
      servings: 1,
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
      category: 'Breakfast',
      difficulty: 'Easy',
      isFavorite: false,
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

  const getCarbProgressColor = () => {
    const percentage = (todayStats.carbsConsumed / todayStats.carbsTarget) * 100;
    if (percentage <= 50) return '#EF4444';
    if (percentage <= 80) return '#F59E0B';
    if (percentage <= 100) return '#16A34A';
    return '#DC2626';
  };

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const handleAddToMealPlan = (recipe: Recipe, mealType: string, day: string) => {
    Alert.alert(
      'Added to Meal Plan!',
      `${recipe.name} has been added to ${day} ${mealType}`,
      [{ text: 'OK' }]
    );
  };

  const handleCarbEntrySave = (entry: CarbEntry) => {
    setTodaysCarbEntries([...todaysCarbEntries, entry]);
    Alert.alert(
      'Carbs Logged!',
      `Added ${entry.carbs}g carbs from ${entry.name}`,
      [{ text: 'OK' }]
    );
  };

  const handleBloodSugarSave = (reading: BloodSugarReading) => {
    setBloodSugarReadings([...bloodSugarReadings, reading]);
    Alert.alert(
      'Blood Sugar Logged!',
      `Recorded ${reading.value} mg/dL reading`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.subtitle}>Ready to prep some healthy meals?</Text>
        </View>

        {/* Enhanced Carb Progress Card */}
        <View style={styles.carbProgressCard}>
          <View style={styles.carbProgressHeader}>
            <View style={styles.carbProgressTitleContainer}>
              <Target size={24} color="#16A34A" />
              <Text style={styles.carbProgressTitle}>Today's Carbs</Text>
            </View>
            <TouchableOpacity 
              style={styles.quickLogButton}
              onPress={() => setCarbModalVisible(true)}
            >
              <Plus size={16} color="#ffffff" />
              <Text style={styles.quickLogText}>Log</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.carbProgressMain}>
            <Text style={styles.carbProgressValue}>
              {todayStats.carbsConsumed}g
            </Text>
            <Text style={styles.carbProgressTarget}>
              of {todayStats.carbsTarget}g
            </Text>
          </View>
          
          <View style={styles.carbProgressBar}>
            <View 
              style={[
                styles.carbProgressFill,
                { 
                  width: `${Math.min((todayStats.carbsConsumed / todayStats.carbsTarget) * 100, 100)}%`,
                  backgroundColor: getCarbProgressColor()
                }
              ]} 
            />
          </View>
          
          <Text style={styles.carbProgressPercentage}>
            {Math.round((todayStats.carbsConsumed / todayStats.carbsTarget) * 100)}% of daily target
          </Text>
        </View>

        {/* Blood Sugar Card */}
        <View style={styles.bloodSugarCard}>
          <View style={styles.bloodSugarHeader}>
            <View style={styles.bloodSugarTitleContainer}>
              <Droplets size={24} color="#10B981" />
              <Text style={styles.bloodSugarTitle}>Blood Sugar</Text>
            </View>
            <TouchableOpacity 
              style={styles.bloodSugarLogButton}
              onPress={() => setBloodSugarModalVisible(true)}
            >
              <Plus size={16} color="#ffffff" />
              <Text style={styles.bloodSugarLogText}>Log</Text>
            </TouchableOpacity>
          </View>
          
          {latestBloodSugar ? (
            <View style={styles.bloodSugarContent}>
              <View style={styles.bloodSugarMain}>
                <Text style={[
                  styles.bloodSugarValue,
                  { color: getBloodSugarStatus(latestBloodSugar.value).color }
                ]}>
                  {latestBloodSugar.value}
                </Text>
                <Text style={styles.bloodSugarUnit}>mg/dL</Text>
              </View>
              <View style={styles.bloodSugarMeta}>
                <Text style={styles.bloodSugarStatus}>
                  {getBloodSugarStatus(latestBloodSugar.value).status}
                </Text>
                <Text style={styles.bloodSugarTime}>
                  {latestBloodSugar.readingType} • {latestBloodSugar.time}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.bloodSugarEmpty}>
              <Text style={styles.bloodSugarEmptyText}>No readings today</Text>
              <Text style={styles.bloodSugarEmptySubtext}>Tap "Log" to add your first reading</Text>
            </View>
          )}
        </View>

        {/* Today's Progress */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{todayStats.mealsPrepped}</Text>
              <Text style={styles.progressLabel}>Meals Prepped</Text>
              <Text style={styles.progressTarget}>this week</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <View style={styles.progressItemHeader}>
                <Activity size={16} color="#10B981" />
                <Text style={styles.progressLabel}>Blood Sugar</Text>
              </View>
              <Text style={styles.progressNumber}>
                {latestBloodSugar ? getBloodSugarStatus(latestBloodSugar.value).status : 'No Data'}
              </Text>
              <Text style={styles.progressTarget}>last reading</Text>
            </View>
          </View>
          
          <View style={styles.nextMealContainer}>
            <Clock size={20} color="#16A34A" />
            <Text style={styles.nextMealText}>
              Next meal: {todayStats.nextMeal} at {todayStats.nextMealTime}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Calendar size={24} color="#16A34A" />
              <Text style={styles.actionText}>Plan This Week</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setCarbModalVisible(true)}
            >
              <Target size={24} color="#16A34A" />
              <Text style={styles.actionText}>Log Carbs</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setBloodSugarModalVisible(true)}
            >
              <Droplets size={24} color="#16A34A" />
              <Text style={styles.actionText}>Log Blood Sugar</Text>
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
              <TouchableOpacity 
                key={recipe.id} 
                style={styles.recipeCard}
                onPress={() => handleRecipePress(recipe)}
                activeOpacity={0.7}
              >
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

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        visible={modalVisible}
        recipe={selectedRecipe}
        onClose={() => {
          setModalVisible(false);
          setSelectedRecipe(null);
        }}
        onAddToMealPlan={handleAddToMealPlan}
      />

      {/* Carb Counter Modal */}
      <CarbCounterModal
        visible={carbModalVisible}
        onClose={() => setCarbModalVisible(false)}
        onSave={handleCarbEntrySave}
      />

      {/* Blood Sugar Modal */}
      <BloodSugarModal
        visible={bloodSugarModalVisible}
        onClose={() => setBloodSugarModalVisible(false)}
        onSave={handleBloodSugarSave}
      />
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
    marginTop: 24,
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
  carbProgressCard: {
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
  carbProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  carbProgressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  carbProgressTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  quickLogButton: {
    backgroundColor: '#16A34A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickLogText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  carbProgressMain: {
    alignItems: 'center',
    marginBottom: 16,
  },
  carbProgressValue: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
    marginBottom: 4,
  },
  carbProgressTarget: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  carbProgressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  carbProgressFill: {
    height: '100%',
    borderRadius: 6,
  },
  carbProgressPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  bloodSugarCard: {
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
  bloodSugarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bloodSugarTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bloodSugarTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  bloodSugarLogButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bloodSugarLogText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  bloodSugarContent: {
    alignItems: 'center',
  },
  bloodSugarMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  bloodSugarValue: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    marginRight: 4,
  },
  bloodSugarUnit: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  bloodSugarMeta: {
    alignItems: 'center',
  },
  bloodSugarStatus: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  bloodSugarTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  bloodSugarEmpty: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  bloodSugarEmptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  bloodSugarEmptySubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
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
  progressItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
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
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '30%',
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
    textAlign: 'center',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
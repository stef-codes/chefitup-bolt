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
import { ChevronLeft, ChevronRight, Plus, Clock, Users, Calendar, ChefHat, Shuffle } from 'lucide-react-native';
import { router } from 'expo-router';
import MealPlanCustomizationModal from '../../components/MealPlanCustomizationModal';
import { showToast } from '../../utils/toast';

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

interface MealPlan {
  [day: string]: {
    [mealType: string]: Recipe;
  };
}

const userProfile = {
  name: 'Sarah Johnson',
  avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
};

const handleProfilePress = () => {
  router.push('/(tabs)/profile');
};

const MealPlanScreen = () => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [customizationModalVisible, setCustomizationModalVisible] = useState(false);
  const [selectedMealSlot, setSelectedMealSlot] = useState<{
    day: string;
    mealType: string;
    currentRecipe: Recipe | null;
  } | null>(null);

  // Update current date every minute to keep it accurate
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Initialize selected day to today when component mounts
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayBasedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Monday-based index
    setSelectedDay(mondayBasedIndex);
  }, []);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const [mealPlan, setMealPlan] = useState<MealPlan>({
    Monday: {
      Breakfast: {
        id: 1,
        name: 'Greek Yogurt Parfait with Berries',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
        carbs: 28,
        protein: 20,
        calories: 180,
        prepTime: 10,
        servings: 1,
        glycemicIndex: 'Medium',
        category: 'Breakfast',
        difficulty: 'Easy',
        isFavorite: false,
      },
      Lunch: {
        id: 2,
        name: 'Mediterranean Quinoa Bowl',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 35,
        protein: 12,
        calories: 320,
        prepTime: 25,
        servings: 2,
        glycemicIndex: 'Low',
        category: 'Lunch',
        difficulty: 'Easy',
        isFavorite: true,
      },
      Dinner: {
        id: 3,
        name: 'Herb-Crusted Salmon with Vegetables',
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
        carbs: 12,
        protein: 32,
        calories: 380,
        prepTime: 30,
        servings: 4,
        glycemicIndex: 'Very Low',
        category: 'Dinner',
        difficulty: 'Medium',
        isFavorite: false,
      },
      Snacks: {
        id: 100,
        name: 'Apple with Almond Butter',
        image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
        carbs: 25,
        protein: 6,
        calories: 180,
        prepTime: 5,
        servings: 1,
        glycemicIndex: 'Low',
        category: 'Snacks',
        difficulty: 'Easy',
        isFavorite: true,
      },
    },
    Tuesday: {
      Breakfast: {
        id: 4,
        name: 'Almond Flour Pancakes',
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
        carbs: 22,
        protein: 16,
        calories: 350,
        prepTime: 15,
        servings: 2,
        glycemicIndex: 'Low',
        category: 'Breakfast',
        difficulty: 'Easy',
        isFavorite: false,
      },
      Lunch: {
        id: 5,
        name: 'Cauliflower Rice Stir-Fry',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 18,
        protein: 14,
        calories: 280,
        prepTime: 20,
        servings: 3,
        glycemicIndex: 'Low',
        category: 'Lunch',
        difficulty: 'Easy',
        isFavorite: true,
      },
      Dinner: {
        id: 6,
        name: 'Zucchini Noodle Bolognese',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 15,
        protein: 25,
        calories: 290,
        prepTime: 35,
        servings: 4,
        glycemicIndex: 'Low',
        category: 'Dinner',
        difficulty: 'Medium',
        isFavorite: true,
      },
      Snacks: {
        id: 101,
        name: 'Greek Yogurt with Berries',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
        carbs: 18,
        protein: 15,
        calories: 150,
        prepTime: 3,
        servings: 1,
        glycemicIndex: 'Low',
        category: 'Snacks',
        difficulty: 'Easy',
        isFavorite: false,
      },
    },
    Wednesday: {
      Breakfast: {
        id: 7,
        name: 'Chia Seed Pudding Bowl',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
        carbs: 18,
        protein: 12,
        calories: 280,
        prepTime: 5,
        servings: 1,
        glycemicIndex: 'Low',
        category: 'Breakfast',
        difficulty: 'Easy',
        isFavorite: true,
      },
      Lunch: {
        id: 8,
        name: 'Grilled Chicken Caesar Salad',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 12,
        protein: 35,
        calories: 320,
        prepTime: 20,
        servings: 1,
        glycemicIndex: 'Very Low',
        category: 'Lunch',
        difficulty: 'Easy',
        isFavorite: false,
      },
      Dinner: {
        id: 9,
        name: 'Stuffed Bell Peppers',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 22,
        protein: 20,
        calories: 310,
        prepTime: 45,
        servings: 4,
        glycemicIndex: 'Low',
        category: 'Dinner',
        difficulty: 'Medium',
        isFavorite: true,
      },
      Snacks: {
        id: 102,
        name: 'Carrot Sticks with Hummus',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 20,
        protein: 8,
        calories: 160,
        prepTime: 8,
        servings: 1,
        glycemicIndex: 'Low',
        category: 'Snacks',
        difficulty: 'Easy',
        isFavorite: true,
      },
    },
    Thursday: {
      Breakfast: {
        id: 10,
        name: 'Veggie Scrambled Eggs',
        image: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg',
        carbs: 8,
        protein: 24,
        calories: 290,
        prepTime: 12,
        servings: 2,
        glycemicIndex: 'Very Low',
        category: 'Breakfast',
        difficulty: 'Easy',
        isFavorite: false,
      },
      Lunch: {
        id: 11,
        name: 'Turkey and Hummus Wrap',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 28,
        protein: 24,
        calories: 380,
        prepTime: 10,
        servings: 1,
        glycemicIndex: 'Medium',
        category: 'Lunch',
        difficulty: 'Easy',
        isFavorite: true,
      },
      Dinner: {
        id: 12,
        name: 'Baked Cod with Roasted Vegetables',
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
        carbs: 16,
        protein: 28,
        calories: 290,
        prepTime: 35,
        servings: 3,
        glycemicIndex: 'Low',
        category: 'Dinner',
        difficulty: 'Easy',
        isFavorite: false,
      },
      Snacks: {
        id: 103,
        name: 'Mixed Nuts and Seeds',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 12,
        protein: 12,
        calories: 200,
        prepTime: 2,
        servings: 1,
        glycemicIndex: 'Very Low',
        category: 'Snacks',
        difficulty: 'Easy',
        isFavorite: false,
      },
    },
    Friday: {
      Breakfast: {
        id: 13,
        name: 'Protein Smoothie Bowl',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
        carbs: 26,
        protein: 22,
        calories: 340,
        prepTime: 10,
        servings: 1,
        glycemicIndex: 'Low',
        category: 'Breakfast',
        difficulty: 'Easy',
        isFavorite: true,
      },
      Lunch: {
        id: 14,
        name: 'Hearty Lentil Soup',
        image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
        carbs: 32,
        protein: 16,
        calories: 290,
        prepTime: 35,
        servings: 4,
        glycemicIndex: 'Low',
        category: 'Lunch',
        difficulty: 'Medium',
        isFavorite: false,
      },
      Dinner: {
        id: 15,
        name: 'Turkey Meatballs with Marinara',
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
        carbs: 18,
        protein: 26,
        calories: 320,
        prepTime: 30,
        servings: 4,
        glycemicIndex: 'Low',
        category: 'Dinner',
        difficulty: 'Medium',
        isFavorite: true,
      },
      Snacks: {
        id: 104,
        name: 'Celery with Peanut Butter',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 15,
        protein: 8,
        calories: 170,
        prepTime: 5,
        servings: 1,
        glycemicIndex: 'Low',
        category: 'Snacks',
        difficulty: 'Easy',
        isFavorite: false,
      },
    },
    Saturday: {
      Breakfast: {
        id: 16,
        name: 'Avocado Toast with Poached Egg',
        image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
        carbs: 24,
        protein: 18,
        calories: 380,
        prepTime: 8,
        servings: 1,
        glycemicIndex: 'Low',
        category: 'Breakfast',
        difficulty: 'Easy',
        isFavorite: false,
      },
      Lunch: {
        id: 17,
        name: 'Colorful Buddha Bowl',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 38,
        protein: 14,
        calories: 410,
        prepTime: 30,
        servings: 2,
        glycemicIndex: 'Low',
        category: 'Lunch',
        difficulty: 'Medium',
        isFavorite: true,
      },
      Dinner: {
        id: 18,
        name: 'Grilled Chicken Thighs',
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
        carbs: 6,
        protein: 38,
        calories: 420,
        prepTime: 25,
        servings: 4,
        glycemicIndex: 'Very Low',
        category: 'Dinner',
        difficulty: 'Easy',
        isFavorite: false,
      },
      Snacks: {
        id: 105,
        name: 'Hard-Boiled Eggs with Avocado',
        image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
        carbs: 8,
        protein: 16,
        calories: 220,
        prepTime: 12,
        servings: 1,
        glycemicIndex: 'Very Low',
        category: 'Snacks',
        difficulty: 'Easy',
        isFavorite: true,
      },
    },
    Sunday: {
      Breakfast: {
        id: 19,
        name: 'Steel Cut Oatmeal Bowl',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
        carbs: 35,
        protein: 8,
        calories: 250,
        prepTime: 25,
        servings: 1,
        glycemicIndex: 'Medium',
        category: 'Breakfast',
        difficulty: 'Easy',
        isFavorite: true,
      },
      Lunch: {
        id: 20,
        name: 'Chickpea Salad Sandwich',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 42,
        protein: 18,
        calories: 390,
        prepTime: 15,
        servings: 2,
        glycemicIndex: 'Medium',
        category: 'Lunch',
        difficulty: 'Easy',
        isFavorite: true,
      },
      Dinner: {
        id: 21,
        name: 'Herb-Crusted Pork Tenderloin',
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
        carbs: 8,
        protein: 34,
        calories: 380,
        prepTime: 40,
        servings: 4,
        glycemicIndex: 'Very Low',
        category: 'Dinner',
        difficulty: 'Medium',
        isFavorite: true,
      },
      Snacks: {
        id: 106,
        name: 'Cottage Cheese with Berries',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
        carbs: 22,
        protein: 18,
        calories: 190,
        prepTime: 3,
        servings: 1,
        glycemicIndex: 'Low',
        category: 'Snacks',
        difficulty: 'Easy',
        isFavorite: false,
      },
    },
  });

  const calculateWeeklyStats = () => {
    let totalCarbs = 0;
    let totalCalories = 0;
    let totalPrepTime = 0;
    let recipeCount = 0;

    Object.values(mealPlan).forEach(day => {
      Object.values(day).forEach(meal => {
        totalCarbs += meal.carbs;
        totalCalories += meal.calories;
        totalPrepTime += meal.prepTime;
        recipeCount++;
      });
    });

    return {
      totalCarbs,
      avgDailyCarbs: Math.round(totalCarbs / 7),
      prepTime: Math.round(totalPrepTime / 60 * 10) / 10, // Convert to hours
      variety: recipeCount,
      avgCalories: Math.round(totalCalories / 7),
    };
  };

  const weeklyStats = calculateWeeklyStats();

  const navigateWeek = (direction: number) => {
    setSelectedWeek(selectedWeek + direction);
  };

  const navigateDay = (direction: number) => {
    const newDay = selectedDay + direction;
    if (newDay >= 0 && newDay < 7) {
      setSelectedDay(newDay);
    }
  };

  // Get the date for a specific day in the selected week
  const getDateForDay = (dayIndex: number) => {
    const today = new Date(currentDate);
    const currentDayOfWeek = today.getDay();
    const mondayBasedToday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    
    // Calculate days from today to the target day
    const daysFromToday = (selectedWeek * 7) + (dayIndex - mondayBasedToday);
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysFromToday);
    
    return targetDate;
  };

  // Check if a specific day is today
  const isToday = (dayIndex: number) => {
    if (selectedWeek !== 0) return false;
    
    const today = new Date(currentDate);
    const currentDayOfWeek = today.getDay();
    const mondayBasedToday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    
    return dayIndex === mondayBasedToday;
  };

  // Get week title based on selected week
  const getWeekTitle = () => {
    if (selectedWeek === 0) return 'This Week';
    if (selectedWeek === 1) return 'Next Week';
    if (selectedWeek === -1) return 'Last Week';
    return selectedWeek > 0 ? `${selectedWeek + 1} Weeks Ahead` : `${Math.abs(selectedWeek)} Weeks Ago`;
  };

  // Format date for display
  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== currentDate.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleMealCustomization = (day: string, mealType: string) => {
    const currentRecipe = mealPlan[day]?.[mealType] || null;
    setSelectedMealSlot({ day, mealType, currentRecipe });
    setCustomizationModalVisible(true);
  };

  const handleRecipeSelect = (recipe: Recipe, mealType: string, day: string) => {
    setMealPlan(prevPlan => ({
      ...prevPlan,
      [day]: {
        ...prevPlan[day],
        [mealType]: recipe,
      },
    }));
    
    showToast({
      message: `Recipe Updated!\n${recipe.name} has been added to ${day} ${mealType}`,
      backgroundColor: '#16A34A',
    });
  };

  const generateRandomMealPlan = () => {
    showToast({
      message: 'Generate New Meal Plan\nThis will create a new diabetes-friendly meal plan for the week.',
      backgroundColor: '#10B981',
    });
  };

  const handleGenerateShoppingList = () => {
    // Navigate to the shopping list tab
    router.push('/(tabs)/shopping');
  };

  const currentDayName = weekDays[selectedDay];
  const currentDayMeals = mealPlan[currentDayName];
  const selectedDayDate = getDateForDay(selectedDay);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}> 
          <View>
            <Text style={styles.title}>Meal Plan</Text>
            <Text style={styles.subtitle}>Your weekly diabetes-friendly menu</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileIcon}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: userProfile.avatar }} 
              style={styles.profileAvatar}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Week Navigation */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateWeek(-1)}
          >
            <View>
              <ChevronLeft size={20} color="#16A34A" />
            </View>
          </TouchableOpacity>
        
          <Text style={styles.weekTitle}>
            {getWeekTitle()}
          </Text>
  
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateWeek(1)}
          >
            <View>
              <ChevronRight size={20} color="#16A34A" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Weekly Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Weekly Overview</Text>
            <TouchableOpacity 
              style={styles.regenerateButton}
              onPress={generateRandomMealPlan}
            >
              <View>
              <Shuffle size={16} color="#16A34A" />
            </View>
              <Text style={styles.regenerateText}>Regenerate</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weeklyStats.totalCarbs}g</Text>
              <Text style={styles.statLabel}>Total Carbs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weeklyStats.avgDailyCarbs}g</Text>
              <Text style={styles.statLabel}>Daily Avg</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weeklyStats.prepTime}h</Text>
              <Text style={styles.statLabel}>Prep Time</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weeklyStats.variety}</Text>
              <Text style={styles.statLabel}>Recipes</Text>
            </View>
          </View>
        </View>

        {/* Day Selector */}
        <View style={styles.daySelector}>
          <TouchableOpacity 
            style={[styles.dayNavButton, selectedDay === 0 && styles.dayNavButtonDisabled]}
            onPress={() => navigateDay(-1)}
            disabled={selectedDay === 0}
          >
            <View>
              <ChevronLeft size={20} color={selectedDay === 0 ? '#9CA3AF' : '#16A34A'} />
            </View>
          </TouchableOpacity>

          <View style={styles.dayInfo}>
            <Text style={[styles.dayName, isToday(selectedDay) && styles.todayText]}>
              {currentDayName}
              {isToday(selectedDay) && (
                <Text style={styles.todayLabel}> (Today)</Text>
              )}
            </Text>
            <Text style={styles.dayDate}>
              {formatDateForDisplay(selectedDayDate)}
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.dayNavButton, selectedDay === 6 && styles.dayNavButtonDisabled]}
            onPress={() => navigateDay(1)}
            disabled={selectedDay === 6}
          >
            <View>
              <ChevronRight size={20} color={selectedDay === 6 ? '#9CA3AF' : '#16A34A'} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Day Dots Indicator */}
        <View style={styles.dayDots}>
          {weekDays.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayDot,
                selectedDay === index && styles.dayDotActive,
                isToday(index) && styles.dayDotToday,
              ]}
              onPress={() => setSelectedDay(index)}
            />
          ))}
        </View>

        {/* Daily Meals */}
        <View style={styles.dailyMealsCard}>
          <View style={styles.dailyMealsHeader}>
            <Text style={styles.dailyMealsTitle}>
              {currentDayName}'s Meals
              {isToday(selectedDay) && (
                <Text style={styles.todayMealsLabel}> (Today)</Text>
              )}
            </Text>
          </View>
          
          {mealTypes.map((mealType) => {
            const meal = currentDayMeals?.[mealType];
            
            return (
              <View key={mealType} style={styles.mealSection}>
                <View style={styles.mealSectionHeader}>
                  <Text style={styles.mealTypeTitle}>{mealType}</Text>
                  <TouchableOpacity 
                    style={styles.swapButton}
                    onPress={() => handleMealCustomization(currentDayName, mealType)}
                  >
                    <View>
              <Shuffle size={14} color="#16A34A" />
            </View>
                    <Text style={styles.swapButtonText}>Swap</Text>
                  </TouchableOpacity>
                </View>
                
                {meal ? (
                  <TouchableOpacity 
                    style={styles.mealCard}
                    onPress={() => handleMealCustomization(currentDayName, mealType)}
                  >
                    <Image source={{ uri: meal.image }} style={styles.mealImage} />
                    <View style={styles.mealContent}>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <View style={styles.mealStats}>
                        <View style={styles.mealStat}>
                          <Text style={styles.mealStatValue}>{meal.carbs}g</Text>
                          <Text style={styles.mealStatLabel}>carbs</Text>
                        </View>
                        <View style={styles.mealStat}>
                          <View>
              <Clock size={14} color="#6B7280" />
            </View>
                          <Text style={styles.mealStatText}>{meal.prepTime}m</Text>
                        </View>
                        <View style={styles.mealStat}>
                          <View>
              <Users size={14} color="#6B7280" />
            </View>
                          <Text style={styles.mealStatText}>{meal.servings}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.emptyMealCard}
                    onPress={() => handleMealCustomization(currentDayName, mealType)}
                  >
                    <View>
              <Plus size={24} color="#9CA3AF" />
            </View>
                    <Text style={styles.emptyMealText}>Add {mealType.toLowerCase()}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Week Overview - Compact Grid */}
        <View style={styles.weekOverviewCard}>
          <Text style={styles.weekOverviewTitle}>Week at a Glance</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.weekGrid}>
              {/* Header Row */}
              <View style={styles.weekGridRow}>
                <View style={styles.weekGridCell} />
                {shortDays.map((day, index) => (
                  <TouchableOpacity 
                    key={day} 
                    style={[
                      styles.weekGridHeaderCell,
                      selectedDay === index && styles.weekGridHeaderCellSelected,
                      isToday(index) && styles.weekGridHeaderCellToday,
                    ]}
                    onPress={() => setSelectedDay(index)}
                  >
                    <Text style={[
                      styles.weekGridHeaderText,
                      selectedDay === index && styles.weekGridHeaderTextSelected,
                      isToday(index) && styles.weekGridHeaderTextToday,
                    ]}>
                      {day}
                    </Text>
                    <Text style={[
                      styles.weekGridDateText,
                      selectedDay === index && styles.weekGridHeaderTextSelected,
                      isToday(index) && styles.weekGridHeaderTextToday,
                    ]}>
                      {getDateForDay(index).getDate()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Meal Rows */}
              {mealTypes.map((mealType) => (
                <View key={mealType} style={styles.weekGridRow}>
                  <View style={styles.weekGridMealTypeCell}>
                    <Text style={styles.weekGridMealTypeText}>{mealType}</Text>
                  </View>
                  
                  {weekDays.map((dayName, dayIndex) => {
                    const meal = mealPlan[dayName]?.[mealType];
                    
                    return (
                      <TouchableOpacity 
                        key={`${dayName}-${mealType}`} 
                        style={[
                          styles.weekGridMealCell,
                          selectedDay === dayIndex && styles.weekGridMealCellSelected,
                          isToday(dayIndex) && styles.weekGridMealCellToday,
                        ]}
                        onPress={() => handleMealCustomization(dayName, mealType)}
                      >
                        {meal ? (
                          <View style={styles.weekGridMealContent}>
                            <View style={styles.weekGridMealIndicator} />
                            <Text style={styles.weekGridMealCarbs}>{meal.carbs}g</Text>
                          </View>
                        ) : (
                          <View style={styles.weekGridEmptyMeal}>
                            <View>
              <Plus size={12} color="#D1D5DB" />
            </View>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleGenerateShoppingList}>
            <View>
              <Calendar size={20} color="#ffffff" />
            </View>
            <Text style={styles.primaryButtonText}>Generate Shopping List</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Meal Plan Customization Modal */}
      <MealPlanCustomizationModal
        visible={customizationModalVisible}
        onClose={() => {
          setCustomizationModalVisible(false);
          setSelectedMealSlot(null);
        }}
        currentRecipe={selectedMealSlot?.currentRecipe || null}
        mealType={selectedMealSlot?.mealType || ''}
        day={selectedMealSlot?.day || ''}
        onRecipeSelect={handleRecipeSelect}
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
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  navButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weekTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  regenerateText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  daySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dayNavButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  dayNavButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  dayInfo: {
    alignItems: 'center',
  },
  dayName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  todayText: {
    color: '#F59E0B',
  },
  todayLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  dayDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  dayDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  dayDotActive: {
    backgroundColor: '#16A34A',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dayDotToday: {
    backgroundColor: '#F59E0B',
  },
  dailyMealsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dailyMealsHeader: {
    marginBottom: 20,
  },
  dailyMealsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  todayMealsLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  mealSection: {
    marginBottom: 24,
  },
  mealSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTypeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  swapButtonText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  mealImage: {
    width: 80,
    height: 80,
  },
  mealContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  mealName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 20,
  },
  mealStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mealStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mealStatValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  mealStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  mealStatText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emptyMealCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMealText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginTop: 8,
  },
  weekOverviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weekOverviewTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  weekGrid: {
    minWidth: 600,
  },
  weekGridRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekGridCell: {
    width: 80,
    height: 50,
  },
  weekGridHeaderCell: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  weekGridHeaderCellSelected: {
    backgroundColor: '#DCFCE7',
  },
  weekGridHeaderCellToday: {
    backgroundColor: '#FEF3C7',
  },
  weekGridHeaderText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  weekGridDateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  weekGridHeaderTextSelected: {
    color: '#16A34A',
  },
  weekGridHeaderTextToday: {
    color: '#F59E0B',
  },
  weekGridMealTypeCell: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    paddingRight: 12,
  },
  weekGridMealTypeText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    textAlign: 'right',
  },
  weekGridMealCell: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  weekGridMealCellSelected: {
    backgroundColor: '#DCFCE7',
  },
  weekGridMealCellToday: {
    backgroundColor: '#FEF3C7',
  },
  weekGridMealContent: {
    alignItems: 'center',
  },
  weekGridMealIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
    marginBottom: 3,
  },
  weekGridMealCarbs: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  weekGridEmptyMeal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  profileIcon: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    transform: [{ scale: 1 }],
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});

export default MealPlanScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Plus, Clock, Users } from 'lucide-react-native';

const MealPlanScreen = () => {
  const [selectedWeek, setSelectedWeek] = useState(0);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  const mealPlan = {
    Mon: {
      Breakfast: {
        id: 1,
        name: 'Greek Yogurt Parfait',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
        carbs: 28,
        prepTime: 10,
        servings: 1,
      },
      Lunch: {
        id: 2,
        name: 'Mediterranean Quinoa Bowl',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 35,
        prepTime: 25,
        servings: 2,
      },
      Dinner: {
        id: 3,
        name: 'Herb-Crusted Salmon',
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
        carbs: 12,
        prepTime: 30,
        servings: 4,
      },
    },
    Tue: {
      Breakfast: {
        id: 4,
        name: 'Almond Flour Pancakes',
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
        carbs: 22,
        prepTime: 15,
        servings: 2,
      },
      Lunch: {
        id: 5,
        name: 'Cauliflower Rice Stir-Fry',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 18,
        prepTime: 20,
        servings: 3,
      },
      Dinner: {
        id: 6,
        name: 'Zucchini Noodle Bolognese',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 15,
        prepTime: 35,
        servings: 4,
      },
    },
    Wed: {
      Breakfast: {
        id: 7,
        name: 'Chia Seed Pudding',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
        carbs: 18,
        prepTime: 5,
        servings: 1,
      },
      Lunch: {
        id: 8,
        name: 'Grilled Chicken Salad',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 12,
        prepTime: 20,
        servings: 1,
      },
      Dinner: {
        id: 9,
        name: 'Stuffed Bell Peppers',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 22,
        prepTime: 45,
        servings: 4,
      },
    },
    Thu: {
      Breakfast: {
        id: 10,
        name: 'Veggie Scrambled Eggs',
        image: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg',
        carbs: 8,
        prepTime: 12,
        servings: 2,
      },
      Lunch: {
        id: 11,
        name: 'Turkey and Hummus Wrap',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 28,
        prepTime: 10,
        servings: 1,
      },
      Dinner: {
        id: 12,
        name: 'Baked Cod with Vegetables',
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
        carbs: 16,
        prepTime: 35,
        servings: 3,
      },
    },
    Fri: {
      Breakfast: {
        id: 13,
        name: 'Protein Smoothie Bowl',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
        carbs: 26,
        prepTime: 10,
        servings: 1,
      },
      Lunch: {
        id: 14,
        name: 'Lentil Soup',
        image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
        carbs: 32,
        prepTime: 35,
        servings: 4,
      },
      Dinner: {
        id: 15,
        name: 'Turkey Meatballs',
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
        carbs: 18,
        prepTime: 30,
        servings: 4,
      },
    },
    Sat: {
      Breakfast: {
        id: 16,
        name: 'Avocado Toast with Egg',
        image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
        carbs: 24,
        prepTime: 8,
        servings: 1,
      },
      Lunch: {
        id: 17,
        name: 'Buddha Bowl',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 38,
        prepTime: 30,
        servings: 2,
      },
      Dinner: {
        id: 18,
        name: 'Grilled Chicken Thighs',
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
        carbs: 6,
        prepTime: 25,
        servings: 4,
      },
    },
    Sun: {
      Breakfast: {
        id: 19,
        name: 'Steel Cut Oatmeal Bowl',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
        carbs: 35,
        prepTime: 25,
        servings: 1,
      },
      Lunch: {
        id: 20,
        name: 'Chickpea Salad Sandwich',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        carbs: 42,
        prepTime: 15,
        servings: 2,
      },
      Dinner: {
        id: 21,
        name: 'Pork Tenderloin with Herbs',
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
        carbs: 8,
        prepTime: 40,
        servings: 4,
      },
    },
  };

  const prepSchedule = [
    {
      day: 'Sunday',
      tasks: [
        'Prep quinoa bowls for Mon-Wed',
        'Marinate salmon for Mon dinner',
        'Wash and chop vegetables',
      ],
      duration: '2.5 hours',
    },
    {
      day: 'Wednesday',
      tasks: [
        'Prep cauliflower rice stir-fry',
        'Make almond flour pancake batter',
        'Prepare snack portions',
      ],
      duration: '1.5 hours',
    },
  ];

  const weeklyStats = {
    totalCarbs: 485,
    avgDailyCarbs: 138,
    prepTime: 4.2,
    variety: 21,
  };

  const navigateWeek = (direction: number) => {
    setSelectedWeek(selectedWeek + direction);
  };

  const formatDate = (dayOffset: number) => {
    const today = new Date();
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset + (selectedWeek * 7));
    return date.getDate();
  };

  const isToday = (dayIndex: number) => {
    const today = new Date().getDay();
    const mondayBasedIndex = today === 0 ? 6 : today - 1; // Convert Sunday=0 to Sunday=6
    return dayIndex === mondayBasedIndex && selectedWeek === 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meal Plan</Text>
          <Text style={styles.subtitle}>Your weekly diabetes-friendly menu</Text>
        </View>

        {/* Week Navigation */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateWeek(-1)}
          >
            <ChevronLeft size={20} color="#16A34A" />
          </TouchableOpacity>
          
          <Text style={styles.weekTitle}>
            {selectedWeek === 0 ? 'This Week' : 
             selectedWeek === 1 ? 'Next Week' : 
             `Week ${selectedWeek + 1}`}
          </Text>
          
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateWeek(1)}
          >
            <ChevronRight size={20} color="#16A34A" />
          </TouchableOpacity>
        </View>

        {/* Weekly Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Weekly Overview</Text>
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

        {/* Meal Plan Grid - Improved Layout */}
        <View style={styles.mealPlanCard}>
          <Text style={styles.mealPlanTitle}>Weekly Meal Plan</Text>
          
          {/* Days Header */}
          <View style={styles.daysHeader}>
            <View style={styles.mealTypeColumn} />
            {weekDays.map((day, dayIndex) => (
              <View key={day} style={styles.dayHeaderCell}>
                <Text style={[
                  styles.dayHeaderText,
                  isToday(dayIndex) && styles.todayHeaderText
                ]}>
                  {day}
                </Text>
                <Text style={[
                  styles.dayHeaderDate,
                  isToday(dayIndex) && styles.todayHeaderText
                ]}>
                  {formatDate(dayIndex)}
                </Text>
              </View>
            ))}
          </View>

          {/* Meal Rows */}
          {mealTypes.map((mealType) => (
            <View key={mealType} style={styles.mealRow}>
              <View style={styles.mealTypeColumn}>
                <Text style={styles.mealTypeText}>{mealType}</Text>
              </View>
              
              {weekDays.map((day, dayIndex) => {
                const meal = mealPlan[day]?.[mealType];
                
                return (
                  <View key={`${day}-${mealType}`} style={[
                    styles.mealCell,
                    isToday(dayIndex) && styles.todayMealCell
                  ]}>
                    {meal ? (
                      <TouchableOpacity style={styles.mealItem}>
                        <Image source={{ uri: meal.image }} style={styles.mealImage} />
                        <View style={styles.mealInfo}>
                          <Text style={styles.mealName} numberOfLines={2}>
                            {meal.name}
                          </Text>
                          <View style={styles.mealMeta}>
                            <Text style={styles.mealCarbs}>{meal.carbs}g</Text>
                            <View style={styles.mealTime}>
                              <Clock size={8} color="#6B7280" />
                              <Text style={styles.mealTimeText}>{meal.prepTime}m</Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.emptyMeal}>
                        <Plus size={16} color="#9CA3AF" />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Prep Schedule */}
        <View style={styles.prepCard}>
          <Text style={styles.prepTitle}>Prep Schedule</Text>
          {prepSchedule.map((prep, index) => (
            <View key={index} style={styles.prepItem}>
              <View style={styles.prepHeader}>
                <Text style={styles.prepDay}>{prep.day}</Text>
                <Text style={styles.prepDuration}>{prep.duration}</Text>
              </View>
              <View style={styles.prepTasks}>
                {prep.tasks.map((task, taskIndex) => (
                  <Text key={taskIndex} style={styles.prepTask}>
                    • {task}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Generate Shopping List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Customize Plan</Text>
          </TouchableOpacity>
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
  statsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
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
  mealPlanCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mealPlanTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  mealTypeColumn: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  dayHeaderDate: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  todayHeaderText: {
    color: '#16A34A',
  },
  mealRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  mealTypeText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mealCell: {
    flex: 1,
    marginHorizontal: 1,
    minHeight: 80,
  },
  todayMealCell: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#16A34A',
  },
  mealItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    height: '100%',
  },
  mealImage: {
    width: '100%',
    height: 40,
  },
  mealInfo: {
    padding: 6,
    flex: 1,
  },
  mealName: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 12,
  },
  mealMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealCarbs: {
    fontSize: 9,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  mealTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  mealTimeText: {
    fontSize: 8,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emptyMeal: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prepCard: {
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
  prepTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  prepItem: {
    marginBottom: 16,
  },
  prepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  prepDay: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  prepDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  prepTasks: {
    gap: 4,
  },
  prepTask: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#16A34A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
});

export default MealPlanScreen;
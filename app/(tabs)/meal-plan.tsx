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
import { ChevronLeft, ChevronRight, Plus, Clock, Users, Calendar, ChefHat } from 'lucide-react-native';

const MealPlanScreen = () => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0); // For mobile day navigation

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  const mealPlan = {
    Monday: {
      Breakfast: {
        id: 1,
        name: 'Greek Yogurt Parfait with Berries',
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
        name: 'Herb-Crusted Salmon with Vegetables',
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
        carbs: 12,
        prepTime: 30,
        servings: 4,
      },
    },
    Tuesday: {
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
    Wednesday: {
      Breakfast: {
        id: 7,
        name: 'Chia Seed Pudding Bowl',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
        carbs: 18,
        prepTime: 5,
        servings: 1,
      },
      Lunch: {
        id: 8,
        name: 'Grilled Chicken Caesar Salad',
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
    Thursday: {
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
        name: 'Baked Cod with Roasted Vegetables',
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
        carbs: 16,
        prepTime: 35,
        servings: 3,
      },
    },
    Friday: {
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
        name: 'Hearty Lentil Soup',
        image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
        carbs: 32,
        prepTime: 35,
        servings: 4,
      },
      Dinner: {
        id: 15,
        name: 'Turkey Meatballs with Marinara',
        image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
        carbs: 18,
        prepTime: 30,
        servings: 4,
      },
    },
    Saturday: {
      Breakfast: {
        id: 16,
        name: 'Avocado Toast with Poached Egg',
        image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
        carbs: 24,
        prepTime: 8,
        servings: 1,
      },
      Lunch: {
        id: 17,
        name: 'Colorful Buddha Bowl',
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
    Sunday: {
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
        name: 'Herb-Crusted Pork Tenderloin',
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
        'Make chia pudding for Wed',
      ],
      duration: '2.5 hours',
    },
    {
      day: 'Wednesday',
      tasks: [
        'Prep cauliflower rice stir-fry',
        'Make almond flour pancake batter',
        'Prepare snack portions',
        'Cook lentil soup for Friday',
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

  const navigateDay = (direction: number) => {
    const newDay = selectedDay + direction;
    if (newDay >= 0 && newDay < 7) {
      setSelectedDay(newDay);
    }
  };

  const formatDate = (dayOffset: number) => {
    const today = new Date();
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset + (selectedWeek * 7));
    return date.getDate();
  };

  const isToday = (dayIndex: number) => {
    const today = new Date().getDay();
    const mondayBasedIndex = today === 0 ? 6 : today - 1;
    return dayIndex === mondayBasedIndex && selectedWeek === 0;
  };

  const currentDayName = weekDays[selectedDay];
  const currentDayMeals = mealPlan[currentDayName];

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

        {/* Day Selector */}
        <View style={styles.daySelector}>
          <TouchableOpacity 
            style={[styles.dayNavButton, selectedDay === 0 && styles.dayNavButtonDisabled]}
            onPress={() => navigateDay(-1)}
            disabled={selectedDay === 0}
          >
            <ChevronLeft size={20} color={selectedDay === 0 ? '#9CA3AF' : '#16A34A'} />
          </TouchableOpacity>

          <View style={styles.dayInfo}>
            <Text style={styles.dayName}>{currentDayName}</Text>
            <Text style={styles.dayDate}>
              {new Date(Date.now() + (selectedDay + selectedWeek * 7) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.dayNavButton, selectedDay === 6 && styles.dayNavButtonDisabled]}
            onPress={() => navigateDay(1)}
            disabled={selectedDay === 6}
          >
            <ChevronRight size={20} color={selectedDay === 6 ? '#9CA3AF' : '#16A34A'} />
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
          <Text style={styles.dailyMealsTitle}>
            {currentDayName}'s Meals
          </Text>
          
          {mealTypes.map((mealType) => {
            const meal = currentDayMeals?.[mealType];
            
            return (
              <View key={mealType} style={styles.mealSection}>
                <Text style={styles.mealTypeTitle}>{mealType}</Text>
                
                {meal ? (
                  <TouchableOpacity style={styles.mealCard}>
                    <Image source={{ uri: meal.image }} style={styles.mealImage} />
                    <View style={styles.mealContent}>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <View style={styles.mealStats}>
                        <View style={styles.mealStat}>
                          <Text style={styles.mealStatValue}>{meal.carbs}g</Text>
                          <Text style={styles.mealStatLabel}>carbs</Text>
                        </View>
                        <View style={styles.mealStat}>
                          <Clock size={14} color="#6B7280" />
                          <Text style={styles.mealStatText}>{meal.prepTime}m</Text>
                        </View>
                        <View style={styles.mealStat}>
                          <Users size={14} color="#6B7280" />
                          <Text style={styles.mealStatText}>{meal.servings}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.emptyMealCard}>
                    <Plus size={24} color="#9CA3AF" />
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
                        onPress={() => setSelectedDay(dayIndex)}
                      >
                        {meal ? (
                          <View style={styles.weekGridMealContent}>
                            <View style={styles.weekGridMealIndicator} />
                            <Text style={styles.weekGridMealCarbs}>{meal.carbs}g</Text>
                          </View>
                        ) : (
                          <View style={styles.weekGridEmptyMeal}>
                            <Plus size={12} color="#D1D5DB" />
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

        {/* Prep Schedule */}
        <View style={styles.prepCard}>
          <Text style={styles.prepTitle}>Prep Schedule</Text>
          {prepSchedule.map((prep, index) => (
            <View key={index} style={styles.prepItem}>
              <View style={styles.prepHeader}>
                <View style={styles.prepDayContainer}>
                  <ChefHat size={20} color="#16A34A" />
                  <Text style={styles.prepDay}>{prep.day}</Text>
                </View>
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
            <Calendar size={20} color="#ffffff" />
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
  dailyMealsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 20,
  },
  mealSection: {
    marginBottom: 24,
  },
  mealTypeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
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
    minWidth: 400,
  },
  weekGridRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekGridCell: {
    width: 60,
    height: 32,
  },
  weekGridHeaderCell: {
    width: 44,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    marginHorizontal: 1,
  },
  weekGridHeaderCellSelected: {
    backgroundColor: '#DCFCE7',
  },
  weekGridHeaderCellToday: {
    backgroundColor: '#FEF3C7',
  },
  weekGridHeaderText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  weekGridHeaderTextSelected: {
    color: '#16A34A',
  },
  weekGridHeaderTextToday: {
    color: '#F59E0B',
  },
  weekGridMealTypeCell: {
    width: 60,
    height: 32,
    justifyContent: 'center',
    paddingRight: 8,
  },
  weekGridMealTypeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    textAlign: 'right',
  },
  weekGridMealCell: {
    width: 44,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    marginHorizontal: 1,
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginBottom: 2,
  },
  weekGridMealCarbs: {
    fontSize: 8,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  weekGridEmptyMeal: {
    alignItems: 'center',
    justifyContent: 'center',
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
  prepDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
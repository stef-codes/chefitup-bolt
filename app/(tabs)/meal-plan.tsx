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
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

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
    // Add more days as needed
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
    variety: 12,
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

        {/* Days Grid */}
        <View style={styles.daysGrid}>
          {weekDays.map((day, dayIndex) => (
            <View key={day} style={styles.dayColumn}>
              <View style={[
                styles.dayHeader,
                isToday(dayIndex) && styles.todayHeader
              ]}>
                <Text style={[
                  styles.dayName,
                  isToday(dayIndex) && styles.todayText
                ]}>
                  {day}
                </Text>
                <Text style={[
                  styles.dayDate,
                  isToday(dayIndex) && styles.todayText
                ]}>
                  {formatDate(dayIndex)}
                </Text>
              </View>
              
              {mealTypes.map((mealType) => {
                const meal = mealPlan[day]?.[mealType];
                
                return (
                  <View key={`${day}-${mealType}`} style={styles.mealSlot}>
                    <Text style={styles.mealTypeLabel}>{mealType}</Text>
                    {meal ? (
                      <TouchableOpacity style={styles.mealCard}>
                        <Image source={{ uri: meal.image }} style={styles.mealImage} />
                        <View style={styles.mealInfo}>
                          <Text style={styles.mealName} numberOfLines={2}>
                            {meal.name}
                          </Text>
                          <View style={styles.mealMeta}>
                            <Text style={styles.mealCarbs}>{meal.carbs}g carbs</Text>
                            <View style={styles.mealDetails}>
                              <Clock size={10} color="#6B7280" />
                              <Text style={styles.mealTime}>{meal.prepTime}m</Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.emptyMealSlot}>
                        <Plus size={20} color="#9CA3AF" />
                        <Text style={styles.addMealText}>Add meal</Text>
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
  daysGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  dayColumn: {
    flex: 1,
    minWidth: 120,
  },
  dayHeader: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  todayHeader: {
    backgroundColor: '#16A34A',
  },
  dayName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  dayDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  todayText: {
    color: '#ffffff',
  },
  mealSlot: {
    marginBottom: 8,
  },
  mealTypeLabel: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mealCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  mealImage: {
    width: '100%',
    height: 60,
  },
  mealInfo: {
    padding: 8,
  },
  mealName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 16,
  },
  mealMeta: {
    gap: 2,
  },
  mealCarbs: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  mealDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  mealTime: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emptyMealSlot: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  addMealText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginTop: 4,
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
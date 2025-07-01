import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Target,
  Zap,
  Activity,
  Heart,
  Droplets,
  Plus,
  X,
  Search,
  Edit3,
  Trash2,
} from 'lucide-react-native';
import BloodSugarModal from '../../components/BloodSugarModal';
import CustomMealModal from '../../components/CustomMealModal';
import { useRouter } from 'expo-router';

interface NutritionEntry {
  id: number;
  name: string;
  carbs: number;
  protein: number;
  calories: number;
  fats: number;
  sugar: number;
  serving: string;
  time: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
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

interface FoodItem {
  id: number;
  name: string;
  carbs: number;
  protein: number;
  calories: number;
  fats: number;
  sugar: number;
  servingSize: string;
  category: string;
}

const NutritionScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyEntries, setDailyEntries] = useState<NutritionEntry[]>([]);
  const [bloodSugarReadings, setBloodSugarReadings] = useState<BloodSugarReading[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [bloodSugarModalVisible, setBloodSugarModalVisible] = useState(false);
  const [customMealModalVisible, setCustomMealModalVisible] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [customServing, setCustomServing] = useState('1');
  const [customMealType, setCustomMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');

  // User's daily targets
  const dailyTargets = {
    carbs: 150,
    protein: 80,
    calories: 2000,
    fats: 65,
  };

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  // Sample food database
  const foodDatabase: FoodItem[] = [
    { id: 1, name: 'Apple (medium)', carbs: 25, protein: 0.5, calories: 95, fats: 0.3, sugar: 19, servingSize: '1 medium', category: 'Fruits' },
    { id: 2, name: 'Banana (medium)', carbs: 27, protein: 1.3, calories: 105, fats: 0.4, sugar: 14, servingSize: '1 medium', category: 'Fruits' },
    { id: 3, name: 'Orange (medium)', carbs: 15, protein: 1.2, calories: 62, fats: 0.2, sugar: 12, servingSize: '1 medium', category: 'Fruits' },
    { id: 4, name: 'Blueberries', carbs: 21, protein: 1.1, calories: 84, fats: 0.5, sugar: 15, servingSize: '1 cup', category: 'Fruits' },
    { id: 5, name: 'Strawberries', carbs: 11, protein: 1, calories: 49, fats: 0.5, sugar: 7, servingSize: '1 cup', category: 'Fruits' },
    { id: 6, name: 'Broccoli (cooked)', carbs: 11, protein: 4, calories: 55, fats: 0.6, sugar: 2, servingSize: '1 cup', category: 'Vegetables' },
    { id: 7, name: 'Spinach (raw)', carbs: 1, protein: 1, calories: 7, fats: 0.1, sugar: 0, servingSize: '1 cup', category: 'Vegetables' },
    { id: 8, name: 'Sweet Potato (baked)', carbs: 27, protein: 2, calories: 112, fats: 0.2, sugar: 5, servingSize: '1 medium', category: 'Vegetables' },
    { id: 9, name: 'Carrots (raw)', carbs: 12, protein: 1, calories: 50, fats: 0.3, sugar: 6, servingSize: '1 cup', category: 'Vegetables' },
    { id: 10, name: 'Bell Pepper (red)', carbs: 7, protein: 1, calories: 31, fats: 0.3, sugar: 5, servingSize: '1 cup', category: 'Vegetables' },
    { id: 11, name: 'Brown Rice (cooked)', carbs: 45, protein: 5, calories: 216, fats: 1.8, sugar: 1, servingSize: '1 cup', category: 'Grains' },
    { id: 12, name: 'Quinoa (cooked)', carbs: 39, protein: 8, calories: 222, fats: 3.6, sugar: 2, servingSize: '1 cup', category: 'Grains' },
    { id: 13, name: 'Oatmeal (cooked)', carbs: 28, protein: 6, calories: 154, fats: 2.6, sugar: 1, servingSize: '1 cup', category: 'Grains' },
    { id: 14, name: 'Whole Wheat Bread', carbs: 14, protein: 4, calories: 81, fats: 1.1, sugar: 1, servingSize: '1 slice', category: 'Grains' },
    { id: 15, name: 'Chicken Breast (grilled)', carbs: 0, protein: 31, calories: 165, fats: 3.6, sugar: 0, servingSize: '100g', category: 'Proteins' },
    { id: 16, name: 'Salmon (grilled)', carbs: 0, protein: 25, calories: 206, fats: 12, sugar: 0, servingSize: '100g', category: 'Proteins' },
    { id: 17, name: 'Greek Yogurt (plain)', carbs: 9, protein: 20, calories: 130, fats: 0.5, sugar: 9, servingSize: '1 cup', category: 'Proteins' },
    { id: 18, name: 'Eggs (large)', carbs: 1, protein: 6, calories: 70, fats: 5, sugar: 1, servingSize: '1 egg', category: 'Proteins' },
    { id: 19, name: 'Tofu (firm)', carbs: 3, protein: 20, calories: 181, fats: 11, sugar: 1, servingSize: '100g', category: 'Proteins' },
    { id: 20, name: 'Milk (2%)', carbs: 12, protein: 8, calories: 122, fats: 5, sugar: 12, servingSize: '1 cup', category: 'Dairy' },
    { id: 21, name: 'Cheddar Cheese', carbs: 1, protein: 7, calories: 113, fats: 9, sugar: 0, servingSize: '1 oz', category: 'Dairy' },
    { id: 22, name: 'Almonds', carbs: 6, protein: 6, calories: 164, fats: 14, sugar: 1, servingSize: '1 oz', category: 'Nuts & Seeds' },
    { id: 23, name: 'Chia Seeds', carbs: 12, protein: 4, calories: 137, fats: 9, sugar: 0, servingSize: '1 oz', category: 'Nuts & Seeds' },
    { id: 24, name: 'Black Beans (cooked)', carbs: 41, protein: 15, calories: 227, fats: 0.9, sugar: 1, servingSize: '1 cup', category: 'Legumes' },
    { id: 25, name: 'Lentils (cooked)', carbs: 40, protein: 18, calories: 230, fats: 0.8, sugar: 4, servingSize: '1 cup', category: 'Legumes' },
  ];

  const filteredFoods = useMemo(() =>
    foodDatabase.filter(food =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]
  );

  const dailyTotals = useMemo(() => {
    return dailyEntries.reduce(
      (totals, entry) => ({
        carbs: totals.carbs + entry.carbs,
        protein: totals.protein + entry.protein,
        calories: totals.calories + entry.calories,
        fats: totals.fats + entry.fats,
        sugar: totals.sugar + entry.sugar,
      }),
      { carbs: 0, protein: 0, calories: 0, fats: 0, sugar: 0 }
    );
  }, [dailyEntries]);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage <= 50) return '#EF4444'; // Red
    if (percentage <= 80) return '#F59E0B'; // Amber
    if (percentage <= 100) return '#16A34A'; // Green
    return '#DC2626'; // Dark red for over target
  };

  const getBloodSugarStatus = (value: number) => {
    if (value < 70) return { status: 'Low', color: '#EF4444' };
    if (value <= 140) return { status: 'Normal', color: '#10B981' };
    if (value <= 180) return { status: 'High', color: '#F59E0B' };
    return { status: 'Very High', color: '#DC2626' };
  };

  const getTodaysBloodSugarReadings = () => {
    const today = selectedDate.toLocaleDateString('en-US');
    return bloodSugarReadings.filter(reading => reading.date === today);
  };

  const addFoodEntry = useCallback((food: FoodItem) => {
    const servingMultiplier = parseFloat(customServing) || 1;
    const newEntry: NutritionEntry = {
      id: Date.now(),
      name: `${food.name}${servingMultiplier !== 1 ? ` (${customServing}x)` : ''}`,
      carbs: Math.round(food.carbs * servingMultiplier * 10) / 10,
      protein: Math.round(food.protein * servingMultiplier * 10) / 10,
      calories: Math.round(food.calories * servingMultiplier),
      fats: Math.round(food.fats * servingMultiplier * 10) / 10,
      sugar: Math.round(food.sugar * servingMultiplier * 10) / 10,
      serving: `${customServing} ${food.servingSize}`,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      mealType: selectedMealType,
    };

    setDailyEntries(prev => [...prev, newEntry]);
    setAddModalVisible(false);
    setSearchQuery('');
    setCustomServing('1');
  }, [customServing, selectedMealType]);

  const removeEntry = useCallback((id: number) => {
    Alert.alert(
      'Remove Entry',
      'Are you sure you want to remove this nutrition entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {
          setDailyEntries(prev => prev.filter(entry => entry.id !== id));
        }},
      ]
    );
  }, []);

  const handleBloodSugarSave = (reading: BloodSugarReading) => {
    setBloodSugarReadings(prev => [...prev, reading]);
    setTimeout(() => {
      Alert.alert(
        'Blood Sugar Logged!',
        `Recorded ${reading.value} mg/dL reading`,
        [{ text: 'OK' }]
      );
    }, 100);
  };

  const handleCustomMealSave = (customMeal: any) => {
    const newEntry: NutritionEntry = {
      id: Date.now(),
      name: customMeal.name,
      carbs: customMeal.carbs,
      protein: customMeal.protein,
      calories: customMeal.calories,
      fats: customMeal.fats,
      sugar: customMeal.sugar,
      serving: customMeal.serving,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      mealType: customMealType,
    };
    setDailyEntries(prev => [...prev, newEntry]);
    setCustomMealModalVisible(false);
    setTimeout(() => {
      Alert.alert(
        'Custom Meal Added!',
        `${customMeal.name} has been added to your ${customMealType.toLowerCase()}`,
        [{ text: 'OK' }]
      );
    }, 100);
  };

  const handleOpenCustomMealModal = (mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    setCustomMealType(mealType);
    setCustomMealModalVisible(true);
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction);
    setSelectedDate(newDate);
    setDailyEntries([]);
    setBloodSugarReadings([]);
  };

  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  const formatDate = (date: Date) => {
    if (isToday()) return 'Today';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getEntriesForMealType = (mealType: string) => {
    return dailyEntries.filter(entry => entry.mealType === mealType);
  };

  const todaysBloodSugarReadings = getTodaysBloodSugarReadings();
  const latestBloodSugar = todaysBloodSugarReadings.length > 0 
    ? todaysBloodSugarReadings[todaysBloodSugarReadings.length - 1] 
    : null;

  const router = useRouter();

  const userProfile = {
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
  };

  const handleProfilePress = () => {
    // @ts-ignore
    if (typeof router !== 'undefined') {
      router.push('/(tabs)/profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}> 
          <View>
            <Text style={styles.title}>Nutrition</Text>
            {/* Add any subtitle if needed */}
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
        {/* Date Navigation */}
        <View style={styles.dateNavigation}>
          <TouchableOpacity 
            style={styles.dateNavButton} 
            onPress={() => navigateDate(-1)}
          >
            <View>
              <ChevronLeft size={20} color="#16A34A" />
            </View>
          </TouchableOpacity>
          <View style={styles.dateInfo}>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            <Text style={styles.dateSubtext}>
              {selectedDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.dateNavButton} 
            onPress={() => navigateDate(1)}
          >
            <View>
              <ChevronRight size={20} color="#16A34A" />
            </View>
          </TouchableOpacity>
        </View>
        {/* Daily Progress Overview */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Daily Progress</Text>
          {/* Carbs - Primary Focus */}
          <View style={styles.primaryProgress}>
            <View style={styles.progressHeader}>
              <View style={styles.progressLabelContainer}>
                <View>
                  <Target size={20} color="#16A34A" />
                </View>
                <Text style={styles.primaryProgressLabel}>Carbohydrates</Text>
              </View>
              <Text style={styles.primaryProgressValue}>
                {dailyTotals.carbs}g / {dailyTargets.carbs}g
              </Text>
            </View>
            <View style={styles.primaryProgressBar}>
              <View 
                style={[
                  styles.primaryProgressFill,
                  { 
                    width: `${getProgressPercentage(dailyTotals.carbs, dailyTargets.carbs)}%`,
                    backgroundColor: getProgressColor(dailyTotals.carbs, dailyTargets.carbs)
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressPercentage}>
              {Math.round(getProgressPercentage(dailyTotals.carbs, dailyTargets.carbs))}% of daily target
            </Text>
          </View>
          {/* Other Nutrients */}
          <View style={styles.secondaryProgressGrid}>
            <View style={styles.secondaryProgressItem}>
              <View style={styles.secondaryProgressHeader}>
                <View>
                  <Zap size={16} color="#F59E0B" />
                </View>
                <Text style={styles.secondaryProgressLabel}>Protein</Text>
              </View>
              <Text style={styles.secondaryProgressValue}>
                {dailyTotals.protein}g
              </Text>
              <Text style={styles.secondaryProgressTarget}>
                of {dailyTargets.protein}g
              </Text>
            </View>
            <View style={styles.secondaryProgressItem}>
              <View style={styles.secondaryProgressHeader}>
                <View>
                  <Activity size={16} color="#EF4444" />
                </View>
                <Text style={styles.secondaryProgressLabel}>Calories</Text>
              </View>
              <Text style={styles.secondaryProgressValue}>
                {dailyTotals.calories}
              </Text>
              <Text style={styles.secondaryProgressTarget}>
                of {dailyTargets.calories}
              </Text>
            </View>
            <View style={styles.secondaryProgressItem}>
              <View style={styles.secondaryProgressHeader}>
                <View>
                  <Heart size={16} color="#10B981" />
                </View>
                <Text style={styles.secondaryProgressLabel}>Fats</Text>
              </View>
              <Text style={styles.secondaryProgressValue}>
                {dailyTotals.fats}g
              </Text>
              <Text style={styles.secondaryProgressTarget}>
                of {dailyTargets.fats}g
              </Text>
            </View>
          </View>
        </View>
        {/* Blood Sugar Card */}
        <View style={styles.bloodSugarCard}>
          <View style={styles.bloodSugarHeader}>
            <View style={styles.bloodSugarTitleContainer}>
              <View>
                <Droplets size={20} color="#10B981" />
              </View>
              <Text style={styles.bloodSugarTitle}>Blood Sugar</Text>
            </View>
            <TouchableOpacity 
              style={styles.bloodSugarLogButton}
              onPress={() => setBloodSugarModalVisible(true)}
            >
              <View>
                <Plus size={16} color="#ffffff" />
              </View>
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
              {todaysBloodSugarReadings.length > 1 && (
                <View style={styles.bloodSugarHistory}>
                  <Text style={styles.bloodSugarHistoryTitle}>Today's Readings</Text>
                  {todaysBloodSugarReadings.slice(0, -1).map((reading) => (
                    <View key={reading.id} style={styles.bloodSugarHistoryItem}>
                      <Text style={styles.bloodSugarHistoryValue}>
                        {reading.value} mg/dL
                      </Text>
                      <Text style={styles.bloodSugarHistoryTime}>
                        {reading.readingType} • {reading.time}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.bloodSugarEmpty}>
              <Text style={styles.bloodSugarEmptyText}>No readings today</Text>
              <Text style={styles.bloodSugarEmptySubtext}>Tap "Log" to add your first reading</Text>
            </View>
          )}
        </View>
        {/* Meals by Type */}
        {mealTypes.map((mealType) => {
          const mealEntries = getEntriesForMealType(mealType);
          const mealTotals = mealEntries.reduce(
            (totals, entry) => ({
              carbs: totals.carbs + entry.carbs,
              calories: totals.calories + entry.calories,
            }),
            { carbs: 0, calories: 0 }
          );
          return (
            <View key={mealType} style={styles.mealSection}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealTitle}>{mealType}</Text>
                <View style={styles.mealTotals}>
                  <Text style={styles.mealCarbTotal}>{mealTotals.carbs}g carbs</Text>
                  <Text style={styles.mealCalorieTotal}>{mealTotals.calories} cal</Text>
                </View>
              </View>
              {mealEntries.length === 0 ? (
                <View style={styles.emptyMealActions}>
                  <TouchableOpacity 
                    style={styles.emptyMealCard}
                    onPress={() => {
                      setSelectedMealType(mealType as any);
                      setAddModalVisible(true);
                    }}
                  >
                    <View>
                      <Plus size={24} color="#9CA3AF" />
                    </View>
                    <Text style={styles.emptyMealText}>Add {mealType.toLowerCase()}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.emptyMealCard, styles.customMealCard]}
                    onPress={() => handleOpenCustomMealModal(mealType as any)}
                  >
                    <View>
                      <Edit3 size={24} color="#16A34A" />
                    </View>
                    <Text style={[styles.emptyMealText, styles.customMealText]}>Custom {mealType.toLowerCase()}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.mealEntries}>
                  {mealEntries.map((entry) => (
                    <View key={entry.id} style={styles.entryCard}>
                      <TouchableOpacity 
                        style={styles.entryContent}
                        onLongPress={() => removeEntry(entry.id)}
                      >
                        <View style={styles.entryHeader}>
                          <Text style={styles.entryName}>{entry.name}</Text>
                          <Text style={styles.entryTime}>{entry.time}</Text>
                        </View>
                        <Text style={styles.entryServing}>{entry.serving}</Text>
                        <View style={styles.entryNutrients}>
                          <View style={styles.nutrientItem}>
                            <Text style={styles.nutrientValue}>{entry.carbs}g</Text>
                            <Text style={styles.nutrientLabel}>carbs</Text>
                          </View>
                          <View style={styles.nutrientItem}>
                            <Text style={styles.nutrientValue}>{entry.protein}g</Text>
                            <Text style={styles.nutrientLabel}>protein</Text>
                          </View>
                          <View style={styles.nutrientItem}>
                            <Text style={styles.nutrientValue}>{entry.calories}</Text>
                            <Text style={styles.nutrientLabel}>cal</Text>
                          </View>
                          <View style={styles.nutrientItem}>
                            <Text style={styles.nutrientValue}>{entry.fats}g</Text>
                            <Text style={styles.nutrientLabel}>fats</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => removeEntry(entry.id)}
                      >
                        <View>
                          <Trash2 size={16} color="#EF4444" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <View style={styles.addMoreActions}>
                    <TouchableOpacity 
                      style={styles.addMoreButton}
                      onPress={() => {
                        setSelectedMealType(mealType as any);
                        setAddModalVisible(true);
                      }}
                    >
                      <View>
                        <Plus size={16} color="#16A34A" />
                      </View>
                      <Text style={styles.addMoreText}>Add more to {mealType.toLowerCase()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.addMoreButton, styles.customMealAddButton]}
                      onPress={() => handleOpenCustomMealModal(mealType as any)}
                    >
                      <View>
                        <Edit3 size={16} color="#16A34A" />
                      </View>
                      <Text style={styles.addMoreText}>Custom {mealType.toLowerCase()}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}
        {/* Daily Summary */}
        {dailyEntries.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Daily Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{dailyTotals.carbs}g</Text>
                <Text style={styles.summaryLabel}>Total Carbs</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{dailyTotals.protein}g</Text>
                <Text style={styles.summaryLabel}>Total Protein</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{dailyTotals.calories}</Text>
                <Text style={styles.summaryLabel}>Total Calories</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{dailyTotals.sugar}g</Text>
                <Text style={styles.summaryLabel}>Total Sugar</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      {/* Add Food Modal */}
      {addModalVisible && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setAddModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setAddModalVisible(false)}
              >
                <View>
                  <X size={24} color="#111827" />
                </View>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Food</Text>
              <View style={styles.modalHeaderSpacer} />
            </View>
            {/* Meal Type Selector */}
            <View style={styles.mealTypeSelector}>
              <Text style={styles.mealTypeSelectorTitle}>Add to:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {mealTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.mealTypeChip,
                      selectedMealType === type && styles.mealTypeChipSelected,
                    ]}
                    onPress={() => setSelectedMealType(type as any)}
                  >
                    <Text style={[
                      styles.mealTypeChipText,
                      selectedMealType === type && styles.mealTypeChipTextSelected,
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            {/* Search */}
            <View style={styles.searchContainer}>
              <View>
                <Search size={20} color="#6B7280" />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search foods..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            {/* Serving Size */}
            <View style={styles.servingContainer}>
              <Text style={styles.servingLabel}>Serving size multiplier:</Text>
              <TextInput
                style={styles.servingInput}
                value={customServing}
                onChangeText={setCustomServing}
                keyboardType="decimal-pad"
                placeholder="1.0"
              />
            </View>
            {/* Food List */}
            <ScrollView style={styles.foodList} showsVerticalScrollIndicator={false}>
              {filteredFoods.map((food) => {
                const servingMultiplier = parseFloat(customServing) || 1;
                return (
                  <TouchableOpacity
                    key={food.id}
                    style={styles.foodItem}
                    onPress={() => addFoodEntry(food)}
                  >
                    <View style={styles.foodItemHeader}>
                      <Text style={styles.foodItemName}>{food.name}</Text>
                      <Text style={styles.foodItemCategory}>{food.category}</Text>
                    </View>
                    <Text style={styles.foodItemServing}>
                      {customServing !== '1' ? `${customServing}x ` : ''}{food.servingSize}
                    </Text>
                    <View style={styles.foodItemNutrients}>
                      <View style={styles.foodNutrientItem}>
                        <Text style={styles.foodNutrientValue}>
                          {Math.round(food.carbs * servingMultiplier * 10) / 10}g
                        </Text>
                        <Text style={styles.foodNutrientLabel}>carbs</Text>
                      </View>
                      <View style={styles.foodNutrientItem}>
                        <Text style={styles.foodNutrientValue}>
                          {Math.round(food.protein * servingMultiplier * 10) / 10}g
                        </Text>
                        <Text style={styles.foodNutrientLabel}>protein</Text>
                      </View>
                      <View style={styles.foodNutrientItem}>
                        <Text style={styles.foodNutrientValue}>
                          {Math.round(food.calories * servingMultiplier)}
                        </Text>
                        <Text style={styles.foodNutrientLabel}>cal</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
      {/* Blood Sugar Modal */}
      {bloodSugarModalVisible && (
        <BloodSugarModal
          visible={true}
          onClose={() => setBloodSugarModalVisible(false)}
          onSave={handleBloodSugarSave}
        />
      )}
      {/* Custom Meal Modal */}
      {customMealModalVisible && (
        <CustomMealModal
          visible={true}
          onClose={() => setCustomMealModalVisible(false)}
          onSave={handleCustomMealSave}
          mealType={customMealType}
        />
      )}
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
    paddingHorizontal: 16,
    paddingTop: 20,
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
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  dateNavButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  dateInfo: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  dateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  progressCard: {
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
  progressTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 20,
  },
  primaryProgress: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryProgressLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  primaryProgressValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
  },
  primaryProgressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  primaryProgressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  secondaryProgressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryProgressItem: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  secondaryProgressLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  secondaryProgressValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  secondaryProgressTarget: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  bloodSugarCard: {
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
    marginBottom: 16,
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
  bloodSugarHistory: {
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  bloodSugarHistoryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  bloodSugarHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  bloodSugarHistoryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  bloodSugarHistoryTime: {
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
  mealSection: {
    marginBottom: 24,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  mealTotals: {
    alignItems: 'flex-end',
  },
  mealCarbTotal: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  mealCalorieTotal: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emptyMealCard: {
    backgroundColor: '#ffffff',
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
  mealEntries: {
    gap: 8,
  },
  entryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryContent: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  entryName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  entryTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  entryServing: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  entryNutrients: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutrientItem: {
    alignItems: 'center',
  },
  nutrientValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  nutrientLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  addMoreButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  addMoreText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#16A34A',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  modalHeaderSpacer: {
    width: 40,
  },
  mealTypeSelector: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  mealTypeSelectorTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  mealTypeChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  mealTypeChipSelected: {
    backgroundColor: '#16A34A',
  },
  mealTypeChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  mealTypeChipTextSelected: {
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  servingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  servingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  servingInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    minWidth: 80,
    textAlign: 'center',
  },
  foodList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  foodItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  foodItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  foodItemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  foodItemCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  foodItemServing: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  foodItemNutrients: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  foodNutrientItem: {
    alignItems: 'center',
  },
  foodNutrientValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  foodNutrientLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  emptyMealActions: {
    flexDirection: 'row',
    gap: 12,
  },
  customMealCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#16A34A',
    borderWidth: 1,
  },
  customMealText: {
    color: '#16A34A',
  },
  addMoreActions: {
    flexDirection: 'row',
    gap: 8,
  },
  customMealAddButton: {
    backgroundColor: '#F0FDF4',
    borderColor: '#16A34A',
    borderWidth: 1,
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

export default NutritionScreen;
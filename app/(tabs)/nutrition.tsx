import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Clock, 
  Search, 
  X, 
  Check,
  Calendar,
  Activity,
  Zap,
  Heart,
  ChevronLeft,
  ChevronRight,
  Droplets
} from 'lucide-react-native';
import BloodSugarModal from '../../components/BloodSugarModal';

const { width } = Dimensions.get('window');

interface NutritionEntry {
  id: number;
  name: string;
  carbs: number;
  protein: number;
  calories: number;
  fiber: number;
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
  fiber: number;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [customServing, setCustomServing] = useState('1');

  // User's daily targets
  const dailyTargets = {
    carbs: 150,
    protein: 120,
    calories: 1800,
    fiber: 25,
  };

  // Sample food database
  const foodDatabase: FoodItem[] = [
    // Fruits
    { id: 1, name: 'Apple (medium)', carbs: 25, protein: 0.5, calories: 95, fiber: 4, sugar: 19, servingSize: '1 medium', category: 'Fruits' },
    { id: 2, name: 'Banana (medium)', carbs: 27, protein: 1.3, calories: 105, fiber: 3, sugar: 14, servingSize: '1 medium', category: 'Fruits' },
    { id: 3, name: 'Orange (medium)', carbs: 15, protein: 1.2, calories: 62, fiber: 3, sugar: 12, servingSize: '1 medium', category: 'Fruits' },
    { id: 4, name: 'Blueberries', carbs: 21, protein: 1.1, calories: 84, fiber: 4, sugar: 15, servingSize: '1 cup', category: 'Fruits' },
    { id: 5, name: 'Strawberries', carbs: 11, protein: 1, calories: 49, fiber: 3, sugar: 7, servingSize: '1 cup', category: 'Fruits' },
    
    // Vegetables
    { id: 6, name: 'Broccoli (cooked)', carbs: 11, protein: 4, calories: 55, fiber: 5, sugar: 2, servingSize: '1 cup', category: 'Vegetables' },
    { id: 7, name: 'Spinach (raw)', carbs: 1, protein: 1, calories: 7, fiber: 1, sugar: 0, servingSize: '1 cup', category: 'Vegetables' },
    { id: 8, name: 'Sweet Potato (baked)', carbs: 27, protein: 2, calories: 112, fiber: 4, sugar: 5, servingSize: '1 medium', category: 'Vegetables' },
    { id: 9, name: 'Carrots (raw)', carbs: 12, protein: 1, calories: 50, fiber: 3, sugar: 6, servingSize: '1 cup', category: 'Vegetables' },
    { id: 10, name: 'Bell Pepper (red)', carbs: 7, protein: 1, calories: 31, fiber: 2, sugar: 5, servingSize: '1 cup', category: 'Vegetables' },
    
    // Grains
    { id: 11, name: 'Brown Rice (cooked)', carbs: 45, protein: 5, calories: 216, fiber: 4, sugar: 1, servingSize: '1 cup', category: 'Grains' },
    { id: 12, name: 'Quinoa (cooked)', carbs: 39, protein: 8, calories: 222, fiber: 5, sugar: 2, servingSize: '1 cup', category: 'Grains' },
    { id: 13, name: 'Oatmeal (cooked)', carbs: 28, protein: 6, calories: 154, fiber: 4, sugar: 1, servingSize: '1 cup', category: 'Grains' },
    { id: 14, name: 'Whole Wheat Bread', carbs: 14, protein: 4, calories: 81, fiber: 2, sugar: 1, servingSize: '1 slice', category: 'Grains' },
    
    // Proteins
    { id: 15, name: 'Chicken Breast (grilled)', carbs: 0, protein: 31, calories: 165, fiber: 0, sugar: 0, servingSize: '100g', category: 'Proteins' },
    { id: 16, name: 'Salmon (grilled)', carbs: 0, protein: 25, calories: 206, fiber: 0, sugar: 0, servingSize: '100g', category: 'Proteins' },
    { id: 17, name: 'Greek Yogurt (plain)', carbs: 9, protein: 20, calories: 130, fiber: 0, sugar: 9, servingSize: '1 cup', category: 'Proteins' },
    { id: 18, name: 'Eggs (large)', carbs: 1, protein: 6, calories: 70, fiber: 0, sugar: 1, servingSize: '1 egg', category: 'Proteins' },
    { id: 19, name: 'Tofu (firm)', carbs: 3, protein: 20, calories: 181, fiber: 3, sugar: 1, servingSize: '100g', category: 'Proteins' },
    
    // Dairy
    { id: 20, name: 'Milk (2%)', carbs: 12, protein: 8, calories: 122, fiber: 0, sugar: 12, servingSize: '1 cup', category: 'Dairy' },
    { id: 21, name: 'Cheddar Cheese', carbs: 1, protein: 7, calories: 113, fiber: 0, sugar: 0, servingSize: '1 oz', category: 'Dairy' },
    
    // Nuts & Seeds
    { id: 22, name: 'Almonds', carbs: 6, protein: 6, calories: 164, fiber: 4, sugar: 1, servingSize: '1 oz', category: 'Nuts & Seeds' },
    { id: 23, name: 'Chia Seeds', carbs: 12, protein: 4, calories: 137, fiber: 10, sugar: 0, servingSize: '1 oz', category: 'Nuts & Seeds' },
    
    // Legumes
    { id: 24, name: 'Black Beans (cooked)', carbs: 41, protein: 15, calories: 227, fiber: 15, sugar: 1, servingSize: '1 cup', category: 'Legumes' },
    { id: 25, name: 'Lentils (cooked)', carbs: 40, protein: 18, calories: 230, fiber: 16, sugar: 4, servingSize: '1 cup', category: 'Legumes' },
  ];

  // Sample entries for today
  useEffect(() => {
    const sampleEntries: NutritionEntry[] = [
      {
        id: 1,
        name: 'Greek Yogurt with Berries',
        carbs: 28,
        protein: 20,
        calories: 180,
        fiber: 4,
        sugar: 15,
        serving: '1 cup',
        time: '8:30 AM',
        mealType: 'Breakfast',
      },
      {
        id: 2,
        name: 'Quinoa Salad',
        carbs: 45,
        protein: 12,
        calories: 320,
        fiber: 6,
        sugar: 3,
        serving: '1.5 cups',
        time: '12:45 PM',
        mealType: 'Lunch',
      },
      {
        id: 3,
        name: 'Apple',
        carbs: 25,
        protein: 0.5,
        calories: 95,
        fiber: 4,
        sugar: 19,
        serving: '1 medium',
        time: '3:15 PM',
        mealType: 'Snack',
      },
    ];
    setDailyEntries(sampleEntries);

    // Sample blood sugar readings
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

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateDailyTotals = () => {
    return dailyEntries.reduce(
      (totals, entry) => ({
        carbs: totals.carbs + entry.carbs,
        protein: totals.protein + entry.protein,
        calories: totals.calories + entry.calories,
        fiber: totals.fiber + entry.fiber,
        sugar: totals.sugar + entry.sugar,
      }),
      { carbs: 0, protein: 0, calories: 0, fiber: 0, sugar: 0 }
    );
  };

  const dailyTotals = calculateDailyTotals();

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

  const addFoodEntry = (food: FoodItem) => {
    const servingMultiplier = parseFloat(customServing) || 1;
    const newEntry: NutritionEntry = {
      id: Date.now(),
      name: `${food.name}${servingMultiplier !== 1 ? ` (${customServing}x)` : ''}`,
      carbs: Math.round(food.carbs * servingMultiplier * 10) / 10,
      protein: Math.round(food.protein * servingMultiplier * 10) / 10,
      calories: Math.round(food.calories * servingMultiplier),
      fiber: Math.round(food.fiber * servingMultiplier * 10) / 10,
      sugar: Math.round(food.sugar * servingMultiplier * 10) / 10,
      serving: `${customServing} ${food.servingSize}`,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      mealType: selectedMealType,
    };

    setDailyEntries([...dailyEntries, newEntry]);
    setAddModalVisible(false);
    setSearchQuery('');
    setCustomServing('1');
  };

  const removeEntry = (id: number) => {
    Alert.alert(
      'Remove Entry',
      'Are you sure you want to remove this nutrition entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {
          setDailyEntries(dailyEntries.filter(entry => entry.id !== id));
        }},
      ]
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

  const navigateDate = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction);
    setSelectedDate(newDate);
    // In a real app, you would load entries for the new date
    if (direction !== 0) {
      setDailyEntries([]); // Clear entries when changing dates
      setBloodSugarReadings([]); // Clear readings when changing dates
    }
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

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const getEntriesForMealType = (mealType: string) => {
    return dailyEntries.filter(entry => entry.mealType === mealType);
  };

  const todaysBloodSugarReadings = getTodaysBloodSugarReadings();
  const latestBloodSugar = todaysBloodSugarReadings.length > 0 
    ? todaysBloodSugarReadings[todaysBloodSugarReadings.length - 1] 
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nutrition Tracker</Text>
          <Text style={styles.subtitle}>Monitor your daily carbs and nutrients</Text>
        </View>

        {/* Date Navigation */}
        <View style={styles.dateNavigation}>
          <TouchableOpacity 
            style={styles.dateNavButton} 
            onPress={() => navigateDate(-1)}
          >
            <ChevronLeft size={20} color="#16A34A" />
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
            <ChevronRight size={20} color="#16A34A" />
          </TouchableOpacity>
        </View>

        {/* Daily Progress Overview */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Daily Progress</Text>
          
          {/* Carbs - Primary Focus */}
          <View style={styles.primaryProgress}>
            <View style={styles.progressHeader}>
              <View style={styles.progressLabelContainer}>
                <Target size={20} color="#16A34A" />
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
                <Zap size={16} color="#F59E0B" />
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
                <Activity size={16} color="#EF4444" />
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
                <Heart size={16} color="#10B981" />
                <Text style={styles.secondaryProgressLabel}>Fiber</Text>
              </View>
              <Text style={styles.secondaryProgressValue}>
                {dailyTotals.fiber}g
              </Text>
              <Text style={styles.secondaryProgressTarget}>
                of {dailyTargets.fiber}g
              </Text>
            </View>
          </View>
        </View>

        {/* Blood Sugar Card */}
        <View style={styles.bloodSugarCard}>
          <View style={styles.bloodSugarHeader}>
            <View style={styles.bloodSugarTitleContainer}>
              <Droplets size={20} color="#10B981" />
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
              
              {/* Show all readings for today */}
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

        {/* Quick Add Button */}
        <View style={styles.quickAddContainer}>
          <TouchableOpacity 
            style={styles.quickAddButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Plus size={20} color="#ffffff" />
            <Text style={styles.quickAddText}>Log Food</Text>
          </TouchableOpacity>
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
                <TouchableOpacity 
                  style={styles.emptyMealCard}
                  onPress={() => {
                    setSelectedMealType(mealType as any);
                    setAddModalVisible(true);
                  }}
                >
                  <Plus size={24} color="#9CA3AF" />
                  <Text style={styles.emptyMealText}>Add {mealType.toLowerCase()}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.mealEntries}>
                  {mealEntries.map((entry) => (
                    <TouchableOpacity 
                      key={entry.id} 
                      style={styles.entryCard}
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
                          <Text style={styles.nutrientValue}>{entry.fiber}g</Text>
                          <Text style={styles.nutrientLabel}>fiber</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                  
                  <TouchableOpacity 
                    style={styles.addMoreButton}
                    onPress={() => {
                      setSelectedMealType(mealType as any);
                      setAddModalVisible(true);
                    }}
                  >
                    <Plus size={16} color="#16A34A" />
                    <Text style={styles.addMoreText}>Add more to {mealType.toLowerCase()}</Text>
                  </TouchableOpacity>
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
      <Modal
        visible={addModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setAddModalVisible(false)}
            >
              <X size={24} color="#111827" />
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
            <Search size={20} color="#6B7280" />
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
  quickAddContainer: {
    marginBottom: 24,
  },
  quickAddButton: {
    backgroundColor: '#16A34A',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  quickAddText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
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
});

export default NutritionScreen;
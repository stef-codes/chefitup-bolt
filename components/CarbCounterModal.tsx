import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Plus, Minus, Calculator, Target } from 'lucide-react-native';

interface CarbCounterModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (entry: CarbEntry) => void;
  mealType?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

interface CarbEntry {
  id: number;
  name: string;
  carbs: number;
  time: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  notes?: string;
}

interface QuickFood {
  name: string;
  carbs: number;
  category: string;
}

const CarbCounterModal: React.FC<CarbCounterModalProps> = ({
  visible,
  onClose,
  onSave,
  mealType = 'Snack',
}) => {
  const [foodName, setFoodName] = useState('');
  const [carbAmount, setCarbAmount] = useState('');
  const [selectedMealType, setSelectedMealType] = useState(mealType);
  const [notes, setNotes] = useState('');
  const [quickAddMode, setQuickAddMode] = useState(false);

  // Quick add foods with common carb counts
  const quickFoods: QuickFood[] = [
    { name: 'Apple (medium)', carbs: 25, category: 'Fruits' },
    { name: 'Banana (medium)', carbs: 27, category: 'Fruits' },
    { name: 'Orange (medium)', carbs: 15, category: 'Fruits' },
    { name: 'Bread slice', carbs: 15, category: 'Grains' },
    { name: 'Rice (1/2 cup)', carbs: 22, category: 'Grains' },
    { name: 'Pasta (1/2 cup)', carbs: 20, category: 'Grains' },
    { name: 'Milk (1 cup)', carbs: 12, category: 'Dairy' },
    { name: 'Yogurt (1 cup)', carbs: 17, category: 'Dairy' },
    { name: 'Potato (medium)', carbs: 30, category: 'Vegetables' },
    { name: 'Sweet Potato (medium)', carbs: 27, category: 'Vegetables' },
    { name: 'Crackers (5 pieces)', carbs: 15, category: 'Snacks' },
    { name: 'Granola Bar', carbs: 22, category: 'Snacks' },
  ];

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const handleSave = () => {
    if (!foodName.trim() || !carbAmount.trim()) {
      Alert.alert('Missing Information', 'Please enter both food name and carb amount.');
      return;
    }

    const carbValue = parseFloat(carbAmount);
    if (isNaN(carbValue) || carbValue < 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid carb amount.');
      return;
    }

    const entry: CarbEntry = {
      id: Date.now(),
      name: foodName.trim(),
      carbs: carbValue,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      mealType: selectedMealType,
      notes: notes.trim() || undefined,
    };

    onSave(entry);
    handleClose();
  };

  const handleClose = () => {
    setFoodName('');
    setCarbAmount('');
    setNotes('');
    setQuickAddMode(false);
    onClose();
  };

  const handleQuickAdd = (food: QuickFood) => {
    setFoodName(food.name);
    setCarbAmount(food.carbs.toString());
    setQuickAddMode(false);
  };

  const adjustCarbs = (amount: number) => {
    const current = parseFloat(carbAmount) || 0;
    const newAmount = Math.max(0, current + amount);
    setCarbAmount(newAmount.toString());
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log Carbs</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Quick Add Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, !quickAddMode && styles.toggleButtonActive]}
              onPress={() => setQuickAddMode(false)}
            >
              <Calculator size={20} color={!quickAddMode ? '#ffffff' : '#16A34A'} />
              <Text style={[
                styles.toggleButtonText,
                !quickAddMode && styles.toggleButtonTextActive
              ]}>
                Manual Entry
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, quickAddMode && styles.toggleButtonActive]}
              onPress={() => setQuickAddMode(true)}
            >
              <Target size={20} color={quickAddMode ? '#ffffff' : '#16A34A'} />
              <Text style={[
                styles.toggleButtonText,
                quickAddMode && styles.toggleButtonTextActive
              ]}>
                Quick Add
              </Text>
            </TouchableOpacity>
          </View>

          {quickAddMode ? (
            /* Quick Add Mode */
            <View style={styles.quickAddContainer}>
              <Text style={styles.sectionTitle}>Common Foods</Text>
              <Text style={styles.sectionSubtitle}>
                Tap any food to quickly add it to your log
              </Text>
              
              {['Fruits', 'Grains', 'Dairy', 'Vegetables', 'Snacks'].map(category => {
                const categoryFoods = quickFoods.filter(food => food.category === category);
                if (categoryFoods.length === 0) return null;

                return (
                  <View key={category} style={styles.categorySection}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <View style={styles.foodGrid}>
                      {categoryFoods.map((food, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.quickFoodCard}
                          onPress={() => handleQuickAdd(food)}
                        >
                          <Text style={styles.quickFoodName}>{food.name}</Text>
                          <Text style={styles.quickFoodCarbs}>{food.carbs}g carbs</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            /* Manual Entry Mode */
            <View style={styles.manualEntryContainer}>
              {/* Meal Type Selector */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Meal Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.mealTypeContainer}>
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
                  </View>
                </ScrollView>
              </View>

              {/* Food Name */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Food Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={foodName}
                  onChangeText={setFoodName}
                  placeholder="e.g., Apple, Bread slice, Rice bowl"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Carb Amount */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Carbohydrates (grams)</Text>
                <View style={styles.carbInputContainer}>
                  <TouchableOpacity
                    style={styles.adjustButton}
                    onPress={() => adjustCarbs(-5)}
                  >
                    <Minus size={20} color="#16A34A" />
                  </TouchableOpacity>
                  
                  <TextInput
                    style={styles.carbInput}
                    value={carbAmount}
                    onChangeText={setCarbAmount}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                  />
                  
                  <TouchableOpacity
                    style={styles.adjustButton}
                    onPress={() => adjustCarbs(5)}
                  >
                    <Plus size={20} color="#16A34A" />
                  </TouchableOpacity>
                </View>
                
                {/* Quick Carb Buttons */}
                <View style={styles.quickCarbButtons}>
                  {[10, 15, 20, 25, 30].map(amount => (
                    <TouchableOpacity
                      key={amount}
                      style={styles.quickCarbButton}
                      onPress={() => setCarbAmount(amount.toString())}
                    >
                      <Text style={styles.quickCarbButtonText}>{amount}g</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Notes */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Notes (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.notesInput]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any notes about this food..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Carb Impact Indicator */}
              {carbAmount && parseFloat(carbAmount) > 0 && (
                <View style={styles.impactIndicator}>
                  <View style={styles.impactHeader}>
                    <Target size={20} color="#16A34A" />
                    <Text style={styles.impactTitle}>Carb Impact</Text>
                  </View>
                  <Text style={styles.impactValue}>
                    <Text>+{parseFloat(carbAmount)}g carbs</Text>
                  </Text>
                  <Text style={styles.impactDescription}>
                    This will be added to your daily carb total
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#16A34A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#16A34A',
  },
  toggleButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  toggleButtonTextActive: {
    color: '#ffffff',
  },
  quickAddContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 24,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickFoodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickFoodName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  quickFoodCarbs: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#16A34A',
  },
  manualEntryContainer: {
    flex: 1,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  mealTypeChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  carbInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  adjustButton: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carbInput: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
  },
  quickCarbButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  quickCarbButton: {
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickCarbButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  impactIndicator: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  impactTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  impactValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
    marginBottom: 4,
  },
  impactDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});

export default CarbCounterModal;
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
  SafeAreaView,
} from 'react-native';
import { X, Save, Clock, Users } from 'lucide-react-native';

interface CustomMeal {
  name: string;
  carbs: number;
  protein: number;
  calories: number;
  fiber: number;
  sugar: number;
  serving: string;
  notes?: string;
}

interface CustomMealModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (meal: CustomMeal) => void;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

const CustomMealModal: React.FC<CustomMealModalProps> = ({
  visible,
  onClose,
  onSave,
  mealType,
}) => {
  const [mealName, setMealName] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [calories, setCalories] = useState('');
  const [fiber, setFiber] = useState('');
  const [sugar, setSugar] = useState('');
  const [serving, setServing] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    // Validate required fields
    if (!mealName.trim()) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }

    if (!carbs || !protein || !calories) {
      Alert.alert('Error', 'Please enter carbs, protein, and calories');
      return;
    }

    const customMeal: CustomMeal = {
      name: mealName.trim(),
      carbs: parseFloat(carbs) || 0,
      protein: parseFloat(protein) || 0,
      calories: parseFloat(calories) || 0,
      fiber: parseFloat(fiber) || 0,
      sugar: parseFloat(sugar) || 0,
      serving: serving.trim() || '1 serving',
      notes: notes.trim() || undefined,
    };

    onSave(customMeal);
    resetForm();
  };

  const resetForm = () => {
    setMealName('');
    setCarbs('');
    setProtein('');
    setCalories('');
    setFiber('');
    setSugar('');
    setServing('');
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleClose}
          >
            <X size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>Add Custom Meal</Text>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Save size={20} color="#16A34A" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Meal Type Indicator */}
          <View style={styles.mealTypeIndicator}>
            <Clock size={16} color="#16A34A" />
            <Text style={styles.mealTypeText}>Adding to {mealType}</Text>
          </View>

          {/* Meal Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Meal Name *</Text>
            <TextInput
              style={styles.textInput}
              value={mealName}
              onChangeText={setMealName}
              placeholder="e.g., Homemade Chicken Salad"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Serving Size */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Serving Size</Text>
            <TextInput
              style={styles.textInput}
              value={serving}
              onChangeText={setServing}
              placeholder="e.g., 1 bowl, 2 cups, 1 piece"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Nutritional Information */}
          <View style={styles.nutritionSection}>
            <Text style={styles.sectionTitle}>Nutritional Information</Text>
            
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionInput}>
                <Text style={styles.label}>Carbs (g) *</Text>
                <TextInput
                  style={styles.numberInput}
                  value={carbs}
                  onChangeText={setCarbs}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.nutritionInput}>
                <Text style={styles.label}>Protein (g) *</Text>
                <TextInput
                  style={styles.numberInput}
                  value={protein}
                  onChangeText={setProtein}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.nutritionInput}>
                <Text style={styles.label}>Calories *</Text>
                <TextInput
                  style={styles.numberInput}
                  value={calories}
                  onChangeText={setCalories}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.nutritionInput}>
                <Text style={styles.label}>Fiber (g)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={fiber}
                  onChangeText={setFiber}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.nutritionInput}>
                <Text style={styles.label}>Sugar (g)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={sugar}
                  onChangeText={setSugar}
                  placeholder="0"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes about this meal..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Tips for accurate tracking:</Text>
            <Text style={styles.tipText}>• Use nutrition labels when available</Text>
            <Text style={styles.tipText}>• Estimate portions using common measurements</Text>
            <Text style={styles.tipText}>• Consider cooking methods (fried vs. grilled)</Text>
            <Text style={styles.tipText}>• Include sauces, dressings, and condiments</Text>
          </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#ffffff',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mealTypeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  mealTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#16A34A',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  notesInput: {
    height: 80,
  },
  nutritionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nutritionInput: {
    flex: 1,
    minWidth: '45%',
  },
  numberInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    textAlign: 'center',
  },
  tipsSection: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    marginBottom: 4,
  },
});

export default CustomMealModal; 
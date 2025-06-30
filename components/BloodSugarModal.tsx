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
import { X, Activity, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

interface BloodSugarModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (reading: BloodSugarReading) => void;
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

const BloodSugarModal: React.FC<BloodSugarModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [bloodSugar, setBloodSugar] = useState('');
  const [selectedType, setSelectedType] = useState<'Fasting' | 'Before Meal' | 'After Meal' | 'Bedtime' | 'Random'>('Random');
  const [notes, setNotes] = useState('');
  const [mealContext, setMealContext] = useState('');

  const readingTypes = [
    { type: 'Fasting' as const, description: 'First thing in the morning' },
    { type: 'Before Meal' as const, description: 'Before eating' },
    { type: 'After Meal' as const, description: '1-2 hours after eating' },
    { type: 'Bedtime' as const, description: 'Before going to sleep' },
    { type: 'Random' as const, description: 'Any other time' },
  ];

  const quickValues = [80, 90, 100, 110, 120, 130, 140, 150];

  const handleSave = () => {
    if (!bloodSugar.trim()) {
      Alert.alert('Missing Information', 'Please enter your blood sugar reading.');
      return;
    }

    const value = parseFloat(bloodSugar);
    if (isNaN(value) || value < 20 || value > 600) {
      Alert.alert('Invalid Reading', 'Please enter a valid blood sugar reading between 20-600 mg/dL.');
      return;
    }

    const now = new Date();
    const reading: BloodSugarReading = {
      id: Date.now(),
      value,
      time: now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      date: now.toLocaleDateString('en-US'),
      readingType: selectedType,
      notes: notes.trim() || undefined,
      mealContext: mealContext.trim() || undefined,
    };

    onSave(reading);
    handleClose();
  };

  const handleClose = () => {
    setBloodSugar('');
    setNotes('');
    setMealContext('');
    setSelectedType('Random');
    onClose();
  };

  const adjustValue = (amount: number) => {
    const current = parseFloat(bloodSugar) || 0;
    const newValue = Math.max(0, current + amount);
    setBloodSugar(newValue.toString());
  };

  const getReadingStatus = (value: number) => {
    if (value < 70) return { status: 'Low', color: '#EF4444', icon: TrendingDown };
    if (value <= 140) return { status: 'Normal', color: '#10B981', icon: Minus };
    if (value <= 180) return { status: 'High', color: '#F59E0B', icon: TrendingUp };
    return { status: 'Very High', color: '#DC2626', icon: TrendingUp };
  };

  const currentValue = parseFloat(bloodSugar) || 0;
  const readingStatus = getReadingStatus(currentValue);
  const StatusIcon = readingStatus.icon;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <View>
              <X size={24} color="#111827" />
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blood Sugar Reading</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Reading Type Selector */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Reading Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.typeContainer}>
                {readingTypes.map((item) => (
                  <TouchableOpacity
                    key={item.type}
                    style={[
                      styles.typeChip,
                      selectedType === item.type && styles.typeChipSelected,
                    ]}
                    onPress={() => setSelectedType(item.type)}
                  >
                    <Text style={[
                      styles.typeChipText,
                      selectedType === item.type && styles.typeChipTextSelected,
                    ]}>
                      {item.type}
                    </Text>
                    <Text style={[
                      styles.typeChipDescription,
                      selectedType === item.type && styles.typeChipDescriptionSelected,
                    ]}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Blood Sugar Value */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Blood Sugar (mg/dL)</Text>
            <View style={styles.valueInputContainer}>
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustValue(-5)}
              >
                <View>
                  <Minus size={20} color="#16A34A" />
                </View>
              </TouchableOpacity>
              
              <TextInput
                style={styles.valueInput}
                value={bloodSugar}
                onChangeText={setBloodSugar}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
              
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => adjustValue(5)}
              >
                <View>
                  <Activity size={20} color="#16A34A" />
                </View>
              </TouchableOpacity>
            </View>
            
            {/* Quick Value Buttons */}
            <View style={styles.quickValueButtons}>
              {quickValues.map(value => (
                <TouchableOpacity
                  key={value}
                  style={styles.quickValueButton}
                  onPress={() => setBloodSugar(value.toString())}
                >
                  <Text style={styles.quickValueButtonText}>{value}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Reading Status */}
            {currentValue > 0 && (
              <View style={[styles.statusIndicator, { borderColor: readingStatus.color }]}>
                <View style={styles.statusHeader}>
                  <View>
                  <StatusIcon size={20} color={readingStatus.color} />
                </View>
                  <Text style={[styles.statusTitle, { color: readingStatus.color }]}>
                    {readingStatus.status}
                  </Text>
                </View>
                <Text style={styles.statusValue}>
                  {currentValue} mg/dL
                </Text>
                <Text style={styles.statusDescription}>
                  {readingStatus.status === 'Low' && 'Consider having a quick-acting carbohydrate'}
                  {readingStatus.status === 'Normal' && 'Your blood sugar is in a healthy range'}
                  {readingStatus.status === 'High' && 'Monitor closely and consider medication if prescribed'}
                  {readingStatus.status === 'Very High' && 'Contact your healthcare provider if this persists'}
                </Text>
              </View>
            )}
          </View>

          {/* Meal Context (for Before/After Meal) */}
          {(selectedType === 'Before Meal' || selectedType === 'After Meal') && (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>
                {selectedType === 'Before Meal' ? 'Upcoming Meal' : 'Recent Meal'}
              </Text>
              <TextInput
                style={styles.textInput}
                value={mealContext}
                onChangeText={setMealContext}
                placeholder="e.g., Breakfast, Lunch, Dinner"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          {/* Notes */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes about this reading..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Reference Ranges */}
          <View style={styles.referenceCard}>
            <Text style={styles.referenceTitle}>Reference Ranges</Text>
            <View style={styles.referenceList}>
              <View style={styles.referenceItem}>
                <View style={[styles.referenceIndicator, { backgroundColor: '#10B981' }]} />
                <Text style={styles.referenceText}>Normal: 70-140 mg/dL</Text>
              </View>
              <View style={styles.referenceItem}>
                <View style={[styles.referenceIndicator, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.referenceText}>Low: Below 70 mg/dL</Text>
              </View>
              <View style={styles.referenceItem}>
                <View style={[styles.referenceIndicator, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.referenceText}>High: 140-180 mg/dL</Text>
              </View>
              <View style={styles.referenceItem}>
                <View style={[styles.referenceIndicator, { backgroundColor: '#DC2626' }]} />
                <Text style={styles.referenceText}>Very High: Above 180 mg/dL</Text>
              </View>
            </View>
            <Text style={styles.referenceNote}>
              Always consult your healthcare provider for personalized target ranges.
            </Text>
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
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  typeChipSelected: {
    backgroundColor: '#16A34A',
  },
  typeChipText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 2,
  },
  typeChipTextSelected: {
    color: '#ffffff',
  },
  typeChipDescription: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  typeChipDescriptionSelected: {
    color: '#E5E7EB',
  },
  valueInputContainer: {
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
  valueInput: {
    flex: 1,
    padding: 16,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'center',
  },
  quickValueButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  quickValueButton: {
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickValueButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  statusIndicator: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    marginTop: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  statusValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  referenceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  referenceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  referenceList: {
    gap: 8,
    marginBottom: 12,
  },
  referenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  referenceIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  referenceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  referenceNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    fontStyle: 'italic',
  },
});

export default BloodSugarModal;
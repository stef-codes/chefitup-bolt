import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Heart, Clock, Target } from 'lucide-react-native';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import { OnboardingData } from '../types/user';
import { supabase } from '../lib/supabase';
import Toast from 'react-native-toast-message';

const OnboardingScreen: React.FC = () => {
  const { completeOnboarding } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Monitor currentStep changes
  useEffect(() => {
  }, [currentStep]);
  
  const [profile, setProfile] = useState<{
    name: string;
    diabetesType: string;
    age: string;
    carbBudget: string;
    restrictions: string[];
    goals: string[];
    cookingLevel: string;
  }>({
    name: '',
    diabetesType: '',
    age: '',
    carbBudget: '',
    restrictions: [],
    goals: [],
    cookingLevel: '',
  });

  const diabetesTypes: string[] = ['Type 1', 'Type 2', 'Pre-diabetes', 'Gestational'];
  const restrictions: string[] = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Low-Sodium', 'Heart-Healthy'];
  const goals: string[] = ['Better Blood Sugar Control', 'Weight Management', 'Save Time', 'Learn New Recipes'];
  const cookingLevels: string[] = ['Beginner', 'Intermediate', 'Advanced'];

  const goToNextStep = () => {
    if (currentStep < 4 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
    } else {
      // Complete onboarding
      setIsCompleting(true);
      try {

        // Save profile to local storage for offline access
        const onboardingData: OnboardingData = {
          name: profile.name,
          diabetesType: profile.diabetesType,
          age: profile.age,
          carbBudget: profile.carbBudget,
          restrictions: profile.restrictions,
          goals: profile.goals,
          cookingLevel: profile.cookingLevel,
        };

        const success = await completeOnboarding(onboardingData);
        
        if (success) {
          router.replace('/(tabs)');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to save your profile. Please try again.',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to save your profile. Please try again.',
        });
      } finally {
        setIsCompleting(false);
      }
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[0, 1, 2, 3, 4].map((step) => (
        <View
          key={step}
          style={[
            styles.stepDot,
            step <= currentStep ? styles.stepDotActive : styles.stepDotInactive,
          ]}
        />
      ))}
    </View>
  );



  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <View>
          <Heart size={48} color="#16A34A" />
        </View>
      </View>
      <Text style={styles.stepTitle}>Welcome to ChefItUp</Text>
      <Text style={styles.stepDescription}>
        Let's personalize your diabetes-friendly meal planning experience
      </Text>
      
      <Text style={styles.inputLabel}>Your Name</Text>
      <TextInput
        style={styles.textInput}
        value={profile.name}
        onChangeText={(text) => {
          setProfile({ ...profile, name: text });
        }}
        placeholder="Enter your name"
        autoCapitalize="words"
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <View>
          <Heart size={48} color="#16A34A" />
        </View>
      </View>
      <Text style={styles.stepTitle}>Diabetes Information</Text>
      <Text style={styles.stepDescription}>
        Help us understand your diabetes management needs
      </Text>
      
      <Text style={styles.sectionTitle}>What type of diabetes do you manage?</Text>
      {diabetesTypes.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.optionButton,
            profile.diabetesType === type && styles.optionButtonSelected,
          ]}
          onPress={() => setProfile({ ...profile, diabetesType: type })}
        >
          <Text style={[
            styles.optionText,
            profile.diabetesType === type && styles.optionTextSelected,
          ]}>
            {type}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.inputLabel}>Your Age</Text>
      <TextInput
        style={styles.textInput}
        value={profile.age}
        onChangeText={(text) => setProfile({ ...profile, age: text })}
        placeholder="e.g., 35"
        keyboardType="numeric"
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <View>
          <Target size={48} color="#16A34A" />
        </View>
      </View>
      <Text style={styles.stepTitle}>Your Goals</Text>
      <Text style={styles.stepDescription}>
        What would you like to achieve with ChefItUp?
      </Text>
      
      {goals.map((goal) => (
        <TouchableOpacity
          key={goal}
          style={[
            styles.optionButton,
            profile.goals.includes(goal) && styles.optionButtonSelected,
          ]}
          onPress={() => {
            const newGoals = profile.goals.includes(goal)
              ? profile.goals.filter(g => g !== goal)
              : [...profile.goals, goal];
            setProfile({ ...profile, goals: newGoals });
          }}
        >
          <Text style={[
            styles.optionText,
            profile.goals.includes(goal) && styles.optionTextSelected,
          ]}>
            {goal}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Dietary Preferences</Text>
      <Text style={styles.stepDescription}>
        Do you have any dietary restrictions or preferences?
      </Text>
      
      {restrictions.map((restriction) => (
        <TouchableOpacity
          key={restriction}
          style={[
            styles.optionButton,
            profile.restrictions.includes(restriction) && styles.optionButtonSelected,
          ]}
          onPress={() => {
            const newRestrictions = profile.restrictions.includes(restriction)
              ? profile.restrictions.filter(r => r !== restriction)
              : [...profile.restrictions, restriction];
            setProfile({ ...profile, restrictions: newRestrictions });
          }}
        >
          <Text style={[
            styles.optionText,
            profile.restrictions.includes(restriction) && styles.optionTextSelected,
          ]}>
            {restriction}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.inputLabel}>Daily Carb Budget (grams)</Text>
      <TextInput
        style={styles.textInput}
        value={profile.carbBudget}
        onChangeText={(text) => setProfile({ ...profile, carbBudget: text })}
        placeholder="e.g., 150"
        keyboardType="numeric"
      />
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <View>
          <Clock size={48} color="#16A34A" />
        </View>
      </View>
      <Text style={styles.stepTitle}>Cooking Experience</Text>
      <Text style={styles.stepDescription}>
        What's your cooking skill level?
      </Text>
      
      {cookingLevels.map((level) => (
        <TouchableOpacity
          key={level}
          style={[
            styles.optionButton,
            profile.cookingLevel === level && styles.optionButtonSelected,
          ]}
          onPress={() => setProfile({ ...profile, cookingLevel: level })}
        >
          <Text style={[
            styles.optionText,
            profile.cookingLevel === level && styles.optionTextSelected,
          ]}>
            {level}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const canProceed = () => {
    // Simple direct check for step 0
    if (currentStep === 0) {
      const hasName = profile.name && profile.name.trim().length > 0;
      return hasName;
    }
    
    // Other steps
    switch (currentStep) {
      case 1:
        return profile.diabetesType !== '' && profile.age !== '';
      case 2:
        return profile.goals.length > 0;
      case 3:
        return profile.carbBudget !== '';
      case 4:
        return profile.cookingLevel !== '';
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      case 3:
        return renderStep4();
      case 4:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {renderStepIndicator()}
        {renderCurrentStep()}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={goToPreviousStep}
              disabled={isCompleting}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.continueButton,
              { marginLeft: currentStep > 0 ? 16 : 0 },
              !canProceed() && styles.continueButtonDisabled,
            ]}
            onPress={() => {
              handleNext();
            }}
            disabled={!canProceed() || isCompleting}
          >
            <Text style={[
              styles.continueButtonText,
              !canProceed() && styles.continueButtonTextDisabled,
            ]}>
              {currentStep === 4 ? (isCompleting ? 'Saving...' : 'Get Started') : 'Continue'}
            </Text>
            <ChevronRight size={20} color={canProceed() ? '#ffffff' : '#9CA3AF'} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 160,
  },
  gestureContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  stepDotActive: {
    backgroundColor: '#16A34A',
  },
  stepDotInactive: {
    backgroundColor: '#E5E7EB',
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#16A34A',
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    marginTop: 24,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginHorizontal: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  continueButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  continueButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginRight: 8,
  },
  continueButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

export default OnboardingScreen;
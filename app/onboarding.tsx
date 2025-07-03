import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
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
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [profile, setProfile] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    diabetesType: '',
    age: '',
    carbBudget: '',
    restrictions: [],
    goals: [],
    cookingLevel: '',
  });

  const diabetesTypes = ['Type 1', 'Type 2', 'Pre-diabetes', 'Gestational'];
  const restrictions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Low-Sodium', 'Heart-Healthy'];
  const goals = ['Better Blood Sugar Control', 'Weight Management', 'Save Time', 'Learn New Recipes'];
  const cookingLevels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      setIsCompleting(true);
      try {

        // First, create the user account
        const { error: signUpError } = await signUp(profile.email, profile.password, {
          name: profile.name,
          diabetesType: profile.diabetesType,
          age: profile.age,
          carbBudget: profile.carbBudget,
          restrictions: profile.restrictions,
          goals: profile.goals,
          cookingLevel: profile.cookingLevel,
        });

        if (signUpError) {
          throw signUpError;
        }

        // Also save to local storage for offline access
        const onboardingData: OnboardingData = {
          name: profile.name,
          diabetesType: profile.diabetesType,
          age: profile.age,
          carbBudget: profile.carbBudget,
          restrictions: profile.restrictions,
          goals: profile.goals,
          cookingLevel: profile.cookingLevel,
        };

        await completeOnboarding(onboardingData);
        router.replace('/');
      } catch (error) {
        console.error('Error completing onboarding:', error);
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
      {[0, 1, 2, 3, 4, 5].map((step) => (
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

  const renderStep0 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <View>
          <Heart size={48} color="#16A34A" />
        </View>
      </View>
      <Text style={styles.stepTitle}>Create Your Account</Text>
      <Text style={styles.stepDescription}>
        Let's get you started with ChefItUp
      </Text>
      
      <Text style={styles.inputLabel}>Email Address</Text>
      <TextInput
        style={styles.textInput}
        value={profile.email}
        onChangeText={(text) => setProfile({ ...profile, email: text })}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <Text style={styles.inputLabel}>Password</Text>
      <TextInput
        style={styles.textInput}
        value={profile.password}
        onChangeText={(text) => setProfile({ ...profile, password: text })}
        placeholder="Create a password"
        secureTextEntry
        autoComplete="new-password"
      />

      <Text style={styles.inputLabel}>Confirm Password</Text>
      <TextInput
        style={styles.textInput}
        value={profile.confirmPassword}
        onChangeText={(text) => setProfile({ ...profile, confirmPassword: text })}
        placeholder="Confirm your password"
        secureTextEntry
        autoComplete="new-password"
      />
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
        onChangeText={(text) => setProfile({ ...profile, name: text })}
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
    switch (currentStep) {
      case 0:
        return profile.email !== '' && profile.password !== '' && profile.confirmPassword !== '' && profile.password === profile.confirmPassword;
      case 1:
        return profile.name !== '';
      case 2:
        return profile.diabetesType !== '' && profile.age !== '';
      case 3:
        return profile.goals.length > 0;
      case 4:
        return profile.carbBudget !== '';
      case 5:
        return profile.cookingLevel !== '';
      default:
        return false;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStep0();
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return renderStep0();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderStepIndicator()}
        {renderCurrentStep()}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !canProceed() && styles.continueButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed() || isCompleting}
        >
          <Text style={[
            styles.continueButtonText,
            !canProceed() && styles.continueButtonTextDisabled,
          ]}>
            {currentStep === 5 ? (isCompleting ? 'Creating Account...' : 'Create Account') : 'Continue'}
          </Text>
          <ChevronRight size={20} color={canProceed() ? '#ffffff' : '#9CA3AF'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
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
    paddingBottom: 100,
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
  continueButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
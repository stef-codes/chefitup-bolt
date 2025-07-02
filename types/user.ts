export interface UserProfile {
  // Basic info
  name: string;
  email: string;
  avatar: string;
  
  // Onboarding choices
  diabetesType: string;
  age: string;
  carbBudget: string;
  restrictions: string[];
  goals: string[];
  cookingLevel: string;
  
  // App usage data
  joinDate: string;
  preferences: {
    notifications: boolean;
    mealReminders: boolean;
    carbTracking: boolean;
    bloodSugarTracking: boolean;
  };
  
  // Stats (can be updated over time)
  stats: {
    mealsPrepped: number;
    recipesTried: number;
    streakDays: number;
    avgDailyCarbs: number;
  };
}

export interface OnboardingData {
  diabetesType: string;
  age: string;
  carbBudget: string;
  restrictions: string[];
  goals: string[];
  cookingLevel: string;
}

export const DIABETES_TYPES = ['Type 1', 'Type 2', 'Pre-diabetes', 'Gestational'] as const;
export const DIETARY_RESTRICTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Low-Sodium', 'Heart-Healthy'] as const;
export const HEALTH_GOALS = ['Better Blood Sugar Control', 'Weight Management', 'Save Time', 'Learn New Recipes'] as const;
export const COOKING_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const; 
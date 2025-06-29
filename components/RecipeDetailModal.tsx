import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Clock, Users, Heart, Plus, Calendar } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Recipe {
  id: number;
  name: string;
  image: string;
  carbs: number;
  protein: number;
  calories: number;
  prepTime: number;
  servings: number;
  glycemicIndex: string;
  category: string;
  difficulty: string;
  isFavorite: boolean;
}

interface RecipeDetailModalProps {
  visible: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  onAddToMealPlan: (recipe: Recipe, mealType: string, day: string) => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  visible,
  recipe,
  onClose,
  onAddToMealPlan,
}) => {
  const [showMealPlanOptions, setShowMealPlanOptions] = React.useState(false);

  if (!recipe) return null;

  const getGIColor = (gi: string) => {
    switch (gi) {
      case 'Very Low':
        return '#10B981';
      case 'Low':
        return '#16A34A';
      case 'Medium':
        return '#F59E0B';
      case 'High':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#10B981';
      case 'Medium':
        return '#F59E0B';
      case 'Hard':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const handleAddToMealPlan = (mealType: string, day: string) => {
    onAddToMealPlan(recipe, mealType, day);
    setShowMealPlanOptions(false);
    onClose();
  };

  const ingredients = [
    '2 cups quinoa, cooked',
    '1 cucumber, diced',
    '1 cup cherry tomatoes, halved',
    '1/2 red onion, thinly sliced',
    '1/2 cup kalamata olives',
    '1/2 cup feta cheese, crumbled',
    '1/4 cup fresh parsley, chopped',
    '3 tbsp olive oil',
    '2 tbsp lemon juice',
    'Salt and pepper to taste',
  ];

  const instructions = [
    'Cook quinoa according to package directions and let cool.',
    'In a large bowl, combine cooled quinoa, cucumber, tomatoes, and red onion.',
    'Add olives, feta cheese, and fresh parsley.',
    'In a small bowl, whisk together olive oil, lemon juice, salt, and pepper.',
    'Pour dressing over quinoa mixture and toss to combine.',
    'Refrigerate for at least 30 minutes before serving.',
    'Serve chilled and enjoy!',
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recipe Details</Text>
          <TouchableOpacity style={styles.favoriteButton}>
            <Heart
              size={24}
              color={recipe.isFavorite ? '#EF4444' : '#6B7280'}
              fill={recipe.isFavorite ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Recipe Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
            <View style={styles.imageOverlay}>
              <View style={styles.difficultyBadge}>
                <Text style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(recipe.difficulty) }
                ]}>
                  {recipe.difficulty}
                </Text>
              </View>
            </View>
          </View>

          {/* Recipe Info */}
          <View style={styles.content}>
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <Text style={styles.recipeCategory}>{recipe.category}</Text>

            {/* Stats Row */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{recipe.carbs}g</Text>
                <Text style={styles.statLabel}>Carbs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{recipe.protein}g</Text>
                <Text style={styles.statLabel}>Protein</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{recipe.calories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
            </View>

            {/* Meta Info */}
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.metaText}>{recipe.prepTime} minutes</Text>
              </View>
              <View style={styles.metaItem}>
                <Users size={16} color="#6B7280" />
                <Text style={styles.metaText}>{recipe.servings} servings</Text>
              </View>
              <View style={[
                styles.giIndicator,
                { backgroundColor: getGIColor(recipe.glycemicIndex) }
              ]}>
                <Text style={styles.giText}>{recipe.glycemicIndex} GI</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setShowMealPlanOptions(true)}
              >
                <Calendar size={20} color="#ffffff" />
                <Text style={styles.primaryButtonText}>Add to Meal Plan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Plus size={20} color="#16A34A" />
                <Text style={styles.secondaryButtonText}>Add to Shopping List</Text>
              </TouchableOpacity>
            </View>

            {/* Ingredients */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.ingredientBullet} />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>

            {/* Instructions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Meal Plan Options Modal */}
        <Modal
          visible={showMealPlanOptions}
          transparent
          animationType="fade"
          onRequestClose={() => setShowMealPlanOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.mealPlanModal}>
              <Text style={styles.mealPlanTitle}>Add to Meal Plan</Text>
              <Text style={styles.mealPlanSubtitle}>Choose a day and meal type</Text>
              
              <ScrollView style={styles.mealPlanOptions}>
                {weekDays.map((day) => (
                  <View key={day} style={styles.daySection}>
                    <Text style={styles.dayTitle}>{day}</Text>
                    <View style={styles.mealTypeRow}>
                      {mealTypes.map((mealType) => (
                        <TouchableOpacity
                          key={`${day}-${mealType}`}
                          style={styles.mealTypeButton}
                          onPress={() => handleAddToMealPlan(mealType, day)}
                        >
                          <Text style={styles.mealTypeText}>{mealType}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowMealPlanOptions(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  favoriteButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: 250,
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  difficultyText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    padding: 20,
  },
  recipeName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  recipeCategory: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#16A34A',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  giIndicator: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  giText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginTop: 8,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mealPlanModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  mealPlanTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  mealPlanSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  mealPlanOptions: {
    maxHeight: 300,
  },
  daySection: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  mealTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mealTypeButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 70,
  },
  mealTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default RecipeDetailModal;
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Search, Clock, Users, Filter, Heart } from 'lucide-react-native';

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

interface MealPlanCustomizationModalProps {
  visible: boolean;
  onClose: () => void;
  currentRecipe: Recipe | null;
  mealType: string;
  day: string;
  onRecipeSelect: (recipe: Recipe, mealType: string, day: string) => void;
}

const MealPlanCustomizationModal: React.FC<MealPlanCustomizationModalProps> = ({
  visible,
  onClose,
  currentRecipe,
  mealType,
  day,
  onRecipeSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Extended recipe database for customization
  const availableRecipes: Recipe[] = [
    // Breakfast Options
    {
      id: 101,
      name: 'Greek Yogurt Parfait',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
      carbs: 28,
      protein: 20,
      calories: 320,
      prepTime: 10,
      servings: 1,
      glycemicIndex: 'Medium',
      category: 'Breakfast',
      difficulty: 'Easy',
      isFavorite: false,
    },
    {
      id: 102,
      name: 'Almond Flour Pancakes',
      image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
      carbs: 22,
      protein: 16,
      calories: 350,
      prepTime: 15,
      servings: 2,
      glycemicIndex: 'Low',
      category: 'Breakfast',
      difficulty: 'Easy',
      isFavorite: true,
    },
    {
      id: 103,
      name: 'Chia Seed Pudding',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
      carbs: 18,
      protein: 12,
      calories: 280,
      prepTime: 5,
      servings: 1,
      glycemicIndex: 'Low',
      category: 'Breakfast',
      difficulty: 'Easy',
      isFavorite: true,
    },
    {
      id: 104,
      name: 'Veggie Scrambled Eggs',
      image: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg',
      carbs: 8,
      protein: 24,
      calories: 290,
      prepTime: 12,
      servings: 2,
      glycemicIndex: 'Very Low',
      category: 'Breakfast',
      difficulty: 'Easy',
      isFavorite: false,
    },
    {
      id: 105,
      name: 'Protein Smoothie Bowl',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
      carbs: 26,
      protein: 22,
      calories: 340,
      prepTime: 10,
      servings: 1,
      glycemicIndex: 'Low',
      category: 'Breakfast',
      difficulty: 'Easy',
      isFavorite: true,
    },
    {
      id: 106,
      name: 'Avocado Toast with Egg',
      image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
      carbs: 24,
      protein: 18,
      calories: 380,
      prepTime: 8,
      servings: 1,
      glycemicIndex: 'Low',
      category: 'Breakfast',
      difficulty: 'Easy',
      isFavorite: false,
    },

    // Lunch Options
    {
      id: 201,
      name: 'Mediterranean Quinoa Bowl',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 35,
      protein: 18,
      calories: 420,
      prepTime: 25,
      servings: 2,
      glycemicIndex: 'Low',
      category: 'Lunch',
      difficulty: 'Easy',
      isFavorite: true,
    },
    {
      id: 202,
      name: 'Grilled Chicken Caesar Salad',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 12,
      protein: 35,
      calories: 320,
      prepTime: 20,
      servings: 1,
      glycemicIndex: 'Very Low',
      category: 'Lunch',
      difficulty: 'Easy',
      isFavorite: false,
    },
    {
      id: 203,
      name: 'Turkey and Hummus Wrap',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 28,
      protein: 24,
      calories: 380,
      prepTime: 10,
      servings: 1,
      glycemicIndex: 'Medium',
      category: 'Lunch',
      difficulty: 'Easy',
      isFavorite: true,
    },
    {
      id: 204,
      name: 'Hearty Lentil Soup',
      image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
      carbs: 32,
      protein: 16,
      calories: 290,
      prepTime: 35,
      servings: 4,
      glycemicIndex: 'Low',
      category: 'Lunch',
      difficulty: 'Medium',
      isFavorite: false,
    },
    {
      id: 205,
      name: 'Buddha Bowl',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 38,
      protein: 14,
      calories: 410,
      prepTime: 30,
      servings: 2,
      glycemicIndex: 'Low',
      category: 'Lunch',
      difficulty: 'Medium',
      isFavorite: true,
    },
    {
      id: 206,
      name: 'Chickpea Salad Sandwich',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 42,
      protein: 18,
      calories: 390,
      prepTime: 15,
      servings: 2,
      glycemicIndex: 'Medium',
      category: 'Lunch',
      difficulty: 'Easy',
      isFavorite: true,
    },

    // Dinner Options
    {
      id: 301,
      name: 'Herb-Crusted Salmon',
      image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
      carbs: 12,
      protein: 32,
      calories: 380,
      prepTime: 30,
      servings: 4,
      glycemicIndex: 'Very Low',
      category: 'Dinner',
      difficulty: 'Medium',
      isFavorite: false,
    },
    {
      id: 302,
      name: 'Cauliflower Rice Stir-Fry',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 18,
      protein: 14,
      calories: 280,
      prepTime: 20,
      servings: 3,
      glycemicIndex: 'Low',
      category: 'Dinner',
      difficulty: 'Easy',
      isFavorite: true,
    },
    {
      id: 303,
      name: 'Zucchini Noodle Bolognese',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 15,
      protein: 25,
      calories: 290,
      prepTime: 35,
      servings: 4,
      glycemicIndex: 'Low',
      category: 'Dinner',
      difficulty: 'Medium',
      isFavorite: true,
    },
    {
      id: 304,
      name: 'Stuffed Bell Peppers',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 22,
      protein: 20,
      calories: 310,
      prepTime: 45,
      servings: 4,
      glycemicIndex: 'Low',
      category: 'Dinner',
      difficulty: 'Medium',
      isFavorite: true,
    },
    {
      id: 305,
      name: 'Grilled Chicken Thighs',
      image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
      carbs: 6,
      protein: 38,
      calories: 420,
      prepTime: 25,
      servings: 4,
      glycemicIndex: 'Very Low',
      category: 'Dinner',
      difficulty: 'Easy',
      isFavorite: false,
    },
    {
      id: 306,
      name: 'Turkey Meatballs',
      image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
      carbs: 18,
      protein: 26,
      calories: 320,
      prepTime: 30,
      servings: 4,
      glycemicIndex: 'Low',
      category: 'Dinner',
      difficulty: 'Medium',
      isFavorite: true,
    },

    // Snack Options
    {
      id: 401,
      name: 'Mixed Nuts and Seeds',
      image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg',
      carbs: 8,
      protein: 12,
      calories: 220,
      prepTime: 2,
      servings: 1,
      glycemicIndex: 'Very Low',
      category: 'Snacks',
      difficulty: 'Easy',
      isFavorite: false,
    },
    {
      id: 402,
      name: 'Apple with Almond Butter',
      image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
      carbs: 22,
      protein: 8,
      calories: 190,
      prepTime: 3,
      servings: 1,
      glycemicIndex: 'Medium',
      category: 'Snacks',
      difficulty: 'Easy',
      isFavorite: false,
    },
    {
      id: 403,
      name: 'Protein Energy Balls',
      image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg',
      carbs: 16,
      protein: 10,
      calories: 160,
      prepTime: 15,
      servings: 6,
      glycemicIndex: 'Low',
      category: 'Snacks',
      difficulty: 'Easy',
      isFavorite: false,
    },
  ];

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const filteredRecipes = availableRecipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchesMealType = recipe.category === mealType || mealType === 'Snack' && recipe.category === 'Snacks';
    const matchesFavorites = !showFavoritesOnly || recipe.isFavorite;
    
    return matchesSearch && matchesCategory && matchesMealType && matchesFavorites;
  });

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

  const handleRecipeSelect = (recipe: Recipe) => {
    onRecipeSelect(recipe, mealType, day);
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setShowFavoritesOnly(false);
    onClose();
  };

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
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Choose Recipe</Text>
            <Text style={styles.headerSubtitle}>
              {day} {mealType}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Current Recipe */}
        {currentRecipe && (
          <View style={styles.currentRecipeCard}>
            <Text style={styles.currentRecipeTitle}>Current Recipe</Text>
            <View style={styles.currentRecipeContent}>
              <Image source={{ uri: currentRecipe.image }} style={styles.currentRecipeImage} />
              <View style={styles.currentRecipeInfo}>
                <Text style={styles.currentRecipeName}>{currentRecipe.name}</Text>
                <View style={styles.currentRecipeStats}>
                  <Text style={styles.currentRecipeStat}>{currentRecipe.carbs}g carbs</Text>
                  <Text style={styles.currentRecipeStat}>•</Text>
                  <Text style={styles.currentRecipeStat}>{currentRecipe.prepTime}m</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Search and Filters */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View>
              <Search size={20} color="#6B7280" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.filtersRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category && styles.categoryChipSelected,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[
                      styles.categoryText,
                      selectedCategory === category && styles.categoryTextSelected,
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <TouchableOpacity
              style={[
                styles.favoritesFilter,
                showFavoritesOnly && styles.favoritesFilterActive,
              ]}
              onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Heart 
                size={16} 
                color={showFavoritesOnly ? '#ffffff' : '#EF4444'} 
                fill={showFavoritesOnly ? '#ffffff' : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipe List */}
        <ScrollView style={styles.recipeList} showsVerticalScrollIndicator={false}>
          {filteredRecipes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No recipes found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <View style={styles.recipesContainer}>
              {filteredRecipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={[
                    styles.recipeCard,
                    currentRecipe?.id === recipe.id && styles.recipeCardCurrent,
                  ]}
                  onPress={() => handleRecipeSelect(recipe)}
                >
                  <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                  
                  <View style={styles.recipeContent}>
                    <View style={styles.recipeHeader}>
                      <Text style={styles.recipeName}>{recipe.name}</Text>
                      {recipe.isFavorite && (
                        <View>
              <Heart size={16} color="#EF4444" fill="#EF4444" />
            </View>
                      )}
                    </View>
                    
                    <View style={styles.recipeStats}>
                      <View style={styles.recipeStat}>
                        <Text style={styles.recipeStatValue}>{recipe.carbs}g</Text>
                        <Text style={styles.recipeStatLabel}>carbs</Text>
                      </View>
                      <View style={styles.recipeStat}>
                        <Text style={styles.recipeStatValue}>{recipe.protein}g</Text>
                        <Text style={styles.recipeStatLabel}>protein</Text>
                      </View>
                      <View style={styles.recipeStat}>
                        <Text style={styles.recipeStatValue}>{recipe.calories}</Text>
                        <Text style={styles.recipeStatLabel}>cal</Text>
                      </View>
                    </View>
                    
                    <View style={styles.recipeMeta}>
                      <View style={styles.recipeMetaItem}>
                        <View>
              <Clock size={14} color="#6B7280" />
            </View>
                        <Text style={styles.recipeMetaText}>{recipe.prepTime}m</Text>
                      </View>
                      <View style={styles.recipeMetaItem}>
                        <View>
              <Users size={14} color="#6B7280" />
            </View>
                        <Text style={styles.recipeMetaText}>{recipe.servings}</Text>
                      </View>
                      <View style={[
                        styles.giIndicator,
                        { backgroundColor: getGIColor(recipe.glycemicIndex) }
                      ]}>
                        <Text style={styles.giText}>{recipe.glycemicIndex} GI</Text>
                      </View>
                    </View>
                  </View>
                  
                  {currentRecipe?.id === recipe.id && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentBadgeText}>Current</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
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
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  headerSpacer: {
    width: 40,
  },
  currentRecipeCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  currentRecipeTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 8,
  },
  currentRecipeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentRecipeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  currentRecipeInfo: {
    flex: 1,
  },
  currentRecipeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  currentRecipeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentRecipeStat: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  searchSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#16A34A',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryTextSelected: {
    color: '#ffffff',
  },
  favoritesFilter: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 8,
  },
  favoritesFilterActive: {
    backgroundColor: '#EF4444',
  },
  recipeList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  recipesContainer: {
    padding: 16,
    gap: 12,
  },
  recipeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  recipeCardCurrent: {
    borderWidth: 2,
    borderColor: '#16A34A',
  },
  recipeImage: {
    width: '100%',
    height: 120,
  },
  recipeContent: {
    padding: 16,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recipeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  recipeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  recipeStat: {
    alignItems: 'center',
  },
  recipeStatValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  recipeStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recipeMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeMetaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  giIndicator: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  giText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  currentBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  currentBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});

export default MealPlanCustomizationModal;
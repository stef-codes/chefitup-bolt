import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Clock, Users, Heart } from 'lucide-react-native';

const RecipesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Low-Carb', 'High-Protein'];

  const recipes = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
      isFavorite: false,
    },
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipes</Text>
        <Text style={styles.subtitle}>Diabetes-friendly meal options</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#16A34A" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recipe Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.recipesGrid}>
          {filteredRecipes.map((recipe) => (
            <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
              <View style={styles.recipeImageContainer}>
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                <TouchableOpacity style={styles.favoriteButton}>
                  <Heart
                    size={20}
                    color={recipe.isFavorite ? '#EF4444' : '#6B7280'}
                    fill={recipe.isFavorite ? '#EF4444' : 'transparent'}
                  />
                </TouchableOpacity>
                <View style={styles.difficultyBadge}>
                  <Text style={[
                    styles.difficultyText,
                    { color: getDifficultyColor(recipe.difficulty) }
                  ]}>
                    {recipe.difficulty}
                  </Text>
                </View>
              </View>
              
              <View style={styles.recipeContent}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                
                <View style={styles.recipeStats}>
                  <View style={styles.statRow}>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{recipe.carbs}g</Text>
                      <Text style={styles.statLabel}>carbs</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{recipe.protein}g</Text>
                      <Text style={styles.statLabel}>protein</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{recipe.calories}</Text>
                      <Text style={styles.statLabel}>cal</Text>
                    </View>
                  </View>
                  
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Clock size={14} color="#6B7280" />
                      <Text style={styles.metaText}>{recipe.prepTime}m</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Users size={14} color="#6B7280" />
                      <Text style={styles.metaText}>{recipe.servings}</Text>
                    </View>
                    <View style={[
                      styles.giIndicator,
                      { backgroundColor: getGIColor(recipe.glycemicIndex) }
                    ]}>
                      <Text style={styles.giText}>{recipe.glycemicIndex} GI</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  filterButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoriesWrapper: {
    height: 28,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 4,
    alignItems: 'center',
  },
  categoryChip: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
  },
  categoryChipSelected: {
    backgroundColor: '#16A34A',
  },
  categoryText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryTextSelected: {
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  recipesGrid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 16,
  },
  recipeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  recipeImageContainer: {
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: 200,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  recipeContent: {
    padding: 16,
  },
  recipeName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 24,
  },
  recipeStats: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  giIndicator: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  giText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});

export default RecipesScreen;
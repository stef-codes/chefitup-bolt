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
    // Breakfast Recipes
    {
      id: 1,
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
      id: 2,
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
    {
      id: 3,
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
      id: 4,
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
      id: 5,
      name: 'Steel Cut Oatmeal Bowl',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
      carbs: 35,
      protein: 8,
      calories: 250,
      prepTime: 25,
      servings: 1,
      glycemicIndex: 'Medium',
      category: 'Breakfast',
      difficulty: 'Easy',
      isFavorite: true,
    },
    {
      id: 6,
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
    {
      id: 7,
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
      id: 8,
      name: 'Cottage Cheese Bowl',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
      carbs: 15,
      protein: 28,
      calories: 260,
      prepTime: 5,
      servings: 1,
      glycemicIndex: 'Low',
      category: 'Breakfast',
      difficulty: 'Easy',
      isFavorite: false,
    },

    // Lunch Recipes
    {
      id: 9,
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
      id: 10,
      name: 'Grilled Chicken Salad',
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
      id: 11,
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
      id: 12,
      name: 'Lentil Soup',
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
      id: 13,
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
      id: 14,
      name: 'Tuna Stuffed Avocado',
      image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
      carbs: 8,
      protein: 28,
      calories: 340,
      prepTime: 10,
      servings: 2,
      glycemicIndex: 'Very Low',
      category: 'Lunch',
      difficulty: 'Easy',
      isFavorite: false,
    },
    {
      id: 15,
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
    {
      id: 16,
      name: 'Asian Lettuce Wraps',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 14,
      protein: 22,
      calories: 260,
      prepTime: 18,
      servings: 3,
      glycemicIndex: 'Low',
      category: 'Lunch',
      difficulty: 'Medium',
      isFavorite: false,
    },

    // Dinner Recipes
    {
      id: 17,
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
      id: 18,
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
      id: 19,
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
      id: 20,
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
      id: 21,
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
      id: 22,
      name: 'Baked Cod with Vegetables',
      image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
      carbs: 16,
      protein: 28,
      calories: 290,
      prepTime: 35,
      servings: 3,
      glycemicIndex: 'Low',
      category: 'Dinner',
      difficulty: 'Easy',
      isFavorite: false,
    },
    {
      id: 23,
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
    {
      id: 24,
      name: 'Eggplant Parmesan',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 24,
      protein: 18,
      calories: 350,
      prepTime: 50,
      servings: 6,
      glycemicIndex: 'Medium',
      category: 'Dinner',
      difficulty: 'Hard',
      isFavorite: false,
    },
    {
      id: 25,
      name: 'Pork Tenderloin with Herbs',
      image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
      carbs: 8,
      protein: 34,
      calories: 380,
      prepTime: 40,
      servings: 4,
      glycemicIndex: 'Very Low',
      category: 'Dinner',
      difficulty: 'Medium',
      isFavorite: true,
    },

    // Snack Recipes
    {
      id: 26,
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
      id: 27,
      name: 'Cucumber Hummus Bites',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 12,
      protein: 6,
      calories: 120,
      prepTime: 8,
      servings: 2,
      glycemicIndex: 'Low',
      category: 'Snacks',
      difficulty: 'Easy',
      isFavorite: true,
    },
    {
      id: 28,
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
      id: 29,
      name: 'Cheese and Veggie Sticks',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 6,
      protein: 14,
      calories: 180,
      prepTime: 5,
      servings: 1,
      glycemicIndex: 'Very Low',
      category: 'Snacks',
      difficulty: 'Easy',
      isFavorite: true,
    },
    {
      id: 30,
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
    {
      id: 31,
      name: 'Roasted Chickpeas',
      image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg',
      carbs: 20,
      protein: 8,
      calories: 140,
      prepTime: 30,
      servings: 4,
      glycemicIndex: 'Medium',
      category: 'Snacks',
      difficulty: 'Easy',
      isFavorite: true,
    },

    // Low-Carb Recipes
    {
      id: 32,
      name: 'Keto Cauliflower Mac',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 8,
      protein: 16,
      calories: 280,
      prepTime: 25,
      servings: 4,
      glycemicIndex: 'Very Low',
      category: 'Low-Carb',
      difficulty: 'Medium',
      isFavorite: false,
    },
    {
      id: 33,
      name: 'Zucchini Lasagna',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 12,
      protein: 22,
      calories: 320,
      prepTime: 60,
      servings: 6,
      glycemicIndex: 'Low',
      category: 'Low-Carb',
      difficulty: 'Hard',
      isFavorite: true,
    },
    {
      id: 34,
      name: 'Shirataki Noodle Pad Thai',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 10,
      protein: 18,
      calories: 240,
      prepTime: 20,
      servings: 2,
      glycemicIndex: 'Very Low',
      category: 'Low-Carb',
      difficulty: 'Medium',
      isFavorite: false,
    },
    {
      id: 35,
      name: 'Cabbage Roll Casserole',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 14,
      protein: 20,
      calories: 290,
      prepTime: 45,
      servings: 6,
      glycemicIndex: 'Low',
      category: 'Low-Carb',
      difficulty: 'Medium',
      isFavorite: true,
    },
    {
      id: 36,
      name: 'Portobello Mushroom Burger',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 9,
      protein: 15,
      calories: 220,
      prepTime: 15,
      servings: 2,
      glycemicIndex: 'Very Low',
      category: 'Low-Carb',
      difficulty: 'Easy',
      isFavorite: false,
    },
    {
      id: 37,
      name: 'Spaghetti Squash Carbonara',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 16,
      protein: 18,
      calories: 310,
      prepTime: 35,
      servings: 4,
      glycemicIndex: 'Low',
      category: 'Low-Carb',
      difficulty: 'Medium',
      isFavorite: true,
    },

    // High-Protein Recipes
    {
      id: 38,
      name: 'Protein-Packed Smoothie',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
      carbs: 18,
      protein: 35,
      calories: 380,
      prepTime: 5,
      servings: 1,
      glycemicIndex: 'Low',
      category: 'High-Protein',
      difficulty: 'Easy',
      isFavorite: false,
    },
    {
      id: 39,
      name: 'Quinoa Protein Bowl',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 28,
      protein: 32,
      calories: 450,
      prepTime: 20,
      servings: 2,
      glycemicIndex: 'Low',
      category: 'High-Protein',
      difficulty: 'Easy',
      isFavorite: true,
    },
    {
      id: 40,
      name: 'Lentil Power Salad',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 24,
      protein: 28,
      calories: 380,
      prepTime: 15,
      servings: 2,
      glycemicIndex: 'Low',
      category: 'High-Protein',
      difficulty: 'Easy',
      isFavorite: false,
    },
    {
      id: 41,
      name: 'Chicken Protein Muffins',
      image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
      carbs: 12,
      protein: 30,
      calories: 320,
      prepTime: 35,
      servings: 6,
      glycemicIndex: 'Low',
      category: 'High-Protein',
      difficulty: 'Medium',
      isFavorite: true,
    },
    {
      id: 42,
      name: 'Black Bean Burger',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 32,
      protein: 26,
      calories: 420,
      prepTime: 25,
      servings: 4,
      glycemicIndex: 'Medium',
      category: 'High-Protein',
      difficulty: 'Medium',
      isFavorite: false,
    },
    {
      id: 43,
      name: 'Tofu Scramble',
      image: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg',
      carbs: 8,
      protein: 24,
      calories: 280,
      prepTime: 12,
      servings: 2,
      glycemicIndex: 'Very Low',
      category: 'High-Protein',
      difficulty: 'Easy',
      isFavorite: true,
    },

    // Additional Variety Recipes
    {
      id: 44,
      name: 'Mediterranean Fish Stew',
      image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
      carbs: 20,
      protein: 28,
      calories: 340,
      prepTime: 40,
      servings: 4,
      glycemicIndex: 'Low',
      category: 'Dinner',
      difficulty: 'Medium',
      isFavorite: false,
    },
    {
      id: 45,
      name: 'Veggie Frittata',
      image: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg',
      carbs: 10,
      protein: 22,
      calories: 290,
      prepTime: 25,
      servings: 4,
      glycemicIndex: 'Very Low',
      category: 'Breakfast',
      difficulty: 'Medium',
      isFavorite: true,
    },
    {
      id: 46,
      name: 'Cauliflower Soup',
      image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
      carbs: 14,
      protein: 8,
      calories: 180,
      prepTime: 30,
      servings: 4,
      glycemicIndex: 'Low',
      category: 'Lunch',
      difficulty: 'Easy',
      isFavorite: false,
    },
    {
      id: 47,
      name: 'Baked Sweet Potato',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      carbs: 38,
      protein: 4,
      calories: 180,
      prepTime: 45,
      servings: 1,
      glycemicIndex: 'Medium',
      category: 'Snacks',
      difficulty: 'Easy',
      isFavorite: true,
    },
    {
      id: 48,
      name: 'Spinach and Feta Stuffed Chicken',
      image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg',
      carbs: 6,
      protein: 36,
      calories: 380,
      prepTime: 35,
      servings: 4,
      glycemicIndex: 'Very Low',
      category: 'Dinner',
      difficulty: 'Medium',
      isFavorite: false,
    },
    {
      id: 49,
      name: 'Chia Seed Crackers',
      image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg',
      carbs: 12,
      protein: 8,
      calories: 150,
      prepTime: 60,
      servings: 8,
      glycemicIndex: 'Low',
      category: 'Snacks',
      difficulty: 'Medium',
      isFavorite: true,
    },
    {
      id: 50,
      name: 'Turkey and Vegetable Soup',
      image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
      carbs: 16,
      protein: 24,
      calories: 260,
      prepTime: 45,
      servings: 6,
      glycemicIndex: 'Low',
      category: 'Lunch',
      difficulty: 'Medium',
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
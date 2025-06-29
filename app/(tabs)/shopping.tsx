import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Plus, Trash2, ShoppingCart, DollarSign, RefreshCw, Calendar } from 'lucide-react-native';

const ShoppingScreen = () => {
  const [newItem, setNewItem] = useState('');
  const [shoppingList, setShoppingList] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Meal plan data (in a real app, this would come from a shared state/context)
  const currentWeekMealPlan = {
    Monday: {
      Breakfast: { name: 'Greek Yogurt Parfait with Berries', ingredients: ['Greek yogurt (32 oz)', 'Mixed berries (2 cups)', 'Granola (1 cup)', 'Honey (1 bottle)'] },
      Lunch: { name: 'Mediterranean Quinoa Bowl', ingredients: ['Quinoa (2 cups)', 'Cucumber (2 large)', 'Cherry tomatoes (1 lb)', 'Red onion (1 medium)', 'Kalamata olives (1 jar)', 'Feta cheese (8 oz)', 'Fresh parsley (1 bunch)', 'Olive oil (1 bottle)', 'Lemons (3 pieces)'] },
      Dinner: { name: 'Herb-Crusted Salmon with Vegetables', ingredients: ['Salmon fillets (1.5 lbs)', 'Fresh herbs (dill, parsley)', 'Broccoli (2 heads)', 'Asparagus (1 lb)', 'Garlic (1 bulb)', 'Lemon (2 pieces)'] },
    },
    Tuesday: {
      Breakfast: { name: 'Almond Flour Pancakes', ingredients: ['Almond flour (2 lbs)', 'Eggs (1 dozen)', 'Almond milk (32 oz)', 'Baking powder (1 container)', 'Vanilla extract (1 bottle)', 'Sugar-free syrup (1 bottle)'] },
      Lunch: { name: 'Cauliflower Rice Stir-Fry', ingredients: ['Cauliflower (2 heads)', 'Bell peppers (3 mixed)', 'Snap peas (1 lb)', 'Carrots (1 lb)', 'Ginger (1 piece)', 'Soy sauce (1 bottle)', 'Sesame oil (1 bottle)'] },
      Dinner: { name: 'Zucchini Noodle Bolognese', ingredients: ['Zucchini (4 large)', 'Ground turkey (1 lb)', 'Crushed tomatoes (28 oz can)', 'Onion (1 large)', 'Celery (1 bunch)', 'Carrots (1 lb)', 'Italian herbs (dried)', 'Parmesan cheese (8 oz)'] },
    },
    Wednesday: {
      Breakfast: { name: 'Chia Seed Pudding Bowl', ingredients: ['Chia seeds (1 lb)', 'Coconut milk (2 cans)', 'Vanilla extract (1 bottle)', 'Fresh berries (2 cups)', 'Unsweetened cocoa powder (1 container)'] },
      Lunch: { name: 'Grilled Chicken Caesar Salad', ingredients: ['Chicken breast (1.5 lbs)', 'Romaine lettuce (3 heads)', 'Parmesan cheese (8 oz)', 'Caesar dressing (1 bottle)', 'Whole grain croutons (1 bag)'] },
      Dinner: { name: 'Stuffed Bell Peppers', ingredients: ['Bell peppers (6 large)', 'Ground turkey (1 lb)', 'Brown rice (2 cups)', 'Onion (1 medium)', 'Diced tomatoes (14 oz can)', 'Mozzarella cheese (8 oz)'] },
    },
    Thursday: {
      Breakfast: { name: 'Veggie Scrambled Eggs', ingredients: ['Eggs (1 dozen)', 'Spinach (5 oz bag)', 'Mushrooms (8 oz)', 'Bell pepper (1 medium)', 'Onion (1 small)', 'Cheese (shredded, 8 oz)'] },
      Lunch: { name: 'Turkey and Hummus Wrap', ingredients: ['Whole wheat tortillas (1 pack)', 'Sliced turkey (1 lb)', 'Hummus (2 containers)', 'Cucumber (1 large)', 'Tomato (2 medium)', 'Lettuce (1 head)', 'Red onion (1 small)'] },
      Dinner: { name: 'Baked Cod with Roasted Vegetables', ingredients: ['Cod fillets (1.5 lbs)', 'Sweet potato (3 large)', 'Brussels sprouts (1 lb)', 'Red onion (1 large)', 'Olive oil (1 bottle)', 'Fresh thyme (1 package)'] },
    },
    Friday: {
      Breakfast: { name: 'Protein Smoothie Bowl', ingredients: ['Protein powder (1 container)', 'Frozen berries (2 lbs)', 'Banana (6 pieces)', 'Spinach (5 oz bag)', 'Almond butter (1 jar)', 'Coconut flakes (1 bag)', 'Chia seeds (1 lb)'] },
      Lunch: { name: 'Hearty Lentil Soup', ingredients: ['Green lentils (2 lbs)', 'Vegetable broth (64 oz)', 'Carrots (1 lb)', 'Celery (1 bunch)', 'Onion (1 large)', 'Garlic (1 bulb)', 'Bay leaves (1 package)', 'Diced tomatoes (14 oz can)'] },
      Dinner: { name: 'Turkey Meatballs with Marinara', ingredients: ['Ground turkey (1.5 lbs)', 'Breadcrumbs (1 container)', 'Eggs (1 dozen)', 'Marinara sauce (24 oz jar)', 'Onion (1 medium)', 'Garlic (1 bulb)', 'Italian seasoning (1 container)'] },
    },
    Saturday: {
      Breakfast: { name: 'Avocado Toast with Poached Egg', ingredients: ['Whole grain bread (1 loaf)', 'Avocados (4 large)', 'Eggs (1 dozen)', 'Cherry tomatoes (1 pint)', 'Everything bagel seasoning (1 container)', 'Lime (3 pieces)'] },
      Lunch: { name: 'Colorful Buddha Bowl', ingredients: ['Quinoa (2 cups)', 'Sweet potato (2 large)', 'Chickpeas (2 cans)', 'Red cabbage (1 head)', 'Carrots (1 lb)', 'Cucumber (1 large)', 'Tahini (1 jar)', 'Lemon (2 pieces)'] },
      Dinner: { name: 'Grilled Chicken Thighs', ingredients: ['Chicken thighs (2 lbs)', 'Rosemary (fresh, 1 package)', 'Thyme (fresh, 1 package)', 'Garlic (1 bulb)', 'Lemon (3 pieces)', 'Olive oil (1 bottle)'] },
    },
    Sunday: {
      Breakfast: { name: 'Steel Cut Oatmeal Bowl', ingredients: ['Steel cut oats (2 lbs)', 'Almond milk (32 oz)', 'Cinnamon (1 container)', 'Walnuts (1 lb)', 'Fresh berries (2 cups)', 'Maple syrup (1 bottle)'] },
      Lunch: { name: 'Chickpea Salad Sandwich', ingredients: ['Chickpeas (2 cans)', 'Whole grain bread (1 loaf)', 'Celery (1 bunch)', 'Red onion (1 small)', 'Mayo (1 jar)', 'Dijon mustard (1 jar)', 'Lettuce (1 head)'] },
      Dinner: { name: 'Herb-Crusted Pork Tenderloin', ingredients: ['Pork tenderloin (2 lbs)', 'Fresh herbs (rosemary, thyme)', 'Garlic (1 bulb)', 'Dijon mustard (1 jar)', 'Green beans (1 lb)', 'Baby potatoes (2 lbs)'] },
    },
  };

  // Ingredient categories and estimated prices
  const ingredientDatabase = {
    // Proteins
    'Greek yogurt (32 oz)': { category: 'Dairy', price: 5.49 },
    'Salmon fillets (1.5 lbs)': { category: 'Protein', price: 18.99 },
    'Chicken breast (1.5 lbs)': { category: 'Protein', price: 12.99 },
    'Chicken thighs (2 lbs)': { category: 'Protein', price: 8.99 },
    'Ground turkey (1 lb)': { category: 'Protein', price: 6.99 },
    'Ground turkey (1.5 lbs)': { category: 'Protein', price: 9.99 },
    'Cod fillets (1.5 lbs)': { category: 'Protein', price: 16.99 },
    'Sliced turkey (1 lb)': { category: 'Protein', price: 7.99 },
    'Pork tenderloin (2 lbs)': { category: 'Protein', price: 14.99 },
    'Eggs (1 dozen)': { category: 'Protein', price: 3.99 },
    
    // Vegetables
    'Mixed berries (2 cups)': { category: 'Produce', price: 6.99 },
    'Cucumber (2 large)': { category: 'Produce', price: 2.99 },
    'Cucumber (1 large)': { category: 'Produce', price: 1.99 },
    'Cherry tomatoes (1 lb)': { category: 'Produce', price: 4.99 },
    'Cherry tomatoes (1 pint)': { category: 'Produce', price: 3.99 },
    'Bell peppers (3 mixed)': { category: 'Produce', price: 4.99 },
    'Bell pepper (1 medium)': { category: 'Produce', price: 1.99 },
    'Bell peppers (6 large)': { category: 'Produce', price: 8.99 },
    'Broccoli (2 heads)': { category: 'Produce', price: 4.99 },
    'Cauliflower (2 heads)': { category: 'Produce', price: 6.99 },
    'Spinach (5 oz bag)': { category: 'Produce', price: 3.49 },
    'Romaine lettuce (3 heads)': { category: 'Produce', price: 4.99 },
    'Lettuce (1 head)': { category: 'Produce', price: 2.49 },
    'Avocados (4 large)': { category: 'Produce', price: 5.99 },
    'Sweet potato (3 large)': { category: 'Produce', price: 3.99 },
    'Sweet potato (2 large)': { category: 'Produce', price: 2.99 },
    'Carrots (1 lb)': { category: 'Produce', price: 1.99 },
    'Onion (1 large)': { category: 'Produce', price: 1.49 },
    'Onion (1 medium)': { category: 'Produce', price: 0.99 },
    'Onion (1 small)': { category: 'Produce', price: 0.79 },
    'Red onion (1 medium)': { category: 'Produce', price: 1.29 },
    'Red onion (1 large)': { category: 'Produce', price: 1.79 },
    'Red onion (1 small)': { category: 'Produce', price: 0.99 },
    'Garlic (1 bulb)': { category: 'Produce', price: 0.99 },
    'Ginger (1 piece)': { category: 'Produce', price: 1.99 },
    'Asparagus (1 lb)': { category: 'Produce', price: 4.99 },
    'Snap peas (1 lb)': { category: 'Produce', price: 4.49 },
    'Mushrooms (8 oz)': { category: 'Produce', price: 2.99 },
    'Zucchini (4 large)': { category: 'Produce', price: 3.99 },
    'Brussels sprouts (1 lb)': { category: 'Produce', price: 4.99 },
    'Celery (1 bunch)': { category: 'Produce', price: 2.49 },
    'Banana (6 pieces)': { category: 'Produce', price: 2.99 },
    'Fresh berries (2 cups)': { category: 'Produce', price: 6.99 },
    'Red cabbage (1 head)': { category: 'Produce', price: 2.99 },
    'Green beans (1 lb)': { category: 'Produce', price: 3.99 },
    'Baby potatoes (2 lbs)': { category: 'Produce', price: 4.99 },
    'Tomato (2 medium)': { category: 'Produce', price: 2.99 },
    'Lemons (3 pieces)': { category: 'Produce', price: 2.49 },
    'Lemon (2 pieces)': { category: 'Produce', price: 1.99 },
    'Lemon (3 pieces)': { category: 'Produce', price: 2.49 },
    'Lime (3 pieces)': { category: 'Produce', price: 1.99 },
    
    // Grains & Pantry
    'Quinoa (2 cups)': { category: 'Grains', price: 6.99 },
    'Brown rice (2 cups)': { category: 'Grains', price: 3.99 },
    'Steel cut oats (2 lbs)': { category: 'Grains', price: 5.99 },
    'Almond flour (2 lbs)': { category: 'Baking', price: 12.99 },
    'Whole grain bread (1 loaf)': { category: 'Bakery', price: 3.99 },
    'Whole wheat tortillas (1 pack)': { category: 'Bakery', price: 4.49 },
    'Granola (1 cup)': { category: 'Pantry', price: 5.99 },
    
    // Dairy
    'Feta cheese (8 oz)': { category: 'Dairy', price: 4.99 },
    'Parmesan cheese (8 oz)': { category: 'Dairy', price: 6.99 },
    'Mozzarella cheese (8 oz)': { category: 'Dairy', price: 4.49 },
    'Cheese (shredded, 8 oz)': { category: 'Dairy', price: 4.99 },
    'Almond milk (32 oz)': { category: 'Dairy', price: 3.99 },
    'Coconut milk (2 cans)': { category: 'Pantry', price: 3.99 },
    
    // Pantry Items
    'Olive oil (1 bottle)': { category: 'Pantry', price: 8.99 },
    'Sesame oil (1 bottle)': { category: 'Pantry', price: 6.99 },
    'Soy sauce (1 bottle)': { category: 'Pantry', price: 3.99 },
    'Honey (1 bottle)': { category: 'Pantry', price: 4.99 },
    'Maple syrup (1 bottle)': { category: 'Pantry', price: 7.99 },
    'Sugar-free syrup (1 bottle)': { category: 'Pantry', price: 5.99 },
    'Vanilla extract (1 bottle)': { category: 'Baking', price: 6.99 },
    'Baking powder (1 container)': { category: 'Baking', price: 2.99 },
    'Kalamata olives (1 jar)': { category: 'Pantry', price: 4.99 },
    'Hummus (2 containers)': { category: 'Pantry', price: 6.99 },
    'Tahini (1 jar)': { category: 'Pantry', price: 8.99 },
    'Mayo (1 jar)': { category: 'Pantry', price: 4.49 },
    'Dijon mustard (1 jar)': { category: 'Pantry', price: 3.99 },
    'Caesar dressing (1 bottle)': { category: 'Pantry', price: 3.99 },
    'Marinara sauce (24 oz jar)': { category: 'Pantry', price: 3.99 },
    'Crushed tomatoes (28 oz can)': { category: 'Pantry', price: 2.99 },
    'Diced tomatoes (14 oz can)': { category: 'Pantry', price: 1.99 },
    'Vegetable broth (64 oz)': { category: 'Pantry', price: 3.99 },
    'Chickpeas (2 cans)': { category: 'Pantry', price: 2.99 },
    'Green lentils (2 lbs)': { category: 'Pantry', price: 4.99 },
    'Chia seeds (1 lb)': { category: 'Nuts & Seeds', price: 9.99 },
    'Almond butter (1 jar)': { category: 'Nuts & Seeds', price: 8.99 },
    'Walnuts (1 lb)': { category: 'Nuts & Seeds', price: 12.99 },
    'Coconut flakes (1 bag)': { category: 'Baking', price: 4.99 },
    'Protein powder (1 container)': { category: 'Supplements', price: 29.99 },
    'Frozen berries (2 lbs)': { category: 'Frozen', price: 8.99 },
    'Breadcrumbs (1 container)': { category: 'Pantry', price: 2.99 },
    'Whole grain croutons (1 bag)': { category: 'Pantry', price: 3.99 },
    'Unsweetened cocoa powder (1 container)': { category: 'Baking', price: 4.99 },
    'Cinnamon (1 container)': { category: 'Spices', price: 2.99 },
    'Italian seasoning (1 container)': { category: 'Spices', price: 2.99 },
    'Italian herbs (dried)': { category: 'Spices', price: 3.99 },
    'Bay leaves (1 package)': { category: 'Spices', price: 2.49 },
    'Everything bagel seasoning (1 container)': { category: 'Spices', price: 3.99 },
    'Fresh herbs (dill, parsley)': { category: 'Produce', price: 4.99 },
    'Fresh parsley (1 bunch)': { category: 'Produce', price: 1.99 },
    'Fresh herbs (rosemary, thyme)': { category: 'Produce', price: 4.99 },
    'Rosemary (fresh, 1 package)': { category: 'Produce', price: 2.99 },
    'Thyme (fresh, 1 package)': { category: 'Produce', price: 2.99 },
    'Fresh thyme (1 package)': { category: 'Produce', price: 2.99 },
  };

  const categories = ['Produce', 'Protein', 'Dairy', 'Grains', 'Pantry', 'Nuts & Seeds', 'Spices', 'Baking', 'Frozen', 'Supplements', 'Bakery'];

  // Generate shopping list from meal plan
  const generateShoppingListFromMealPlan = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const allIngredients = [];
      
      // Extract all ingredients from the week's meal plan
      Object.values(currentWeekMealPlan).forEach(day => {
        Object.values(day).forEach(meal => {
          meal.ingredients.forEach(ingredient => {
            allIngredients.push(ingredient);
          });
        });
      });

      // Remove duplicates and create shopping list items
      const uniqueIngredients = [...new Set(allIngredients)];
      
      const newShoppingList = uniqueIngredients.map((ingredient, index) => {
        const dbItem = ingredientDatabase[ingredient];
        return {
          id: Date.now() + index,
          name: ingredient,
          category: dbItem?.category || 'Other',
          quantity: '1',
          price: dbItem?.price || 0,
          checked: false,
          fromMealPlan: true,
        };
      });

      setShoppingList(newShoppingList);
      setIsGenerating(false);
      
      Alert.alert(
        'Shopping List Generated!',
        `Added ${newShoppingList.length} items from your meal plan`,
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  // Initialize with some basic items
  useEffect(() => {
    const basicItems = [
      { id: 1, name: 'Greek yogurt (32 oz)', category: 'Dairy', quantity: '1', price: 5.49, checked: false, fromMealPlan: false },
      { id: 2, name: 'Olive oil (1 bottle)', category: 'Pantry', quantity: '1', price: 8.99, checked: true, fromMealPlan: false },
      { id: 3, name: 'Eggs (1 dozen)', category: 'Protein', quantity: '1', price: 3.99, checked: false, fromMealPlan: false },
    ];
    
    if (shoppingList.length === 0) {
      setShoppingList(basicItems);
    }
  }, []);

  const toggleItem = (id: number) => {
    setShoppingList(list =>
      list.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setShoppingList(list => list.filter(item => item.id !== id));
  };

  const addItem = () => {
    if (newItem.trim()) {
      const newShoppingItem = {
        id: Date.now(),
        name: newItem.trim(),
        category: 'Other',
        quantity: '1',
        price: 0,
        checked: false,
        fromMealPlan: false,
      };
      setShoppingList([...shoppingList, newShoppingItem]);
      setNewItem('');
    }
  };

  const clearList = () => {
    Alert.alert(
      'Clear Shopping List',
      'Are you sure you want to remove all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setShoppingList([]) },
      ]
    );
  };

  const getItemsByCategory = (category: string) => {
    return shoppingList.filter(item => item.category === category);
  };

  const getTotalPrice = () => {
    return shoppingList.reduce((total, item) => total + item.price, 0);
  };

  const getCheckedPrice = () => {
    return shoppingList
      .filter(item => item.checked)
      .reduce((total, item) => total + item.price, 0);
  };

  const getCheckedCount = () => {
    return shoppingList.filter(item => item.checked).length;
  };

  const getMealPlanItemsCount = () => {
    return shoppingList.filter(item => item.fromMealPlan).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.mainScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Shopping List</Text>
          <Text style={styles.subtitle}>
            {getMealPlanItemsCount() > 0 
              ? `${getMealPlanItemsCount()} items from meal plan`
              : 'Add items or generate from meal plan'
            }
          </Text>
        </View>

        {/* Shopping Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <ShoppingCart size={20} color="#16A34A" />
              <View style={styles.summaryText}>
                <Text style={styles.summaryValue}>
                  {getCheckedCount()}/{shoppingList.length}
                </Text>
                <Text style={styles.summaryLabel}>Items</Text>
              </View>
            </View>
            
            <View style={styles.summaryDivider} />
            
            <View style={styles.summaryItem}>
              <DollarSign size={20} color="#10B981" />
              <View style={styles.summaryText}>
                <Text style={styles.summaryValue}>
                  ${getCheckedPrice().toFixed(2)}
                </Text>
                <Text style={styles.summaryLabel}>
                  of ${getTotalPrice().toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: shoppingList.length > 0 ? `${(getCheckedCount() / shoppingList.length) * 100}%` : '0%' }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {shoppingList.length > 0 ? Math.round((getCheckedCount() / shoppingList.length) * 100) : 0}% complete
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsCard}>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity 
              style={[styles.quickActionButton, styles.generateButton]}
              onPress={generateShoppingListFromMealPlan}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RefreshCw size={18} color="#ffffff" style={{ transform: [{ rotate: '45deg' }] }} />
              ) : (
                <Calendar size={18} color="#ffffff" />
              )}
              <Text style={styles.generateButtonText}>
                {isGenerating ? 'Generating...' : 'From Meal Plan'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, styles.clearButton]}
              onPress={clearList}
              disabled={shoppingList.length === 0}
            >
              <Trash2 size={18} color={shoppingList.length === 0 ? '#9CA3AF' : '#EF4444'} />
              <Text style={[
                styles.clearButtonText,
                shoppingList.length === 0 && styles.clearButtonTextDisabled
              ]}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add New Item */}
        <View style={styles.addItemCard}>
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              placeholder="Add custom item..."
              value={newItem}
              onChangeText={setNewItem}
              onSubmitEditing={addItem}
            />
            <TouchableOpacity style={styles.addButton} onPress={addItem}>
              <Plus size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shopping List by Category */}
        {shoppingList.length === 0 ? (
          <View style={styles.emptyState}>
            <ShoppingCart size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>Your shopping list is empty</Text>
            <Text style={styles.emptyStateText}>
              Generate items from your meal plan or add custom items
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={generateShoppingListFromMealPlan}
            >
              <Calendar size={20} color="#16A34A" />
              <Text style={styles.emptyStateButtonText}>Generate from Meal Plan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {categories.map(category => {
              const categoryItems = getItemsByCategory(category);
              
              if (categoryItems.length === 0) return null;
              
              return (
                <View key={category} style={styles.categorySection}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <Text style={styles.categoryCount}>
                      {categoryItems.filter(item => item.checked).length}/{categoryItems.length}
                    </Text>
                  </View>
                  {categoryItems.map(item => (
                    <View key={item.id} style={styles.itemRow}>
                      <TouchableOpacity
                        style={styles.itemCheck}
                        onPress={() => toggleItem(item.id)}
                      >
                        <View style={[
                          styles.checkbox,
                          item.checked && styles.checkboxChecked
                        ]}>
                          {item.checked && (
                            <Check size={16} color="#ffffff" />
                          )}
                        </View>
                      </TouchableOpacity>
                      
                      <View style={styles.itemDetails}>
                        <View style={styles.itemNameRow}>
                          <Text style={[
                            styles.itemName,
                            item.checked && styles.itemNameChecked
                          ]}>
                            {item.name}
                          </Text>
                          {item.fromMealPlan && (
                            <View style={styles.mealPlanBadge}>
                              <Text style={styles.mealPlanBadgeText}>MP</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.itemMeta}>
                          <Text style={styles.itemQuantity}>{item.quantity}</Text>
                          {item.price > 0 && (
                            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                          )}
                        </View>
                      </View>
                      
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => removeItem(item.id)}
                      >
                        <Trash2 size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {/* Bottom spacing for action buttons */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Action Buttons - Fixed at bottom */}
      {shoppingList.length > 0 && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <ShoppingCart size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Start Shopping</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Share List</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  mainScrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
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
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryText: {
    alignItems: 'flex-start',
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  quickActionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 12,
  },
  generateButton: {
    backgroundColor: '#16A34A',
  },
  generateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  clearButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  clearButtonTextDisabled: {
    color: '#9CA3AF',
  },
  addItemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addItemContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  addItemInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    marginHorizontal: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#16A34A',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#16A34A',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemCheck: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  itemDetails: {
    flex: 1,
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  mealPlanBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  mealPlanBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#16A34A',
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 120, // Space for fixed action buttons
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButton: {
    flex: 1,
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
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
});

export default ShoppingScreen;
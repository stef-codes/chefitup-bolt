import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Linking,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Plus, Trash2, ShoppingCart, RefreshCw, Calendar, ExternalLink } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { showToast } from '../../utils/toast';

type ShoppingListItem = {
  id: number;
  name: string;
  category: string;
  quantity: string;
  checked: boolean;
  fromMealPlan: boolean;
};

const ShoppingScreen = () => {
  const [newItem, setNewItem] = useState('');
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

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

  // Ingredient categories
  const ingredientDatabase = {
    // Proteins
    'Greek yogurt (32 oz)': { category: 'Dairy' },
    'Salmon fillets (1.5 lbs)': { category: 'Protein' },
    'Chicken breast (1.5 lbs)': { category: 'Protein' },
    'Chicken thighs (2 lbs)': { category: 'Protein' },
    'Ground turkey (1 lb)': { category: 'Protein' },
    'Ground turkey (1.5 lbs)': { category: 'Protein' },
    'Cod fillets (1.5 lbs)': { category: 'Protein' },
    'Sliced turkey (1 lb)': { category: 'Protein' },
    'Pork tenderloin (2 lbs)': { category: 'Protein' },
    'Eggs (1 dozen)': { category: 'Protein' },
    
    // Vegetables
    'Mixed berries (2 cups)': { category: 'Produce' },
    'Cucumber (2 large)': { category: 'Produce' },
    'Cucumber (1 large)': { category: 'Produce' },
    'Cherry tomatoes (1 lb)': { category: 'Produce' },
    'Cherry tomatoes (1 pint)': { category: 'Produce' },
    'Bell peppers (3 mixed)': { category: 'Produce' },
    'Bell pepper (1 medium)': { category: 'Produce' },
    'Bell peppers (6 large)': { category: 'Produce' },
    'Broccoli (2 heads)': { category: 'Produce' },
    'Cauliflower (2 heads)': { category: 'Produce' },
    'Spinach (5 oz bag)': { category: 'Produce' },
    'Romaine lettuce (3 heads)': { category: 'Produce' },
    'Lettuce (1 head)': { category: 'Produce' },
    'Avocados (4 large)': { category: 'Produce' },
    'Sweet potato (3 large)': { category: 'Produce' },
    'Sweet potato (2 large)': { category: 'Produce' },
    'Carrots (1 lb)': { category: 'Produce' },
    'Onion (1 large)': { category: 'Produce' },
    'Onion (1 medium)': { category: 'Produce' },
    'Onion (1 small)': { category: 'Produce' },
    'Red onion (1 medium)': { category: 'Produce' },
    'Red onion (1 large)': { category: 'Produce' },
    'Red onion (1 small)': { category: 'Produce' },
    'Garlic (1 bulb)': { category: 'Produce' },
    'Ginger (1 piece)': { category: 'Produce' },
    'Asparagus (1 lb)': { category: 'Produce' },
    'Snap peas (1 lb)': { category: 'Produce' },
    'Mushrooms (8 oz)': { category: 'Produce' },
    'Zucchini (4 large)': { category: 'Produce' },
    'Brussels sprouts (1 lb)': { category: 'Produce' },
    'Celery (1 bunch)': { category: 'Produce' },
    'Banana (6 pieces)': { category: 'Produce' },
    'Fresh berries (2 cups)': { category: 'Produce' },
    'Red cabbage (1 head)': { category: 'Produce' },
    'Green beans (1 lb)': { category: 'Produce' },
    'Baby potatoes (2 lbs)': { category: 'Produce' },
    'Tomato (2 medium)': { category: 'Produce' },
    'Lemons (3 pieces)': { category: 'Produce' },
    'Lemon (2 pieces)': { category: 'Produce' },
    'Lemon (3 pieces)': { category: 'Produce' },
    'Lime (3 pieces)': { category: 'Produce' },
    
    // Grains & Pantry
    'Quinoa (2 cups)': { category: 'Grains' },
    'Brown rice (2 cups)': { category: 'Grains' },
    'Steel cut oats (2 lbs)': { category: 'Grains' },
    'Almond flour (2 lbs)': { category: 'Baking' },
    'Whole grain bread (1 loaf)': { category: 'Bakery' },
    'Whole wheat tortillas (1 pack)': { category: 'Bakery' },
    'Granola (1 cup)': { category: 'Pantry' },
    
    // Dairy
    'Feta cheese (8 oz)': { category: 'Dairy' },
    'Parmesan cheese (8 oz)': { category: 'Dairy' },
    'Mozzarella cheese (8 oz)': { category: 'Dairy' },
    'Cheese (shredded, 8 oz)': { category: 'Dairy' },
    'Almond milk (32 oz)': { category: 'Dairy' },
    'Coconut milk (2 cans)': { category: 'Pantry' },
    
    // Pantry Items
    'Olive oil (1 bottle)': { category: 'Pantry' },
    'Sesame oil (1 bottle)': { category: 'Pantry' },
    'Soy sauce (1 bottle)': { category: 'Pantry' },
    'Honey (1 bottle)': { category: 'Pantry' },
    'Maple syrup (1 bottle)': { category: 'Pantry' },
    'Sugar-free syrup (1 bottle)': { category: 'Pantry' },
    'Vanilla extract (1 bottle)': { category: 'Baking' },
    'Baking powder (1 container)': { category: 'Baking' },
    'Kalamata olives (1 jar)': { category: 'Pantry' },
    'Hummus (2 containers)': { category: 'Pantry' },
    'Tahini (1 jar)': { category: 'Pantry' },
    'Mayo (1 jar)': { category: 'Pantry' },
    'Dijon mustard (1 jar)': { category: 'Pantry' },
    'Caesar dressing (1 bottle)': { category: 'Pantry' },
    'Marinara sauce (24 oz jar)': { category: 'Pantry' },
    'Crushed tomatoes (28 oz can)': { category: 'Pantry' },
    'Diced tomatoes (14 oz can)': { category: 'Pantry' },
    'Vegetable broth (64 oz)': { category: 'Pantry' },
    'Chickpeas (2 cans)': { category: 'Pantry' },
    'Green lentils (2 lbs)': { category: 'Pantry' },
    'Chia seeds (1 lb)': { category: 'Nuts & Seeds' },
    'Almond butter (1 jar)': { category: 'Nuts & Seeds' },
    'Walnuts (1 lb)': { category: 'Nuts & Seeds' },
    'Coconut flakes (1 bag)': { category: 'Baking' },
    'Protein powder (1 container)': { category: 'Supplements' },
    'Frozen berries (2 lbs)': { category: 'Frozen' },
    'Breadcrumbs (1 container)': { category: 'Pantry' },
    'Whole grain croutons (1 bag)': { category: 'Pantry' },
    'Unsweetened cocoa powder (1 container)': { category: 'Baking' },
    'Cinnamon (1 container)': { category: 'Spices' },
    'Italian seasoning (1 container)': { category: 'Spices' },
    'Italian herbs (dried)': { category: 'Spices' },
    'Bay leaves (1 package)': { category: 'Spices' },
    'Everything bagel seasoning (1 container)': { category: 'Spices' },
    'Fresh herbs (dill, parsley)': { category: 'Produce' },
    'Fresh parsley (1 bunch)': { category: 'Produce' },
    'Fresh herbs (rosemary, thyme)': { category: 'Produce' },
    'Rosemary (fresh, 1 package)': { category: 'Produce' },
    'Thyme (fresh, 1 package)': { category: 'Produce' },
    'Fresh thyme (1 package)': { category: 'Produce' },
  };

  const categories = ['Produce', 'Protein', 'Dairy', 'Grains', 'Pantry', 'Nuts & Seeds', 'Spices', 'Baking', 'Frozen', 'Supplements', 'Bakery'];

  // Generate shopping list from meal plan
  const generateShoppingListFromMealPlan = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const allIngredients: string[] = [];
      
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
      
      const newShoppingList: ShoppingListItem[] = uniqueIngredients.map((ingredient, index) => {
        const dbItem = ingredientDatabase[ingredient as keyof typeof ingredientDatabase];
        return {
          id: Date.now() + index,
          name: ingredient,
          category: dbItem?.category || 'Other',
          quantity: '1',
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
      { id: 1, name: 'Greek yogurt (32 oz)', category: 'Dairy', quantity: '1', checked: false, fromMealPlan: false },
      { id: 2, name: 'Olive oil (1 bottle)', category: 'Pantry', quantity: '1', checked: true, fromMealPlan: false },
      { id: 3, name: 'Eggs (1 dozen)', category: 'Protein', quantity: '1', checked: false, fromMealPlan: false },
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

  const getCheckedCount = () => {
    return shoppingList.filter(item => item.checked).length;
  };

  const getMealPlanItemsCount = () => {
    return shoppingList.filter(item => item.fromMealPlan).length;
  };

  const copyShoppingListToClipboard = async () => {
    if (shoppingList.length === 0) {
      showToast({ message: 'No items to copy.', backgroundColor: '#EF4444' });
      return;
    }

    try {
      // Create a formatted shopping list with categories
      const itemsByCategory: { [key: string]: ShoppingListItem[] } = {};
      shoppingList.forEach(item => {
        if (!itemsByCategory[item.category]) {
          itemsByCategory[item.category] = [];
        }
        itemsByCategory[item.category].push(item);
      });

      let shoppingListText = `🛒 ChefItUp Shopping List\n`;
      shoppingListText += `Total Items: ${shoppingList.length}\n`;
      shoppingListText += `Generated: ${new Date().toLocaleDateString()}\n\n`;

      Object.keys(itemsByCategory).forEach(category => {
        shoppingListText += `📋 ${category}:\n`;
        itemsByCategory[category].forEach((item: ShoppingListItem) => {
          shoppingListText += `  • ${item.quantity} ${item.name}\n`;
        });
        shoppingListText += '\n';
      });

      shoppingListText += `\n---\nGenerated by ChefItUp App`;
      
      await Clipboard.setString(shoppingListText);
      showToast({ 
        message: `Copied ${shoppingList.length} items to clipboard!`, 
        backgroundColor: '#16A34A' 
      });
      console.log('Shopping list copied to clipboard:', shoppingListText);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      showToast({ message: 'Failed to copy to clipboard.', backgroundColor: '#EF4444' });
    }
  };

  const sendToInstacart = async () => {
    if (shoppingList.length === 0) {
      showToast({ message: 'Please add items to your shopping list first.', backgroundColor: '#EF4444' });
      return;
    }

    // Show loading state
    showToast({ message: 'Preparing your shopping list...', backgroundColor: '#16A34A' });

    try {
      // Prepare the shopping list data
      const shoppingListData = {
        title: 'ChefItUp Shopping List',
        items: shoppingList.map(item => ({
          name: item.name.trim(),
          quantity: parseFloat(item.quantity) || 1,
          unit: '',
          category: item.category,
          notes: item.fromMealPlan ? 'From meal plan' : ''
        })),
        totalItems: shoppingList.length,
        categories: [...new Set(shoppingList.map(item => item.category))],
        fromMealPlan: shoppingList.some(item => item.fromMealPlan)
      };

      // Log the complete shopping list data
      console.log('=== SHOPPING LIST DATA ===');
      console.log('Total Items:', shoppingListData.totalItems);
      console.log('Categories:', shoppingListData.categories);
      console.log('From Meal Plan:', shoppingListData.fromMealPlan);
      console.log('Items:', shoppingListData.items);
      console.log('================================================');

      // Simulate API call delay
      setTimeout(async () => {
        try {
          // Create a formatted shopping list for sharing
          const shoppingListText = shoppingListData.items
            .map(item => `${item.quantity} ${item.name}`)
            .join('\n');
          
          // Create a search query with the most common items
          const itemNames = shoppingListData.items.map(item => item.name);
          const searchQuery = encodeURIComponent(itemNames.slice(0, 5).join(' '));
          
          // Log the shopping list in a readable format
          console.log('=== SHOPPING LIST FOR INSTACART ===');
          console.log(shoppingListText);
          console.log('Search Query:', searchQuery);
          console.log('===================================');
          
          // Copy shopping list to clipboard first
          await copyShoppingListToClipboard();
          
          // Attempt to send shopping list to Instacart via their API
          try {
            // Get API key from environment (if available)
            const apiKey = process.env.INSTACART_API_KEY;
            
            if (apiKey && apiKey !== 'your_instacart_api_key_here') {
              // Real API integration attempt using the correct endpoint
              console.log('Attempting to send shopping list to Instacart API...');
              
              // Prepare the API payload according to the correct format
              const apiPayload = {
                title: shoppingListData.title,
                image_url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
                link_type: "shopping_list",
                expires_in: 86400, // 24 hours in seconds
                instructions: [
                  "Generated from ChefItUp meal planning app",
                  `Contains ${shoppingListData.totalItems} items across ${shoppingListData.categories.length} categories`
                ],
                line_items: shoppingListData.items.map(item => ({
                  name: item.name,
                  quantity: item.quantity,
                  unit: item.unit || "unit",
                  display_text: `${item.quantity} ${item.name}`,
                  line_item_measurements: [
                    {
                      quantity: item.quantity,
                      unit: item.unit || "unit"
                    }
                  ],
                  filters: {
                    brand_filters: [],
                    health_filters: []
                  }
                })),
                landing_page_configuration: {
                  partner_linkback_url: "https://chefitup.app",
                  enable_pantry_items: true
                }
              };
              
              console.log('API Payload:', JSON.stringify(apiPayload, null, 2));
              
              const apiResponse = await fetch('https://connect.dev.instacart.tools/idp/v1/products/products_link', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiPayload)
              });
              
              console.log('API Response Status:', apiResponse.status);
              console.log('API Response Headers:', Object.fromEntries(apiResponse.headers.entries()));
              
              if (apiResponse.ok) {
                const responseData = await apiResponse.json();
                console.log('Successfully sent shopping list to Instacart API:', responseData);
                
                // Check if the response contains a link to open
                if (responseData.link_url) {
                  showToast({ 
                    message: `Shopping list sent! Opening Instacart...`, 
                    backgroundColor: '#16A34A' 
                  });
                  
                  // Open the specific link from Instacart
                  await Linking.openURL(responseData.link_url);
                  console.log('Opened Instacart with specific link:', responseData.link_url);
                } else {
                  showToast({ 
                    message: `Shopping list sent to Instacart! Opening app...`, 
                    backgroundColor: '#16A34A' 
                  });
                  
                  // Fallback to main Instacart site
                  await Linking.openURL('https://www.instacart.com');
                }
              } else {
                const errorData = await apiResponse.text();
                console.error('API request failed:', apiResponse.status, errorData);
                
                // Show specific error message based on status code
                let errorMessage = 'API request failed';
                if (apiResponse.status === 401) {
                  errorMessage = 'Invalid API key';
                } else if (apiResponse.status === 403) {
                  errorMessage = 'Access denied';
                } else if (apiResponse.status === 429) {
                  errorMessage = 'Rate limit exceeded';
                } else if (apiResponse.status >= 500) {
                  errorMessage = 'Instacart service unavailable';
                }
                
                console.error('Error details:', errorMessage);
                throw new Error(`${errorMessage}: ${apiResponse.status}`);
              }
            } else {
              // Fallback: Open Instacart with search query
              console.log('No API key available, using search query fallback');
              const instacartSearchUrl = `https://www.instacart.com/store/search?query=${searchQuery}`;
              
              const canOpen = await Linking.canOpenURL(instacartSearchUrl);
              if (canOpen) {
                await Linking.openURL(instacartSearchUrl);
                console.log('Opened Instacart with search query:', instacartSearchUrl);
              } else {
                // Fallback to main Instacart site
                await Linking.openURL('https://www.instacart.com');
                console.log('Opened main Instacart site as fallback');
              }
            }
          } catch (error) {
            console.error('Error sending to Instacart:', error);
            // Fallback to main Instacart site
            await Linking.openURL('https://www.instacart.com');
            console.log('Opened main Instacart site as fallback');
          }
          
          // Show success message
          showToast({ 
            message: `Shopping list copied! Opening Instacart with ${shoppingListData.totalItems} items...`, 
            backgroundColor: '#16A34A' 
          });

        } catch (error) {
          console.error('Error processing shopping list:', error);
          showToast({ message: 'Error processing shopping list. Please try again.', backgroundColor: '#EF4444' });
        }
      }, 1500);

    } catch (error) {
      console.error('Error preparing shopping list:', error);
      showToast({ message: 'Error preparing shopping list. Please try again.', backgroundColor: '#EF4444' });
    }
  };

  // Add userProfile and handleProfilePress
  const userProfile = {
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
  };
  const handleProfilePress = () => {
    // @ts-ignore
    if (typeof router !== 'undefined') {
      router.push('/(tabs)/profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.mainScrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}> 
          <View>
            <Text style={styles.title}>Shopping List</Text>
            {/* Add any subtitle if needed */}
          </View>
          <TouchableOpacity 
            style={styles.profileIcon}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: userProfile.avatar }} 
              style={styles.profileAvatar}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Shopping Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View>
              <ShoppingCart size={20} color="#16A34A" />
            </View>
              <View style={styles.summaryText}>
                <Text style={styles.summaryValue}>
                  {getCheckedCount()}
                </Text>
                <Text style={styles.summaryLabel}>
                  of {shoppingList.length} items
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
                <View>
              <RefreshCw size={18} color="#ffffff" style={{ transform: [{ rotate: '45deg' }] }} />
            </View>
              ) : (
                <View>
                  <Calendar size={18} color="#ffffff" />
                </View>
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
              <View>
              <Trash2 size={18} color={shoppingList.length === 0 ? '#9CA3AF' : '#EF4444'} />
            </View>
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
              <View>
              <Plus size={20} color="#ffffff" />
            </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Shopping List by Category */}
        {shoppingList.length === 0 ? (
          <View style={styles.emptyState}>
            <View>
              <ShoppingCart size={48} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyStateTitle}>Your shopping list is empty</Text>
            <Text style={styles.emptyStateText}>
              Generate items from your meal plan or add custom items
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={generateShoppingListFromMealPlan}
            >
              <View>
              <Calendar size={20} color="#16A34A" />
            </View>
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
                            <View>
              <Check size={16} color="#ffffff" />
            </View>
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
                        </View>
                        <View style={styles.itemMeta}>
                          <Text style={styles.itemQuantity}>{item.quantity}</Text>
                        </View>
                      </View>
                      
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => removeItem(item.id)}
                      >
                        <View>
              <Trash2 size={18} color="#EF4444" />
            </View>
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
          <TouchableOpacity style={styles.copyListButton} onPress={copyShoppingListToClipboard}>
            <View>
              <ExternalLink size={20} color="#3B82F6" />
            </View>
            <Text style={styles.copyListButtonText}>Copy Shopping List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.instacartButton} onPress={sendToInstacart}>
            <View>
              <ExternalLink size={20} color="#ffffff" />
            </View>
            <Text style={styles.instacartButtonText}>Open Instacart</Text>
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
  copyButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  copyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  copyButtonTextDisabled: {
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
    flexDirection: 'column',
    gap: 8,
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
  copyListButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  copyListButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  instacartButton: {
    flex: 1,
    backgroundColor: '#43A047',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  instacartButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  profileIcon: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    transform: [{ scale: 1 }],
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});

export default ShoppingScreen;
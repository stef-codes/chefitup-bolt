import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Plus, Trash2, ShoppingCart, DollarSign } from 'lucide-react-native';

const ShoppingScreen = () => {
  const [newItem, setNewItem] = useState('');
  const [shoppingList, setShoppingList] = useState([
    { id: 1, name: 'Quinoa', category: 'Grains', quantity: '2 cups', price: 6.99, checked: false },
    { id: 2, name: 'Greek Yogurt', category: 'Dairy', quantity: '32 oz', price: 5.49, checked: true },
    { id: 3, name: 'Salmon Fillets', category: 'Protein', quantity: '1 lb', price: 14.99, checked: false },
    { id: 4, name: 'Cauliflower', category: 'Vegetables', quantity: '1 head', price: 3.99, checked: false },
    { id: 5, name: 'Bell Peppers', category: 'Vegetables', quantity: '3 peppers', price: 4.99, checked: true },
    { id: 6, name: 'Olive Oil', category: 'Pantry', quantity: '1 bottle', price: 8.99, checked: false },
    { id: 7, name: 'Almonds', category: 'Nuts & Seeds', quantity: '1 bag', price: 7.99, checked: false },
    { id: 8, name: 'Spinach', category: 'Vegetables', quantity: '5 oz bag', price: 3.49, checked: false },
  ]);

  const categories = ['Vegetables', 'Protein', 'Dairy', 'Grains', 'Pantry', 'Nuts & Seeds'];

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
      };
      setShoppingList([...shoppingList, newShoppingItem]);
      setNewItem('');
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List</Text>
        <Text style={styles.subtitle}>This week's ingredients</Text>
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
                { width: `${(getCheckedCount() / shoppingList.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((getCheckedCount() / shoppingList.length) * 100)}% complete
          </Text>
        </View>
      </View>

      {/* Add New Item */}
      <View style={styles.addItemCard}>
        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.addItemInput}
            placeholder="Add new item..."
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {categories.map(category => {
          const categoryItems = getItemsByCategory(category);
          
          if (categoryItems.length === 0) return null;
          
          return (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
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
                    <Text style={[
                      styles.itemName,
                      item.checked && styles.itemNameChecked
                    ]}>
                      {item.name}
                    </Text>
                    <View style={styles.itemMeta}>
                      <Text style={styles.itemQuantity}>{item.quantity}</Text>
                      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
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
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Start Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Share List</Text>
        </TouchableOpacity>
      </View>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
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
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
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
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  bottomPadding: {
    height: 100,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
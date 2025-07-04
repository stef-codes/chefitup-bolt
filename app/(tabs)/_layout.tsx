import { Tabs } from 'expo-router';
import { View, TouchableOpacity, Text } from 'react-native';
import { Chrome, Home, Calendar, ShoppingCart, Target, User } from 'lucide-react-native';
import { useProfileMenu } from '../../contexts/ProfileMenuContext';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const { showProfileMenu, setShowProfileMenu, handleSignOut } = useProfileMenu();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {/* Profile Menu Overlay */}
      {showProfileMenu && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
          }}
          onPress={() => setShowProfileMenu(false)}
        >
          <View
            style={{
              position: 'absolute',
              top: 60,
              right: 20,
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              minWidth: 200,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 8,
              }}
              onPress={() => {
                setShowProfileMenu(false);
                router.push('/profile');
              }}
            >
              <User size={20} color="#16A34A" />
              <Text style={{ marginLeft: 12, fontSize: 16, fontFamily: 'Inter-Medium', color: '#111827' }}>
                Profile
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderTopWidth: 1,
                borderTopColor: '#E5E7EB',
                marginTop: 8,
              }}
              onPress={handleSignOut}
            >
              <Text style={{ fontSize: 16, fontFamily: 'Inter-Medium', color: '#EF4444' }}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      <Tabs
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTitleStyle: {
            fontFamily: 'Inter-Bold',
            fontSize: 18,
            color: '#111827',
          },
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            paddingTop: 0,
            paddingBottom: 16,
            height: 100,
          },
          tabBarActiveTintColor: '#16A34A',
          tabBarInactiveTintColor: '#6B7280',
          tabBarLabelStyle: {
            fontFamily: 'Inter-Medium',
            fontSize: 12,
            marginTop: 2,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => (
              <View>
                <Home size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="nutrition"
          options={{
            title: 'Nutrition',
            tabBarIcon: ({ size, color }) => (
              <View>
                <Target size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="meal-plan"
          options={{
            title: 'Meals',
            tabBarIcon: ({ size, color }) => (
              <View>
                <Calendar size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="shopping"
          options={{
            title: 'Shop',
            tabBarIcon: ({ size, color }) => (
              <View>
                <ShoppingCart size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="recipes"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}
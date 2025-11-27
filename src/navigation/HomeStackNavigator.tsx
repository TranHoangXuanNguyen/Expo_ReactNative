import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ShopScreen from '../screens/ShopScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CartScreen from '../screens/CartScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminProducts from '../screens/admin/AdminProducts';
import AdminOrders from '../screens/admin/AdminOrders';
import AdminCategoryScreen from '../screens/admin/AdminCategoryScreen';
import AdminUserScreen from '../screens/admin/AdminUserScreen'; 
const HomeStack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }} >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
      <HomeStack.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ headerShown: true, title: 'Cá nhân' }} 
  />

      <HomeStack.Screen name="Shop" component={ShopScreen} />
      <HomeStack.Screen name="Categories" component={CategoriesScreen} />
      <HomeStack.Screen name="Cart" component={CartScreen} /> 
      {/* Nhóm màn hình Admin */}
      <HomeStack.Screen name="AdminDashboard" component={AdminDashboard} />
      <HomeStack.Screen name="AdminProducts" component={AdminProducts} />
      <HomeStack.Screen name="AdminOrders" component={AdminOrders} />
      <HomeStack.Screen name="AdminCategories" component={AdminCategoryScreen} />
      <HomeStack.Screen name="AdminUsers" component={AdminUserScreen} />

    </HomeStack.Navigator>
  );
}

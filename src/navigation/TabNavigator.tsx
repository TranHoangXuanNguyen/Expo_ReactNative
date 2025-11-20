import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from './HomeStackNavigator';
import SettingsScreen from '../screens/SettingScreen'; 

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {/* Tab "HomeTab" sẽ render toàn bộ HomeStackNavigator */}
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator} 
        options={{ title: 'Home' }} 
      />

      {/* Tab "SettingsTab" chỉ render 1 màn hình SettingsScreen */}
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }} 
      />
    </Tab.Navigator>
  );
}

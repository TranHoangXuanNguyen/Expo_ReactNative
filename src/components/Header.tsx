import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header({ title = "App Name", showBack = false }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleCartPress = () => {
    navigation.navigate('Cart'); 
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.contentContainer}>
        
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ) : (
             <Ionicons name="book" size={24} color="#4A90E2" />
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>

        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={handleCartPress} style={styles.cartButton}>
            <Ionicons name="cart-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 100,
    elevation: 3,
  },
  contentContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContainer: { width: 50, alignItems: 'flex-start' },
  rightContainer: { width: 50, alignItems: 'flex-end' },
  titleContainer: { flex: 1, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  iconButton: { padding: 5 },
  cartButton: { padding: 5, position: 'relative' },
});

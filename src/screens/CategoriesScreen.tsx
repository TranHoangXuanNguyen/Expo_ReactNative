import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import { CategoryRepository } from '../database/repositories/CategoryRepository';

const GRADIENTS = [
  ['#FF9A9E', '#FECFEF'],
  ['#a18cd1', '#fbc2eb'],
  ['#84fab0', '#8fd3f4'],
  ['#e0c3fc', '#8ec5fc'],
];

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CategoryRepository.getAll()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);


  const renderItem = ({ item, index }) => {
    const colors = GRADIENTS[index % GRADIENTS.length];

    return (
      <TouchableOpacity 
        style={styles.itemContainer} 
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('Shop', { categoryId: item.id });
        }}
      >
        <LinearGradient
          colors={colors}
          start={{x: 0, y: 0}} end={{x: 1, y: 0}}
          style={styles.gradientBg}
        >
          <View style={styles.iconContainer}>
              <Ionicons name="bookmarks" size={24} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.catName}>{item.name}</Text>
            <Text style={styles.catCount}>Khám phá ngay</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" style={{ opacity: 0.8 }} />
        </LinearGradient>
      </TouchableOpacity>
    );
  };  return (
    <View style={styles.container}>
      <Header title="Danh Mục" showBack={true} />
      
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 50 }}/>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  itemContainer: {
    height: 80,
    marginBottom: 15,
    borderRadius: 16,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  gradientBg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 40, height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15
  },
  textContainer: { flex: 1 },
  catName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  catCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  }
});

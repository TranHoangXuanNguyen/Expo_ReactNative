import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TouchableOpacity, ActivityIndicator, Dimensions, TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { BookRepository } from '../database/repositories/BookRepository'; 
import { CategoryRepository } from '../database/repositories/CategoryRepository'; // Import thêm cái này

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 45) / 2;
const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả giá', min: 0, max: Infinity },
  { id: 'r1', label: 'Dưới 50k', min: 0, max: 50000 },
  { id: 'r2', label: '50k - 100k', min: 50000, max: 100000 },
  { id: 'r3', label: '100k - 200k', min: 100000, max: 200000 },
  { id: 'r4', label: 'Trên 200k', min: 200000, max: Infinity },
];
export default function ShopScreen({ navigation,route }) {
  const [books, setBooks] = useState([]); 
  const [filteredBooks, setFilteredBooks] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // null = Tất cả
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);

useEffect(() => {
   
    if (route.params && route.params.categoryId) {
      setSelectedCategory(route.params.categoryId);
      navigation.setParams({ categoryId: null });
    }
  }, [route.params]);
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchText, selectedCategory, books, selectedPriceRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [booksData, categoriesData] = await Promise.all([
        BookRepository.getAll(),
        CategoryRepository.getAll()
      ]);

      setBooks(booksData);
      setCategories([{ id: null, name: 'Tất cả' }, ...categoriesData]);
      setFilteredBooks(booksData);
    } catch (error) {
      console.error("Lỗi load data:", error);
    } finally {
      setLoading(false);
    }
  };

const filterBooks = () => {
    let result = books;

    if (searchText) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCategory !== null) {
      const selectedCatObj = categories.find(cat => cat.id === selectedCategory);

      if (selectedCatObj) {
        result = result.filter(book => book.category === selectedCatObj.name);
      }
    }

    if (selectedPriceRange.id !== 'all') {
      result = result.filter(book => 
        book.price >= selectedPriceRange.min && book.price <= selectedPriceRange.max
      );
    }

    setFilteredBooks(result);
  };

  const renderCategoryItem = ({ item }) => {
    const isSelected = selectedCategory === item.id;
    return (
      <TouchableOpacity 
        style={[styles.catItem, isSelected && styles.catItemActive]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <Text style={[styles.catText, isSelected && styles.catTextActive]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Details', { book: item })} 
    >
      <Image 
        source={{ uri: item.imageUrl ? item.imageUrl : `https://source.unsplash.com/random/200x300?book&sig=${item.id}` }} 
        style={styles.bookImage} 
      />
      <View style={styles.cardContent}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
          </Text> 
          <View style={styles.addButton}>
             <Ionicons name="add" size={16} color="#fff" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
const renderPriceItem = ({ item }) => {
    const isSelected = selectedPriceRange.id === item.id;
    return (
      <TouchableOpacity 
        style={[styles.catItem, isSelected && styles.catItemActive]}
        onPress={() => setSelectedPriceRange(item)}
      >
        <Text style={[styles.catText, isSelected && styles.catTextActive]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Header title="Kho Sách" showBack={true} />
      
      <View style={styles.filterContainer}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput 
            placeholder="Tìm kiếm sách..."
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
               <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Horizontal List */}
        <View style={{ marginTop: 12 }}>
          <FlatList 
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id === null ? 'all' : item.id.toString()}
            renderItem={renderCategoryItem}
          />
        </View>
        {/* Price Range Horizontal List */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.sectionLabel}>Khoảng giá:</Text>
          <FlatList 
            data={PRICE_RANGES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={renderPriceItem}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : (
        <FlatList
          data={filteredBooks} // Dùng filteredBooks thay vì books
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Không tìm thấy sách phù hợp.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 15, paddingTop: 5 }, // Giảm padding top vì đã có filter ở trên
  row: { justifyContent: 'space-between' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
  
  // Style cho Filter
  filterContainer: {
    backgroundColor: '#fff',
    padding: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#F0F2F5',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  // Style cho Category Item
  catItem: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  catItemActive: {
    backgroundColor: '#EBF5FF',
    borderColor: '#4A90E2',
  },
  catText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  catTextActive: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },

  // Style Card Sách (Giữ nguyên)
  card: {
    width: COLUMN_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden'
  },
  bookImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 10,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    height: 40,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginLeft: 4
  }
});

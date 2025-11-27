import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, ScrollView, 
  TouchableOpacity, Alert, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { supabase } from '../lib/supabaseClient';
export default function DetailsScreen({ route, navigation }) {
  const { book } = route.params; 
  const [adding, setAdding] = useState(false); 
  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert(
          "Yêu cầu đăng nhập", 
          "Bạn cần đăng nhập để thêm vào giỏ hàng",
          [
            { text: "Hủy", style: 'cancel' },
            { text: "Đăng nhập", onPress: () => navigation.navigate('Login') }
          ]
        );
        return;
      }

      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('book_id', book.id)
        .single(); // Chỉ lấy 1 dòng

      if (fetchError && fetchError.code !== 'PGRST116') { 
        throw fetchError;
      }

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            book_id: book.id,
            quantity: 1
          });
          
        if (error) throw error;
      }

      Alert.alert("Thành công", `Đã thêm "${book.title}" vào giỏ!`);

    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
    } finally {
      setAdding(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price);

  return (
    <View style={styles.container}>
      <Header title="Chi tiết sách" showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: book.imageUrl ? book.imageUrl : `https://source.unsplash.com/random/400x600?book&sig=${book.id}` }} 
            style={styles.image} 
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{book.category || "Chưa phân loại"}</Text>
          </View>
          
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>Tác giả: {book.author}</Text>
          
          <Text style={styles.price}>{formattedPrice}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Giới thiệu nội dung</Text>
          <Text style={styles.description}>
            {book.description || "Hiện chưa có mô tả cho cuốn sách này."}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {/* Nút Giỏ hàng: Bấm vào để đi tới màn hình Cart */}
        <TouchableOpacity 
          style={styles.cartIconBtn} 
          onPress={() => navigation.navigate('Cart')}
        >
           <Ionicons name="cart-outline" size={28} color="#4A90E2" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.buyButton} 
          onPress={handleAddToCart}
          disabled={adding} // Vô hiệu hóa nút khi đang loading
        >
          {adding ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buyButtonText}>Thêm vào giỏ hàng</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 100 },
  
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 180,
    height: 260,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  
  infoContainer: {
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20, 
    backgroundColor: '#fff',
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryText: { color: '#4A90E2', fontSize: 12, fontWeight: '600' },
  
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  author: { fontSize: 16, color: '#666', marginBottom: 15 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#e74c3c' },
  
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 15, color: '#555', lineHeight: 24 },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 30, 
  },
  cartIconBtn: {
    width: 50, height: 50,
    borderWidth: 1, borderColor: '#ddd',
    borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    height: 50,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import { useFocusEffect } from '@react-navigation/native';

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  const fetchCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false); return;
      }
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, books(*)')
        .eq('user_id', user.id);

      if (error) throw error;
      
      setCartItems(data);
      calculateTotal(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (item.books.price * item.quantity), 0);
    setTotal(sum);
  };

  const handleDelete = async (id) => {
    await supabase.from('cart_items').delete().eq('id', id);
    fetchCart(); // Reload lại
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    Alert.alert("Xác nhận", "Bạn muốn đặt hàng?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đặt hàng", onPress: async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            
            const { data: order, error: orderError } = await supabase
              .from('orders')
              .insert({ user_id: user.id, total_price: total, status: 'pending' })
              .select()
              .single();

            if (orderError) throw orderError;

            const orderItemsData = cartItems.map(item => ({
              order_id: order.id,
              book_id: item.book_id,
              quantity: item.quantity,
              price_at_purchase: item.books.price
            }));

            const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
            if (itemsError) throw itemsError;

            await supabase.from('cart_items').delete().eq('user_id', user.id);

            Alert.alert("Thành công", "Đơn hàng đã được tạo!");
            setCartItems([]);
            setTotal(0);
          } catch (e) {
            Alert.alert("Lỗi", e.message);
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.books.img || 'https://via.placeholder.com/100' }} style={styles.img} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.books.title}</Text>
        <Text style={styles.price}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.books.price)}</Text>
        <Text style={styles.qty}>Số lượng: {item.quantity}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Giỏ hàng" showBack={true} />
      {loading ? <ActivityIndicator style={{marginTop: 20}} /> : (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 15 }}
          ListEmptyComponent={<Text style={styles.emptyText}>Giỏ hàng trống</Text>}
        />
      )}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalPrice}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  itemContainer: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, marginBottom: 10, borderRadius: 8, alignItems: 'center' },
  img: { width: 60, height: 90, borderRadius: 4, marginRight: 10 },
  info: { flex: 1 },
  title: { fontWeight: 'bold', fontSize: 16 },
  price: { color: '#4A90E2', marginVertical: 5 },
  qty: { color: '#666' },
  footer: { padding: 20, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#ddd' },
  totalLabel: { fontSize: 14, color: '#666' },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: 'red' },
  checkoutBtn: { backgroundColor: '#4A90E2', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  checkoutText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});

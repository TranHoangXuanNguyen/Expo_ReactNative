import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

export default function MyOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      default: return '#666';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status === 'pending' ? 'Đang xử lý' : item.status.toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.divider} />
      
      <Text style={styles.date}>
        Ngày đặt: {new Date(item.created_at).toLocaleString('vi-VN')}
      </Text>
      
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Tổng tiền:</Text>
        <Text style={styles.totalPrice}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_price)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Đơn hàng của tôi" showBack={true} />
      
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#4A90E2" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: {
    backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  status: { fontWeight: 'bold', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  date: { color: '#888', fontSize: 13, marginBottom: 10 },
  totalLabel: { fontSize: 14, color: '#666' },
  totalPrice: { fontSize: 18, fontWeight: 'bold', color: '#e74c3c' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { marginTop: 10, color: '#888', fontSize: 16 }
});

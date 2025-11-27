import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/Header';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
    if (!error) setOrders(data);
  };

  const updateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    
    Alert.alert("Cập nhật trạng thái", `Đổi thành ${newStatus}?`, [
       { text: "Hủy" },
       { text: "Đồng ý", onPress: async () => {
           await supabase.from('orders').update({ status: newStatus }).eq('id', id);
           fetchOrders();
       }}
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="Quản lý Đơn hàng" showBack={true} />
      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
             <View style={styles.row}>
                <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
                <TouchableOpacity onPress={() => updateStatus(item.id, item.status)}>
                   <Text style={[styles.status, { color: item.status === 'completed' ? 'green' : 'orange' }]}>
                      {item.status.toUpperCase()}
                   </Text>
                </TouchableOpacity>
             </View>
             <Text>Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_price)}</Text>
             <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', margin: 10, padding: 15, borderRadius: 8, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  orderId: { fontWeight: 'bold', fontSize: 16 },
  status: { fontWeight: 'bold' },
  date: { color: '#888', fontSize: 12, marginTop: 5 }
});

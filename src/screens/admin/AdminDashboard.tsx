import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header'; // Đảm bảo đường dẫn đúng

export default function AdminDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Admin Dashboard" showBack={true} />
      
      <View style={styles.grid}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('AdminProducts')}
        >
          <Ionicons name="library" size={40} color="#4A90E2" />
          <Text style={styles.cardText}>Quản lý Sản phẩm</Text>
          <Text style={styles.subText}>Thêm, sửa, xóa sách</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('AdminOrders')}
        >
          <Ionicons name="receipt" size={40} color="#27ae60" />
          <Text style={styles.cardText}>Quản lý Đơn hàng</Text>
          <Text style={styles.subText}>Xem và duyệt đơn</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('AdminCategories')}
        >
          <Ionicons name="pricetags" size={40} color="#9b59b6" />
          <Text style={styles.cardText}>Quản lý Danh mục</Text>
          <Text style={styles.subText}>Phân loại sản phẩm</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('AdminUsers')}
        >
          <Ionicons name="people" size={40} color="#e67e22" /> 
          <Text style={styles.cardText}>Quản lý User</Text>
          <Text style={styles.subText}>Phân quyền, xem list</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  grid: { padding: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 15,
    alignItems: 'center', marginBottom: 15,
    shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity: 0.1, elevation: 3
  },
  cardText: { marginTop: 10, fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  subText: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 5 }
});

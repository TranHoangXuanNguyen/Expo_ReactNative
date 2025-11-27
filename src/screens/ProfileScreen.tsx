import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, 
  Modal, TextInput, ScrollView 
} from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho việc sửa thông tin
  const [modalVisible, setModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(data);
          // Điền dữ liệu cũ vào form
          setFullName(data.full_name || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    Alert.alert("Đã đăng xuất");
  };

  // --- HÀM CẬP NHẬT PROFILE ---
  const handleUpdateProfile = async () => {
    if (!user) return;
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          address: address,
          updated_at: new Date(),
        })
        .eq('id', user.id);

      if (error) throw error;

      Alert.alert("Thành công", "Cập nhật thông tin thành công!");
      setModalVisible(false);
      checkUser(); // Load lại dữ liệu mới
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login'); 
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="person-circle-outline" size={100} color="#ccc" />
          <Text style={styles.infoText}>Bạn chưa đăng nhập</Text>
          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerProfile}>
        <Ionicons name="person-circle" size={80} color="#4A90E2" />
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.role}>Role: {profile?.role || 'user'}</Text>
        
        {/* Hiển thị thông tin cơ bản */}
        {profile?.full_name && <Text style={styles.subInfo}>{profile.full_name}</Text>}
        {profile?.phone && <Text style={styles.subInfo}>{profile.phone}</Text>}
      </View>

      {/* MENU ITEM: SỬA THÔNG TIN (Chỉ hiện nếu KHÔNG PHẢI ADMIN) */}
      {profile?.role !== 'admin' && (
        <TouchableOpacity 
          style={[styles.menuItem, { borderLeftColor: '#4A90E2', borderLeftWidth: 5 }]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="create" size={24} color="#4A90E2" />
          <Text style={[styles.menuText, { color: '#4A90E2', fontWeight: 'bold' }]}>
            Sửa thông tin cá nhân
          </Text>
        </TouchableOpacity>
      )}

      {profile?.role === 'admin' && (
        <TouchableOpacity 
          style={[styles.menuItem, styles.adminItem]} 
          onPress={() => navigation.navigate('HomeTab', { screen: 'AdminDashboard' })}
        >
          <Ionicons name="shield-checkmark" size={24} color="#fff" />
          <Text style={[styles.menuText, {color: '#fff'}]}>Trang Quản Lý (Admin)</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate('MyOrders')}
      >
        <Ionicons name="list" size={24} color="#333" />
        <Text style={styles.menuText}>Đơn hàng của tôi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuItem, { marginTop: 20 }]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="red" />
        <Text style={[styles.menuText, { color: 'red' }]}>Đăng xuất</Text>
      </TouchableOpacity>

      {/* --- MODAL SỬA THÔNG TIN --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật thông tin</Text>
            
            <Text style={styles.label}>Họ và tên:</Text>
            <TextInput 
              style={styles.input} 
              value={fullName} 
              onChangeText={setFullName} 
              placeholder="Nhập họ tên"
            />

            <Text style={styles.label}>Số điện thoại:</Text>
            <TextInput 
              style={styles.input} 
              value={phone} 
              onChangeText={setPhone} 
              keyboardType="phone-pad"
              placeholder="Nhập số điện thoại"
            />

            <Text style={styles.label}>Địa chỉ:</Text>
            <TextInput 
              style={styles.input} 
              value={address} 
              onChangeText={setAddress} 
              placeholder="Nhập địa chỉ giao hàng"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelBtn]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, styles.saveBtn]} 
                onPress={handleUpdateProfile}
                disabled={updating}
              >
                {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Lưu</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerProfile: { alignItems: 'center', marginBottom: 30 },
  email: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  role: { fontSize: 14, color: 'gray' },
  subInfo: { fontSize: 14, color: '#555', marginTop: 2 },
  infoText: { marginVertical: 10, color: '#666' },
  btn: { backgroundColor: '#4A90E2', padding: 10, borderRadius: 8, width: 200, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 15, borderRadius: 10, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  menuText: { marginLeft: 15, fontSize: 16, fontWeight: '500' },
  
  adminItem: { backgroundColor: '#2c3e50' },

  // Styles cho Modal
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 5
  },
  modalTitle: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#4A90E2'
  },
  label: { fontWeight: '600', marginBottom: 5, color: '#333' },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 15, backgroundColor: '#f5f5f5'
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  cancelBtn: { backgroundColor: '#999' },
  saveBtn: { backgroundColor: '#4A90E2' }
});

import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  ActivityIndicator, Alert, Modal, TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabaseClient';
import Header from '../../components/Header';

export default function AdminUserScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(''); 
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false }); 

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách người dùng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || 'user');
    setModalVisible(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', selectedUser.id);

      if (error) throw error;

      Alert.alert("Thành công", `Đã cập nhật quyền cho ${selectedUser.full_name || 'User'}`);
      setModalVisible(false);
      fetchUsers();  
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật quyền.");
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color="#fff" />
        </View>
        <View>
          <Text style={styles.name}>{item.full_name || 'Chưa đặt tên'}</Text>
          <Text style={styles.subText}>ID: {item.id.substring(0, 8)}...</Text>
          <Text style={styles.subText}>{item.phone || 'Không có SĐT'}</Text>
          <Text style={styles.subText}>{item.address}</Text>
          <Text style={styles.subText}>{item.full_name}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {/* Badge hiển thị Role */}
        <View style={[styles.badge, item.role === 'admin' ? styles.badgeAdmin : styles.badgeUser]}>
          <Text style={styles.badgeText}>{item.role || 'user'}</Text>
        </View>

        {/* Nút sửa */}
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editBtn}>
          <Ionicons name="create-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Quản lý Users" showBack={true} />

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa có người dùng nào.</Text>}
        />
      )}

      {/* --- MODAL SỬA ROLE --- */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Phân quyền User</Text>
            <Text style={{marginBottom: 15, color: '#666'}}>
              Đang sửa: <Text style={{fontWeight: 'bold'}}>{selectedUser?.full_name}</Text>
            </Text>

            <View style={styles.roleOptions}>
              {/* Nút chọn User */}
              <TouchableOpacity 
                style={[styles.roleBtn, selectedRole === 'user' && styles.roleBtnActive]}
                onPress={() => setSelectedRole('user')}
              >
                <Ionicons name="person" size={20} color={selectedRole === 'user' ? '#fff' : '#333'} />
                <Text style={[styles.roleText, selectedRole === 'user' && {color: '#fff'}]}>User</Text>
              </TouchableOpacity>

              {/* Nút chọn Admin */}
              <TouchableOpacity 
                style={[styles.roleBtn, selectedRole === 'admin' && styles.roleBtnActive]}
                onPress={() => setSelectedRole('admin')}
              >
                <Ionicons name="shield-checkmark" size={20} color={selectedRole === 'admin' ? '#fff' : '#333'} />
                <Text style={[styles.roleText, selectedRole === 'admin' && {color: '#fff'}]}>Admin</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setModalVisible(false)}>
                <Text style={{color: '#333'}}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleUpdateRole}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Lưu thay đổi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  card: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarContainer: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#bdc3c7',
    justifyContent: 'center', alignItems: 'center', marginRight: 12
  },
  name: { fontWeight: 'bold', fontSize: 16, color: '#2c3e50' },
  subText: { fontSize: 12, color: '#7f8c8d' },
  
  actions: { alignItems: 'flex-end' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginBottom: 5 },
  badgeUser: { backgroundColor: '#ecf0f1' },
  badgeAdmin: { backgroundColor: '#fad390' },
  badgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', color: '#2d3436' },
  editBtn: { padding: 5 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 15, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#4A90E2' },
  
  roleOptions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  roleBtn: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginHorizontal: 5 
  },
  roleBtnActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  roleText: { marginLeft: 5, fontWeight: '600' },

  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  btn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginLeft: 10 },
  btnCancel: { backgroundColor: '#ecf0f1' },
  btnSave: { backgroundColor: '#27ae60' }
});

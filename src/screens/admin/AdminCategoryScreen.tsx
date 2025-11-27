import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, StyleSheet, TouchableOpacity, 
  TextInput, Alert, Modal, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryRepository, Category } from '../../database/repositories/CategoryRepository'; 
import Header from '../../components/Header';

export default function AdminCategoryScreen({ navigation }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State cho Modal Thêm/Sửa
  const [modalVisible, setModalVisible] = useState(false);
  const [catName, setCatName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null); 

  // Load dữ liệu
  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await CategoryRepository.getAll();
      setCategories(data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async () => {
    if (!catName.trim()) {
      Alert.alert("Thông báo", "Tên danh mục không được để trống");
      return;
    }

    try {
      if (editingId) {
        // Cập nhật
        await CategoryRepository.update(editingId, catName);
        Alert.alert("Thành công", "Đã cập nhật danh mục");
      } else {
        // Thêm mới
        await CategoryRepository.create(catName);
        Alert.alert("Thành công", "Đã thêm danh mục mới");
      }
      setModalVisible(false);
      setCatName('');
      setEditingId(null);
      loadCategories(); // Reload list
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi lưu");
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc muốn xóa danh mục này? (Lưu ý: Các sản phẩm thuộc danh mục này có thể bị ảnh hưởng)",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          style: "destructive", 
          onPress: async () => {
            try {
              await CategoryRepository.delete(id);
              loadCategories();
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa danh mục");
            }
          }
        }
      ]
    );
  };

  const openEditModal = (item: Category) => {
    setCatName(item.name);
    setEditingId(item.id);
    setModalVisible(true);
  };

  const openAddModal = () => {
    setCatName('');
    setEditingId(null);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Category }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.iconBtn}>
          <Ionicons name="pencil" size={20} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconBtn}>
          <Ionicons name="trash" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Quản lý Danh mục" showBack={true} />
      
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{marginTop: 20}} />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa có danh mục nào</Text>}
        />
      )}

      {/* Nút FAB để thêm mới */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal Thêm/Sửa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editingId ? "Cập nhật Danh mục" : "Thêm Danh mục Mới"}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nhập tên danh mục..."
              value={catName}
              onChangeText={setCatName}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.btn, styles.btnCancel]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Hủy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.btn, styles.btnSave]} 
                onPress={handleSave}
              >
                <Text style={[styles.btnText, {color: '#fff'}]}>Lưu</Text>
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
  itemContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10,
    elevation: 2, shadowColor: '#000', shadowOffset: {width:0, height:1}, shadowOpacity: 0.1
  },
  itemText: { fontSize: 16, fontWeight: '500' },
  actionButtons: { flexDirection: 'row' },
  iconBtn: { marginLeft: 15 },
  fab: {
    position: 'absolute', bottom: 30, right: 30,
    backgroundColor: '#9b59b6', width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', elevation: 5
  },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
  
  // Modal Styles
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 15, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  btn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
  btnCancel: { backgroundColor: '#eee' },
  btnSave: { backgroundColor: '#9b59b6' },
  btnText: { fontWeight: 'bold' }
});

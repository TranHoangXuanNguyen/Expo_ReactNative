import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, Modal, 
  TextInput, StyleSheet, Alert, Image, ScrollView, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabaseClient'; 
import Header from '../../components/Header';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export default function AdminProducts({ route, navigation }) {
  // ... (Giữ nguyên các state cũ: books, categories, modalVisible, etc.)
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState(''); 
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { 
    fetchBooks(); 
    fetchCategories(); 
  }, []);

  useEffect(() => {
    if (route.params?.categoryId) {
      resetForm();
      setSelectedCatId(route.params.categoryId);
      setModalVisible(true);
      navigation.setParams({ categoryId: null });
    }
  }, [route.params]);

  const fetchBooks = async () => {
    const { data } = await supabase.from('books').select('*, categories(name)').order('id', { ascending: false });
    setBooks(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  };

  // ... (Giữ nguyên pickImage, uploadToSupabase) ...
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 3],
        quality: 1,
      });
      if (!result.canceled) await uploadToSupabase(result.assets[0].uri);
    } catch (error) { Alert.alert("Lỗi", "Không thể mở thư viện ảnh"); }
  };

  const uploadToSupabase = async (uri) => {
    setUploading(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
      const fileName = `${Date.now()}.jpg`;
      const { data, error } = await supabase.storage.from('book-images').upload(fileName, decode(base64), { contentType: 'image/jpeg' });
      if (error) throw error;
      const { data: publicData } = supabase.storage.from('book-images').getPublicUrl(fileName);
      setImg(publicData.publicUrl);
    } catch (error) { Alert.alert("Lỗi Upload", "Không thể tải ảnh lên."); } finally { setUploading(false); }
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa sách "${item.title}" không?`,
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          style: "destructive", 
          onPress: async () => {
            try {
              const { error } = await supabase.from('books').delete().eq('id', item.id);
              if (error) {
                 Alert.alert("Lỗi", "Không thể xóa sách này.");
              } else {
                 Alert.alert("Thành công", "Đã xóa sách.");
                 fetchBooks(); // Load lại danh sách
              }
            } catch (err) {
              console.log(err);
            }
          } 
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!title || !price || !selectedCatId) {
      Alert.alert("Lỗi", "Vui lòng nhập tên, giá và chọn danh mục!");
      return;
    }
    const payload = { title, author, price: parseFloat(price), img, category_id: selectedCatId, description };
    
    let error;
    if (editingBook) {
      const res = await supabase.from('books').update(payload).eq('id', editingBook.id);
      error = res.error;
    } else {
      const res = await supabase.from('books').insert(payload);
      error = res.error;
    }
    
    if (error) Alert.alert("Lỗi", "Có lỗi xảy ra");
    else {
        // Alert.alert("Thành công", editingBook ? "Đã cập nhật" : "Đã thêm mới"); // Có thể bỏ alert này cho nhanh
        setModalVisible(false);
        fetchBooks();
        resetForm();
    }
  };

  const openEdit = (book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setPrice(book.price.toString());
    setImg(book.img || '');
    setSelectedCatId(book.category_id);
    setDescription(book.description || '');
    setModalVisible(true);
  };

  const resetForm = () => {
    setEditingBook(null); setTitle(''); setAuthor(''); setPrice(''); setImg(''); setSelectedCatId(null); setDescription('');
  };

  // --- RENDER ITEM (CẬP NHẬT GIAO DIỆN) ---
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {/* Phần hiển thị thông tin - Click vào để Sửa */}
      <TouchableOpacity style={styles.itemInfo} onPress={() => openEdit(item)}>
         <Image source={{uri: item.img || 'https://via.placeholder.com/150'}} style={styles.listImg} />
         <View style={{flex: 1}}>
            <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={{fontSize: 12, color: '#666'}}>
                {item.categories?.name} - {new Intl.NumberFormat('vi-VN').format(item.price)} đ
            </Text>
         </View>
      </TouchableOpacity>
      
      {/* Các nút hành động */}
      <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => openEdit(item)} style={styles.iconBtn}>
             <Ionicons name="create-outline" size={24} color="#4A90E2" />
          </TouchableOpacity>
          
          {/* Nút Xóa Mới Thêm */}
          <TouchableOpacity 
             onPress={() => handleDelete(item)} 
             style={[styles.iconBtn, {marginLeft: 15}]}
             // hitSlop giúp mở rộng vùng bấm ra xung quanh 10px mỗi chiều
             hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} 
          >
             <Ionicons name="trash-outline" size={24} color="#e74c3c" />
          </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Quản lý Sách" showBack={true} />
      
      <TouchableOpacity style={styles.addBtn} onPress={() => { resetForm(); setModalVisible(true); }}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.addBtnText}>Thêm Sách Mới</Text>
      </TouchableOpacity>

      <FlatList
        data={books}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem} // Gọi renderItem đã tách ra ở trên
      />

      {/* --- MODAL (Giữ nguyên không thay đổi) --- */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
                {editingBook ? "Sửa Sách" : (selectedCatId && !editingBook ? "Thêm Sách (Theo danh mục)" : "Thêm Sách Mới")}
            </Text>
            
            <Text style={styles.label}>Hình ảnh sách:</Text>
            <View style={styles.imageUploadContainer}>
              {img ? (
                <Image source={{ uri: img }} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="image-outline" size={40} color="#ccc" />
                  <Text style={{color: '#999'}}>Chưa có ảnh</Text>
                </View>
              )}
              <TouchableOpacity style={styles.uploadBtn} onPress={pickImage} disabled={uploading}>
                {uploading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                    <Text style={styles.uploadText}>Chọn & Tải ảnh lên</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Tên sách:</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />
            <Text style={styles.label}>Tác giả:</Text>
            <TextInput style={styles.input} value={author} onChangeText={setAuthor} />
            <Text style={styles.label}>Giá (VNĐ):</Text>
            <TextInput style={styles.input} value={price} keyboardType="numeric" onChangeText={setPrice} />
            <Text style={styles.label}>Mô tả sách:</Text>
            <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline={true} numberOfLines={4} textAlignVertical="top" />
            
            <Text style={styles.label}>Danh mục:</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity key={cat.id} style={[styles.catChip, selectedCatId === cat.id && styles.catChipSelected]} onPress={() => setSelectedCatId(cat.id)}>
                  <Text style={[styles.catText, selectedCatId === cat.id && styles.catTextSelected]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>LƯU SÁCH</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={{color: 'red'}}>HỦY BỎ</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  addBtn: { flexDirection: 'row', backgroundColor: '#27ae60', padding: 15, margin: 15, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  
  // --- Style mới cho Item ---
  itemContainer: { 
      flexDirection: 'row', 
      padding: 15, 
      borderBottomWidth: 1, 
      borderColor: '#eee', 
      alignItems: 'center',
      justifyContent: 'space-between' 
  },
  itemInfo: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      marginRight: 10
  },
  actionButtons: {
      flexDirection: 'row',
      alignItems: 'center'
  },
  iconBtn: {
      padding: 5 // Tăng diện tích bấm
  },
  // --------------------------

  listImg: { width: 40, height: 60, marginRight: 10, borderRadius: 4, backgroundColor: '#eee' },
  itemTitle: { fontWeight: 'bold', fontSize: 16 },
  
  // Modal styles (Giữ nguyên)
  modalContainer: { flex: 1, backgroundColor: '#f9f9f9' },
  modalContent: { padding: 20, paddingBottom: 50 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#555', marginTop: 10 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  imageUploadContainer: { alignItems: 'center', marginBottom: 15 },
  previewImage: { width: 120, height: 180, borderRadius: 8, marginBottom: 10 },
  placeholderImage: { width: 120, height: 180, borderRadius: 8, backgroundColor: '#e1e1e1', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  uploadBtn: { flexDirection: 'row', backgroundColor: '#8e44ad', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
  uploadText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
  catChip: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#eee', borderRadius: 20, marginRight: 8, marginBottom: 8 },
  catChipSelected: { backgroundColor: '#4A90E2' },
  catText: { color: '#333', fontSize: 12 },
  catTextSelected: { color: '#fff', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  cancelBtn: { padding: 15, alignItems: 'center', marginTop: 10 },
  textArea: {height: 100, textAlignVertical: 'top', paddingTop: 10,},
  itemContainer: { 
      flexDirection: 'row', 
      padding: 15, 
      borderBottomWidth: 1, 
      borderColor: '#eee', 
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#fff' // Thêm màu nền để tránh click xuyên thấu
  },
  itemInfo: {
      flexDirection: 'row',
      flex: 1, // Chiếm hết phần còn lại
      alignItems: 'center',
      marginRight: 10, // Cách nút bấm ra một chút
  },
  actionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 10, // Đảm bảo nút nằm đè lên trên các layer khác
      elevation: 10 // (Cho Android)
  },
  iconBtn: {
      padding: 8, // Tăng padding lên để dễ bấm hơn (cũ là 5)
  },
});

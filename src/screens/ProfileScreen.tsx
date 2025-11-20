import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabaseClient'; import { CommonActions } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Lấy thông tin user
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setEmail(data.user.email);
    });
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Lỗi", error.message);
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }], // Hoặc 'AuthStack' tùy cấu hình
        })
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin tài khoản</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email || "Đang tải..."}</Text>
      </View>

      <View style={{ marginTop: 20, width: '100%' }}>
        <Button title="Đăng xuất" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#F5F7FA' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, marginTop: 20 },
  card: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  label: { color: '#666', marginBottom: 5 },
  value: { fontSize: 18, fontWeight: '500' }
});

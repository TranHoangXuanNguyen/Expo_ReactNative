// src/screens/Auth/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { AuthRepository } from '../../database/repositories/AuthRepository';


export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password || !fullName) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    
    const { error } = await AuthRepository.register(email, password, fullName);

    setLoading(false);

    if (error) {
      Alert.alert('Đăng ký thất bại', error.message);
    } else {
      Alert.alert(
        'Thành công', 
        'Vui lòng kiểm tra email để xác nhận tài khoản trước khi đăng nhập!',
        [{ text: 'OK', onPress: () => navigation.goBack() }] // Quay về Login
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo tài khoản mới</Text>
      
      <TextInput
        placeholder="Họ và tên"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Đăng ký" onPress={handleRegister} />
      )}
      
      <View style={{ marginTop: 10 }}>
        <Button title="Đã có tài khoản? Đăng nhập" onPress={() => navigation.navigate('Login')} color="gray"/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8 },
});

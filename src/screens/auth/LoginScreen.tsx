// src/screens/Auth/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { AuthRepository } from '../../database/repositories/AuthRepository';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    setLoading(true);

    const { error } = await AuthRepository.login(email, password);
    
    setLoading(false);

    if (error) {
      Alert.alert('Đăng nhập thất bại', error.message);
    } else {
     navigation.replace('MainTabs');
    }
  }  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

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
        <Button title="Đăng nhập" onPress={handleLogin} />
      )}

      <View style={{ marginTop: 15 }}>
         <Button 
           title="Chưa có tài khoản? Đăng ký ngay" 
           onPress={() => navigation.navigate('Register')} 
           color="gray"
         />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8 },
});

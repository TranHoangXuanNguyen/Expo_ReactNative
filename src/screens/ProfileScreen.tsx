import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
        
        if (data) setProfile(data);
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
      </View>

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
        onPress={() => navigation.navigate('MyOrders')}       >
        <Ionicons name="list" size={24} color="#333" />
        <Text style={styles.menuText}>Đơn hàng của tôi</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuItem, { marginTop: 20 }]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="red" />
        <Text style={[styles.menuText, { color: 'red' }]}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerProfile: { alignItems: 'center', marginBottom: 30 },
  email: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  role: { fontSize: 14, color: 'gray' },
  infoText: { marginVertical: 10, color: '#666' },
  btn: { backgroundColor: '#4A90E2', padding: 10, borderRadius: 8, width: 200, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 15, borderRadius: 10, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  menuText: { marginLeft: 15, fontSize: 16, fontWeight: '500' },
  
  adminItem: { backgroundColor: '#2c3e50' }
});

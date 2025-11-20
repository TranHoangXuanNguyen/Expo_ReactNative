import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabaseClient'; 
export default function Header({ title = "App Name", showBack = false }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Lấy user hiện tại khi component mount
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // 2. Lắng nghe sự thay đổi (khi user login hoặc logout ở nơi khác)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleUserPress = () => {
    if (user) {
      navigation.navigate('Profile'); 
    } else {
      navigation.navigate('Login'); 
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.contentContainer}>
        
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ) : (
             <Ionicons name="leaf" size={24} color="#4A90E2" />
          )}
        </View>

        {/* Vùng Giữa: Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>

        {/* Vùng Phải: User Avatar hoặc Login Button */}
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={handleUserPress} style={styles.userButton}>
            {user ? (
              <View style={styles.avatarContainer}>
                 {/* Nếu user có ảnh avatar thì dùng Image, không thì dùng Icon */}
                 <Ionicons name="person-circle" size={34} color="#4A90E2" />
              </View>
            ) : (
              <View style={styles.loginButton}>
                <Text style={styles.loginText}>Login</Text>
                <Ionicons name="log-in-outline" size={20} color="#666" />
              </View>
            )}
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 100,
  },
  contentContainer: {
    height: 56, // Tăng chiều cao một chút cho thoáng
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 60,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 60,
    alignItems: 'flex-end',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  // Style cho trạng thái Đã đăng nhập
  avatarContainer: {
    // Có thể thêm viền hoặc background nếu thích
  },
  // Style cho trạng thái Chưa đăng nhập
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  loginText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
    color: '#666'
  },
  iconButton: {
    padding: 5,
  }
});

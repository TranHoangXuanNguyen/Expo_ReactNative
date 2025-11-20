// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Thêm icon cho sinh động
import Header from '../components/Header';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Trang Chủ" showBack={false} showLogout={true} />

      <View style={styles.contentContainer}>
        
        <View style={styles.welcomeSection}>
          <Ionicons name="home-outline" size={80} color="#4A90E2" />
          <Text style={styles.titleText}>Xin chào!</Text>
          <Text style={styles.subtitleText}>Đây là màn hình chính (Tab 1)</Text>
        </View>

        <TouchableOpacity 
          style={styles.customButton}
          onPress={() => navigation.navigate('Details')}
          activeOpacity={0.8} // Hiệu ứng mờ khi nhấn
        >
          <Text style={styles.buttonText}>Đi tới Details</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={{marginLeft: 8}}/>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F7FA', 
  },

  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },

  customButton: {
    flexDirection: 'row', // Để icon và text nằm ngang
    backgroundColor: '#4A90E2', // Màu xanh hiện đại
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25, // Bo tròn nút
    alignItems: 'center',
    justifyContent: 'center',
    // Đổ bóng cho nút (Shadow)
    shadowColor: "#4A90E2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // Shadow cho Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

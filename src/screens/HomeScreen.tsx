import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Tạo màu gradient cho đẹp
import Header from '../components/Header';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <Header title="BookStore VIP" showBack={false} showLogout={true} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} 
            style={styles.bannerImage} 
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Khám phá tri thức</Text>
            <Text style={styles.bannerSubtitle}>Hàng nghìn cuốn sách đang chờ bạn</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Chức năng chính</Text>
        
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            activeOpacity={0.9}
            onPress={() => handleNavigate('Shop')} 
          >
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{x: 0, y: 0}} end={{x: 1, y: 1}}
              style={styles.gradientBox}
            >
              <Ionicons name="library" size={40} color="#fff" />
              <Text style={styles.menuText}>Kho Sách</Text>
              <Text style={styles.menuSubText}>Xem tất cả</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            activeOpacity={0.9}
            onPress={() => handleNavigate('Categories')}           >
            <LinearGradient
              colors={['#fa709a', '#fee140']}
              start={{x: 0, y: 0}} end={{x: 1, y: 1}}
              style={styles.gradientBox}
            >
              <Ionicons name="grid" size={40} color="#fff" />
              <Text style={styles.menuText}>Danh mục</Text>
              <Text style={styles.menuSubText}>Phân loại</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Gợi ý hôm nay</Text>
        <View style={styles.promoContainer}>
          <View style={styles.promoCard}>
            <View style={styles.promoIcon}>
               <Ionicons name="star" size={24} color="#FFD700" />
            </View>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Sách bán chạy nhất</Text>
              <Text style={styles.promoDesc}>Giảm giá 20% cho thành viên mới</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',  },
  scrollContent: {
    paddingBottom: 30,
  },
  
  // --- BANNER STYLES ---
  bannerContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#eee',
    marginTop: 4,
  },

  // --- SECTION TITLE ---
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
    marginBottom: 15,
  },

  // --- MENU GRID STYLES ---
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  menuItem: {
    width: (width - 55) / 2,  
    height: 160,
    borderRadius: 20,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientBox: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  menuSubText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },

  promoContainer: {
    paddingHorizontal: 20,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  promoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF9C4',  
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  promoDesc: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});

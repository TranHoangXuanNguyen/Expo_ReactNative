import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ProductItem from "../comonents/proItem";

const products = [
  {
    id: 1,
    name: "Tai nghe Bluetooth",
    price: 499000,
    image: "https://picsum.photos/201",
    description: "Chất lượng tốt",
  },
  {
    id: 2,
    name: "Chuột không dây",
    price: 299000,
    image: "https://picsum.photos/201",
    description: "Nhạy và bền",
  },
  {
    id: 3,
    name: "Bàn phím cơ",
    price: 899000,
    image: "https://picsum.photos/201",
    description: "Cảm giác gõ tuyệt vời",
  },
  {
    id: 4,
    name: "Sạc nhanh 201",
    price: 199000,
    image: "https://picsum.photos/201",
    description: "Sạc nhanh chóng",
  },
  {
    id: 5,
    name: "Loa Bluetooth",
    price: 599000,
    image: "https://picsum.photos/201",
    description: "Âm thanh sống động",
  },
  {
    id: 6,
    name: "Ổ cứng SSD",
    price: 1099000,
    image: "https://picsum.photos/201",
    description: "Tốc độ cực nhanh",
  },
];

export default function ProductList() {
  const handlePress = (product) => {
    console.log("Xem chi tiết sản phẩm:", product);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem product={item} onPress={handlePress} />
        )}
        numColumns={3} // ✅ hiển thị 3 cột
        columnWrapperStyle={styles.row} // căn giữa và khoảng cách giữa các cột
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: "#f2f2f2",
    flex: 1,
  },
  row: {
    justifyContent: "space-between", // căn đều 3 cột
  },
});

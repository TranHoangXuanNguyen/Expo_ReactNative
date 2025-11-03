import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ProductItem from "../comonents/proItem";

const products = [
  {
    id: 1,
    name: "Tai nghe Bluetooth",
    price: 499000,
    image: require("../assets/images/icon.png"),
    description: "Chất lượng tốt",
  },
  {
    id: 2,
    name: "Chuột không dây",
    price: 299000,
    image: require("../assets/images/icon.png"),
    description: "Nhạy và bền",
  },
  {
    id: 3,
    name: "Bàn phím cơ",
    price: 899000,
    image: require("../assets/images/icon.png"),
    description: "Cảm giác gõ tuyệt vời",
  },
  {
    id: 4,
    name: "Sạc nhanh 202",
    price: 199000,
    image: require("../assets/images/icon.png"),
    description: "Sạc nhanh chóng",
  },
  {
    id: 5,
    name: "Loa Bluetooth",
    price: 599000,
    image: require("../assets/images/icon.png"),
    description: "Âm thanh sống động",
  },
  {
    id: 6,
    name: "Ổ cứng SSD",
    price: 1099000,
    image: require("../assets/images/icon.png"),
    description: "Tốc độ cực nhanh",
  },
];

export default function ProductList() {
  const navigation = useNavigation();

  const handlePress = (product) => {
    navigation.navigate("DetailView", { product });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {products.map((item) => (
          <ProductItem key={item.id} product={item} onPress={handlePress} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8, backgroundColor: "#f2f2f2" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

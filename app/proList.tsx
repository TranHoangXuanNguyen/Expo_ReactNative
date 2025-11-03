import React from "react";
import { ScrollView, Text, View, Image, StyleSheet, Dimensions } from "react-native";

const ProductList = () => {
  const apiUrl = "https://fakestoreapi.com/products/";
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((json) => setProducts(json));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛍 Product List</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {products.map((product: any) => (
          <View key={product.id} style={styles.card}>
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.name} numberOfLines={2}>
              {product.title}
            </Text>
            <Text style={styles.price}>${product.price}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 72) / 2; // 2 cột, có padding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111827",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10b981",
    marginTop: 6,
  },
});

export default ProductList;

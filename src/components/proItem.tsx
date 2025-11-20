import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 8 * 4) / 3;

const ProductItem = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.price}>{product.price.toLocaleString()} đ</Text>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    width: itemWidth,
    marginBottom: 12,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 4,
  },
  price: {
    color: "#E53935",
    fontWeight: "bold",
    fontSize: 13,
  },
});

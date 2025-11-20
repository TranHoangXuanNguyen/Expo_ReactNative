import React from "react";
import { Image, Text, View } from "react-native";
//hello
const DetailView = ({ route }) => {
  const { product } = route.params;
  return (
    <View>
      <Text>{product.name}</Text>
      <Image
        source={{ uri: product.image }}
        style={{ width: 200, height: 200 }}
      />
      <Text>{product.description}</Text>
      <Text>{product.price.toLocaleString()} đ</Text>
    </View>
  );
};

export default DetailView;

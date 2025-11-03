import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Calculator from "./caculator";

const Layout = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
          My Awesome Calculator
        </Text>
      </View>

      <View style={styles.body}>
        <Calculator />
      </View>

      <View style={styles.footer}>
        <Text style={{ color: "white" }}>© 2024 MyAwesomeApp</Text>
      </View>
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "space-between",
  },
  header: {
    height: 80,
    backgroundColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000", // iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footer: {
    height: 60,
    backgroundColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

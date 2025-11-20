
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ContactItem = ({ contact, onEdit, onDelete }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.phone}>{contact.phone}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(contact)}>
          <Ionicons name="pencil" size={20} color="#f39c12" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(contact)} style={{ marginLeft: 10 }}>
          <Ionicons name="trash" size={20} color="#3498db" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#e74c3c",
  },
  phone: {
    fontSize: 14,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ContactItem;

import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ColorfulTable = () => {
  const [rows, setRows] = useState("");
  const [cols, setCols] = useState("");
  const [table, setTable] = useState<{ row: number; col: number }[]>([]);

  const generateTable = () => {
    const r = parseInt(rows);
    const c = parseInt(cols);
    if (!r || !c) return;
    const data = [];
    for (let i = 1; i <= r; i++) {
      for (let j = 1; j <= c; j++) {
        data.push({ row: i, col: j });
      }
    }
    setTable(data);
  };

  const getCellColor = (i: number, j: number) => {
    // Tạo màu ngẫu nhiên dựa trên vị trí
    const colors = [
      "#FFCDD2",
      "#BBDEFB",
      "#C8E6C9",
      "#FFF9C4",
      "#D1C4E9",
      "#FFE0B2",
      "#B2DFDB",
    ];
    return colors[(i + j) % colors.length];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dynamic Table Generator</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Rows"
          value={rows}
          onChangeText={setRows}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Columns"
          value={cols}
          onChangeText={setCols}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={generateTable}>
          <Text style={styles.buttonText}>Generate</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal>
        <View style={styles.table}>
          {Array.from({ length: parseInt(rows) || 0 }, (_, i) => (
            <View key={i} style={styles.row}>
              {Array.from({ length: parseInt(cols) || 0 }, (_, j) => (
                <View
                  key={j}
                  style={[styles.cell, { backgroundColor: getCellColor(i, j) }]}
                >
                  <Text style={styles.cellText}>{`${i + 1} x ${j + 1}`}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ColorfulTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    width: 80,
    marginHorizontal: 5,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  table: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: 80,
    height: 50,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  cellText: {
    fontWeight: "600",
  },
});

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
} from "react-native";

export default function Calculator() {
 const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [operator, setOperator] = useState("+");
  const [result, setResult] = useState<number | null>(null);
  const input2Ref = useRef(null);

  const handleCalculate = () => {
    const a = parseFloat(num1);
    const b = parseFloat(num2);

    if (isNaN(a) || isNaN(b)) {
      Alert.alert("Lỗi", "Vui lòng nhập hai số hợp lệ!");
      return;
    }

    if (operator === "/" && b === 0) {
      Alert.alert("Lỗi", "Không thể chia cho 0!");
      return;
    }

    let res;
    switch (operator) {
      case "+":
        res = a + b;
        break;
      case "-":
        res = a - b;
        break;
      case "*":
        res = a * b;
        break;
      case "/":
        res = a / b;
        break;
    }
    setResult(res);
    Keyboard.dismiss();
  };

  const operators = [
    { label: "Cộng (+)", value: "+" },
    { label: "Trừ (-)", value: "-" },
    { label: "Nhân (×)", value: "*" },
    { label: "Chia (÷)", value: "/" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧮 Ứng dụng tính toán đơn giản</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập số thứ nhất"
        keyboardType="numeric"
        value={num1}
        onChangeText={setNum1}
        returnKeyType="next"
        onSubmitEditing={() => input2Ref.current.focus()}
      />

      <TextInput
        ref={input2Ref}
        style={styles.input}
        placeholder="Nhập số thứ hai"
        keyboardType="numeric"
        value={num2}
        onChangeText={setNum2}
        returnKeyType="done"
        onSubmitEditing={handleCalculate}
      />

      <Text style={styles.label}>Chọn phép toán:</Text>

      {operators.map((op) => (
        <TouchableOpacity
          key={op.value}
          style={styles.radioContainer}
          onPress={() => setOperator(op.value)}
        >
          <View
            style={[
              styles.radioCircle,
              operator === op.value && styles.radioSelected,
            ]}
          />
          <Text style={styles.radioText}>{op.label}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleCalculate}>
        <Text style={styles.buttonText}>Tính toán</Text>
      </TouchableOpacity>

      {result !== null && <Text style={styles.result}>Kết quả: {result}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f6fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#333",
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: "#3498db",
  },
  radioText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#27ae60",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  result: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
});
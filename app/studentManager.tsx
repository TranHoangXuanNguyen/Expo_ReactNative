
import React, { useState } from "react";
import Student from "../dataType/Student"
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";


export default function StudentManager() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Nguyễn Văn A", age: 18, score: 9 },
    { id: 2, name: "Trần Thị B", age: 17, score: 7.5 },
    { id: 3, name: "Lê Văn C", age: 19, score: 8.5 },
    {id: 4, name:"Tran Hoang Xuan", age : 19, score: 8} 
  ]);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [score, setScore] = useState("");

  // 🧩 Thêm học sinh
  const addStudent = () => {
    if (!name || !age || !score) return;
    const newStudent: Student = {
      id: Date.now(),
      name,
      age: Number(age),
      score: Number(score),
    };
    setStudents((prev) => [...prev, newStudent]);
    setName("");
    setAge("");
    setScore("");
  };

  // ✏️ Sửa thông tin học sinh (tăng điểm)
  const editStudent = (id: number) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, score: s.score + 0.5 } : s
      )
    );
  };

  // ❌ Xóa học sinh
  const deleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // 🔍 Lọc học sinh có điểm > 8
  const highScoreStudents = students.filter((s) => s.score > 8);

  // 📊 Sắp xếp theo điểm giảm dần
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Quản lý Học sinh</Text>

      {/* Form thêm học sinh */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Tên"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Tuổi"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          style={styles.input}
        />
        <TextInput
          placeholder="Điểm"
          keyboardType="numeric"
          value={score}
          onChangeText={setScore}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addStudent}>
          <Text style={styles.btnText}>➕ Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách học sinh */}
      <FlatList
        data={sortedStudents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>
              {item.name} ({item.age}t) - Điểm: {item.score}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editStudent(item.id)}>
                <Text style={styles.edit}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteStudent(item.id)}>
                <Text style={styles.delete}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={styles.summary}>
        🧮 Có {highScoreStudents.length} học sinh có điểm > 8
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f4f4f4" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  inputContainer: { marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    backgroundColor: "#fff",
  },
  addBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },
  name: { fontSize: 16 },
  actions: { flexDirection: "row", gap: 10 },
  edit: { color: "blue", fontSize: 18 },
  delete: { color: "red", fontSize: 18 },
  summary: { textAlign: "center", marginTop: 10, fontWeight: "600" },
});

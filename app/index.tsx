import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DetailView from "../comonents/detailView";
import ProductList from "./proListPro";
import StudentManager from "./studentManager"; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <StudentManager/>
  );
 }

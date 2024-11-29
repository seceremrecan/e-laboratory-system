import React from "react";
import { initializeApp } from "firebase/app";
import { View, Text } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCY4YWyZfitmebC_p61n72bp4rToODcGYI",
  authDomain: "e-laboratory-mobile-project.firebaseapp.com",
  projectId: "e-laboratory-mobile-project",
  storageBucket: "e-laboratory-mobile-project.appspot.com",
  messagingSenderId: "632177386698",
  appId: "1:632177386698:web:14e06884b766e52c9cc033",
  measurementId: "G-RNXNZR2GVF",
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, color: "green" }}>Firebase is working! Start Project</Text>
    </View>
  );
}

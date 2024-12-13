import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { getFirestore, doc, updateDoc, setDoc } from "firebase/firestore";

const AddGuideScreen = () => {
  const db = getFirestore();

  const [guideName, setGuideName] = useState(""); // Kılavuz adı
  const [ageRange, setAgeRange] = useState(""); // Yaş aralığı
  const [testType, setTestType] = useState(""); // Test türü (IgM, IgG, vb.)
  const [minValue, setMinValue] = useState(""); // Minimum değer
  const [maxValue, setMaxValue] = useState(""); // Maksimum değer

  const handleAddGuide = async () => {
    try {
      // Guides koleksiyonunda guideName dokümanını oluştur veya güncelle
      const guideDocRef = doc(db, "Guides", guideName);

      // Güncelleme için JSON yapısı
      const ageGroupData = {
        [ageRange]: {
          [testType]: [parseFloat(minValue), parseFloat(maxValue)],
        },
      };

      // Firestore dokümanını güncelle
      await setDoc(guideDocRef, ageGroupData, { merge: true });

      alert("Guide added successfully!");
      // Alanları temizle
      setAgeRange("");
      setTestType("");
      setMinValue("");
      setMaxValue("");
    } catch (error) {
      console.error("Error adding guide:", error.message);
      alert("Failed to add guide.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Guide (Admin Only)</Text>
      <TextInput
        placeholder="Guide Name (e.g., Default Guide)"
        value={guideName}
        onChangeText={setGuideName}
        style={styles.input}
      />
      <TextInput
        placeholder="Age Range (e.g., 2-3)"
        value={ageRange}
        onChangeText={setAgeRange}
        style={styles.input}
      />
      <TextInput
        placeholder="Test Type (e.g., IgM, IgG)"
        value={testType}
        onChangeText={setTestType}
        style={styles.input}
      />
      <TextInput
        placeholder="Min Value"
        value={minValue}
        onChangeText={setMinValue}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Max Value"
        value={maxValue}
        onChangeText={setMaxValue}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Add Guide" onPress={handleAddGuide} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default AddGuideScreen;

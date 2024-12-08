import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const AddGuideScreen = () => {
  const db = getFirestore();
  const [docName, setDocName] = useState("");
  const [type, setType] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const handleAddGuide = async () => {
    try {
      await setDoc(doc(db, "Guides", docName), {
        type,
        ageRange,
        minValue: parseFloat(minValue), // Sayı olarak kaydedilir
        maxValue: parseFloat(maxValue),
      });
      alert("Guide added successfully!");
    } catch (error) {
      console.error("Error adding guide:", error.message);
      alert("Failed to add guide.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Guide (Admin Only)</Text>
      <TextInput
        placeholder="Document Name"
        value={docName}
        onChangeText={setDocName}
        style={styles.input}
      />
      <TextInput
        placeholder="Type (e.g., IgM, IgG)"
        value={type}
        onChangeText={setType}
        style={styles.input}
      />
      <TextInput
        placeholder="Age Range (e.g., 2-3)"
        value={ageRange}
        onChangeText={setAgeRange}
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

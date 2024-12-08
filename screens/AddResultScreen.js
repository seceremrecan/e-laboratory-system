import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const AddResultScreen = () => {
  const db = getFirestore();
  const [userId, setUserId] = useState("");
  const [testName, setTestName] = useState("");
  const [resultValue, setResultValue] = useState("");
  const [date, setDate] = useState("");
  const [referenceRange, setReferenceRange] = useState("");

  const handleAddResult = async () => {
    try {
      const status =
        resultValue < referenceRange[0]
          ? "Low"
          : resultValue > referenceRange[1]
          ? "High"
          : "Normal";

      await addDoc(collection(db, "Results"), {
        userId,
        testName,
        resultValue: parseFloat(resultValue),
        date,
        referenceRange: referenceRange.split("-").map(Number),
        status,
      });

      alert("Result added successfully!");
    } catch (error) {
      console.error("Error adding result: ", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Result (Admin Only)</Text>
      <TextInput
        placeholder="User ID"
        value={userId}
        onChangeText={setUserId}
        style={styles.input}
      />
      <TextInput
        placeholder="Test Name (e.g., IgG)"
        value={testName}
        onChangeText={setTestName}
        style={styles.input}
      />
      <TextInput
        placeholder="Result Value"
        value={resultValue}
        onChangeText={setResultValue}
        style={styles.input}
      />
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <TextInput
        placeholder="Reference Range (e.g., 7-16)"
        value={referenceRange}
        onChangeText={setReferenceRange}
        style={styles.input}
      />
      <Button title="Add Result" onPress={handleAddResult} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    width: "80%",
  },
});

export default AddResultScreen;

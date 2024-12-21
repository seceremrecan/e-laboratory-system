import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from "react-native";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

const AddResultScreen = () => {
  const db = getFirestore();
  const [userId, setUserId] = useState(""); // Patient UID
  const [date, setDate] = useState(""); // YYYY-MM-DD
  const [results, setResults] = useState({
    IgA: "",
    IgM: "",
    IgG: "",
    IgG1: "",
    IgG2: "",
    IgG3: "",
    IgG4: "",
  });

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    if (!dateString.match(regex)) return false;
    const dateObj = new Date(dateString);
    return !isNaN(dateObj.getTime());
  };

  const handleAddResult = async () => {
    try {
      if (!userId || !date || Object.values(results).some((value) => value === "")) {
        Alert.alert("Error", "Please fill all fields, including User ID, Date, and Results.");
        return;
      }

      if (!isValidDate(date)) {
        Alert.alert("Error", "Please enter a valid date in the format YYYY-MM-DD.");
        return;
      }

      const docRef = doc(db, "Results", userId);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        // Create a new document if it doesn't exist
        await setDoc(docRef, {
          [date]: {
            ...Object.fromEntries(
              Object.entries(results).map(([key, value]) => [key, parseFloat(value)])
            ),
          },
        });
      } else {
        // Update the existing document
        const existingData = docSnapshot.data();
        await updateDoc(docRef, {
          [date]: {
            ...Object.fromEntries(
              Object.entries(results).map(([key, value]) => [key, parseFloat(value)])
            ),
          },
        });
      }

      Alert.alert("Success", "Result added successfully!");
      // Reset form
      setUserId("");
      setDate("");
      setResults({
        IgA: "",
        IgM: "",
        IgG: "",
        IgG1: "",
        IgG2: "",
        IgG3: "",
        IgG4: "",
      });
    } catch (error) {
      console.error("Error adding result:", error.message);
      Alert.alert("Error", "Failed to add result. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Result (Admin Only)</Text>
      <TextInput
        placeholder="User ID (Document ID)"
        value={userId}
        onChangeText={setUserId}
        style={styles.input}
      />
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <Text style={styles.subHeader}>Enter Test Results:</Text>
      {Object.keys(results).map((key) => (
        <TextInput
          key={key}
          placeholder={key}
          value={results[key]}
          onChangeText={(value) => setResults({ ...results, [key]: value })}
          style={styles.input}
          keyboardType="numeric"
        />
      ))}
      <Button title="Add Result" onPress={handleAddResult} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    width: "80%",
    borderRadius: 5,
  },
});

export default AddResultScreen;

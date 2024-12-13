import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const AddResultScreen = () => {
  const db = getFirestore();
  const [userId, setUserId] = useState(""); // Hastanın UID'si
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

  const handleAddResult = async () => {
    try {
      if (!userId || !date) {
        alert("User ID and Date are required!");
        return;
      }

      const docRef = doc(db, "Results", userId);
      const docSnapshot = await getDoc(docRef);

      // Eğer doküman yoksa oluştur
      if (!docSnapshot.exists()) {
        await setDoc(docRef, {
          [date]: {
            IgA: parseFloat(results.IgA),
            IgM: parseFloat(results.IgM),
            IgG: parseFloat(results.IgG),
            IgG1: parseFloat(results.IgG1),
            IgG2: parseFloat(results.IgG2),
            IgG3: parseFloat(results.IgG3),
            IgG4: parseFloat(results.IgG4),
          },
        });
      } else {
        // Doküman varsa, mevcut dokümana yeni sonuçları ekle
        const existingData = docSnapshot.data();
        await setDoc(docRef, {
          ...existingData,
          [date]: {
            IgA: parseFloat(results.IgA),
            IgM: parseFloat(results.IgM),
            IgG: parseFloat(results.IgG),
            IgG1: parseFloat(results.IgG1),
            IgG2: parseFloat(results.IgG2),
            IgG3: parseFloat(results.IgG3),
            IgG4: parseFloat(results.IgG4),
          },
        });
      }

      alert("Result added successfully!");
      // Formu sıfırla
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
      console.error("Error adding result: ", error.message);
      alert("Failed to add result.");
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
  },
});

export default AddResultScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; 
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

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

  const [users, setUsers] = useState([]); // Kullanıcılar
  const [selectedUserName, setSelectedUserName] = useState(""); // Seçilen kullanıcı ismi

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const usersList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.role === "user"); // Sadece role "user" olanları getir
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        Alert.alert("Error", "Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

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

      Alert.alert("Başarılı", "Tahlil başarıyla eklendi!");
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

  const handleUserSelection = (userName) => {
    setSelectedUserName(userName);
    const selectedUser = users.find((user) => user.name === userName);
    if (selectedUser) {
      setUserId(selectedUser.id);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Tahlil Ekle</Text>

      {/* Kullanıcı Seçimi */}
      <Text style={styles.subHeader}>Hasta Seç</Text>
      <Picker
        selectedValue={selectedUserName}
        onValueChange={(itemValue) => handleUserSelection(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Hasta Seçin" value="" />
        {users.map((user) => (
          <Picker.Item key={user.id} label={user.name} value={user.name} />
        ))}
      </Picker>

      {/* User ID */}
        <TextInput
        placeholder="User ID (Hasta seçildiğinde otomatik doldurulur.)"
        value={userId}
        onChangeText={setUserId}
        style={styles.input}
        editable={false}
       />

      <TextInput
        placeholder="Tahlil Tarihi (Yıl-Ay-Gün)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <Text style={styles.subHeader}>Tahlil Değerleri</Text>
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
      <Button title="Tahlili Ekle" onPress={handleAddResult} />
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
  picker: {
    width: "80%",
    height: 50,
    marginBottom: 20,
  },
});

export default AddResultScreen;

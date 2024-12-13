import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const AdminViewPatientsScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const db = getFirestore();

  useEffect(() => {
    const fetchPatients = async () => {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const patientsData = [];
      querySnapshot.forEach((doc) => {
        patientsData.push({ id: doc.id, ...doc.data() });
      });
      setPatients(patientsData);
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by patient name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.patientItem}
            onPress={() =>
              navigation.navigate("PatientDetails", {
                userId: item.id, // Hastanın UID'si
                name: item.name, // Hastanın adı
              })
            }
          >
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientEmail}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  patientItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  patientEmail: {
    fontSize: 14,
    color: "#555",
  },
});

export default AdminViewPatientsScreen;

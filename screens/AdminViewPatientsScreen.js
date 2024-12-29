import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Register")} // "Register" adıyla eşleşiyor
        >
          <Text style={styles.registerButtonText}>Hasta Kayıt</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Hasta adı arayın..."
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
                userId: item.id,
                name: item.name,
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
  registerButton: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AdminViewPatientsScreen;

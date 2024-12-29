import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const UserProfileScreen = ({ route }) => {
  const { userId } = route.params;
  const db = getFirestore();

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "Users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);

          // Varsayılan değerleri inputlara atama
          setName(data.name || "");
          setAge(data.age ? String(data.age) : "");
          setHeight(data.height ? String(data.height) : "");
          setWeight(data.weight ? String(data.weight) : "");
        } else {
          Alert.alert("Error", "User data not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        Alert.alert("Error", "Failed to fetch user data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdate = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const userDocRef = doc(db, "Users", userId);

      await updateDoc(userDocRef, {
        name,
        age: parseInt(age, 10),
        height: parseInt(height, 10),
        weight: parseInt(weight, 10),
      });

      Alert.alert("Başarılı", "Profil başarıyla güncellendi!"); // Başarı mesajı
    } catch (error) {
      console.error("Error updating profile:", error.message);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>İsim</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Yaş</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Boy (cm)</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Kilo (kg)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        <Button
          title={isUpdating ? "Guncelleniyor..." : "Profili Güncelle"}
          onPress={handleUpdate}
          disabled={isUpdating}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
  },
});

export default UserProfileScreen;

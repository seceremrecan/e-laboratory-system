import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const PatientDetailsScreen = ({ route }) => {
  const { userId, name } = route.params; // userId ve hastanın adı, navigasyondan geliyor
  const db = getFirestore();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const docRef = doc(db, "Results", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const sortedResults = Object.entries(data).sort(([keyA], [keyB]) =>
            keyA.localeCompare(keyB)
          ); // Tarihe göre sıralama
          setResults(sortedResults);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching patient results:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Results for {name}</Text>
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.date}>{item[0]}</Text>
            {Object.entries(item[1]).map(([test, value]) => (
              <Text key={test}>
                {test}: {value}
              </Text>
            ))}
          </View>
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  resultItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default PatientDetailsScreen;

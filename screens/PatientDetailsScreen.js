import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const PatientDetailsScreen = ({ route, navigation }) => {
  const { userId, name } = route.params;
  const db = getFirestore();
  const [results, setResults] = useState([]);
  const [age, setAge] = useState(null); // Yaş bilgisi için state ekliyoruz

  useEffect(() => {
    // Sonuçları getir
    const fetchResults = async () => {
      try {
        const docRef = doc(db, "Results", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const sortedResults = Object.keys(data)
            .map((date) => ({ date, values: data[date] }))
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // En yeni tarih en üste
          setResults(sortedResults);
        }
      } catch (error) {
        console.error("Error fetching results:", error.message);
      }
    };

    // Kullanıcı yaşını getir
    const fetchUserAge = async () => {
      try {
        const userDocRef = doc(db, "Users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setAge(userDoc.data().age); // Yaşı state'e ata
        } else {
          console.error("User document not found!");
        }
      } catch (error) {
        console.error("Error fetching user age:", error.message);
      }
    };

    fetchResults();
    fetchUserAge();
  }, [userId]);

  const compareValues = (current, previous) => {
    if (current > previous) return { symbol: "↑", color: "green", background: "#e6ffe6" };
    if (current < previous) return { symbol: "↓", color: "red", background: "#ffe6e6" };
    return { symbol: "→", color: "gray", background: "#f2f2f2" };
  };

  const renderComparison = (currentResult, prevResult) => {
    if (!prevResult) return null;

    return Object.keys(currentResult).map((key) => {
      const currentValue = currentResult[key];
      const prevValue = prevResult[key] || 0;
      const { symbol, color, background } = compareValues(currentValue, prevValue);

      return (
        <View key={key} style={[styles.resultRow, { backgroundColor: background }]}>
          <Text style={styles.resultText}>
            {key}: {currentValue}
          </Text>
          <Text style={[styles.arrow, { color }]}>{symbol}</Text>
        </View>
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.header}>Results for {name}</Text>

        {results.map((result, index) => (
          <View key={result.date} style={styles.resultContainer}>
            <Text style={styles.date}>{result.date}</Text>
            {index === 0
              ? renderComparison(result.values, results[index + 1]?.values)
              : Object.keys(result.values).map((key) => (
                  <View key={key} style={styles.resultRow}>
                    <Text style={styles.resultText}>
                      {key}: {result.values[key]}
                    </Text>
                  </View>
                ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.guideButton}
          onPress={() =>
            navigation.navigate("AdminGuideEvaluation", { userId, name, age }) // age gönderiliyor
          }
        >
          <Text style={styles.buttonText}>Kılavuz Değerlendirme</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  resultContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
  },
  resultText: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  guideButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PatientDetailsScreen;

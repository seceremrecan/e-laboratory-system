import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const UserResultsScreen = ({ route }) => {
  const { userId } = route.params;
  const db = getFirestore();

  const [results, setResults] = useState([]);
  const [userAge, setUserAge] = useState(null);
  const [guideData, setGuideData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "Users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserAge(userDoc.data().age);
        } else {
          console.error("User data not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchResults = async () => {
      try {
        const resultsDocRef = doc(db, "Results", userId);
        const resultsDoc = await getDoc(resultsDocRef);

        if (resultsDoc.exists()) {
          const data = resultsDoc.data();
          const sortedResults = Object.keys(data)
            .map((date) => ({ date, values: data[date] }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          setResults(sortedResults);
        } else {
          console.error("Results not found!");
        }
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    const fetchGuideData = async () => {
      try {
        const guideDocRef = doc(db, "Guides", "TJMS"); // Örnek olarak "TJMS" kullanılıyor
        const guideDoc = await getDoc(guideDocRef);

        if (guideDoc.exists()) {
          setGuideData(guideDoc.data());
        } else {
          console.error("Guide data not found!");
        }
      } catch (error) {
        console.error("Error fetching guide data:", error);
      }
    };

    fetchUserData();
    fetchResults();
    fetchGuideData();
  }, [userId]);

  const evaluateValue = (key, value) => {
    if (!guideData || !userAge) return { backgroundColor: "#fff" };

    const ageRange = Object.keys(guideData).find((range) => {
      const [minAge, maxAge] = range.split("-").map(Number);
      return userAge >= minAge && userAge <= maxAge;
    });

    if (ageRange && guideData[ageRange][key]) {
      const [min, max] = guideData[ageRange][key];
      if (value < min) {
        return { backgroundColor: "#ffe6e6", arrow: "↓", arrowColor: "red" }; // Değer düşük
      } else if (value > max) {
        return { backgroundColor: "#ffe6e6", arrow: "↑", arrowColor: "red" }; // Değer yüksek
      } else {
        return { backgroundColor: "#e6ffe6" }; // Değer normal
      }
    }

    return { backgroundColor: "#fff" }; // Kılavuz bulunamadığında
  };

  return (
    <ScrollView style={styles.container}>
      {results.map((result) => (
        <View key={result.date} style={styles.resultContainer}>
          <Text style={styles.date}>{result.date}</Text>
          {Object.keys(result.values).map((key) => {
            const evaluation = evaluateValue(key, result.values[key]);

            return (
              <View key={key} style={[styles.resultRow, { backgroundColor: evaluation.backgroundColor }]}>
                <Text style={styles.resultKey}>{key}:</Text>
                <Text style={styles.resultValue}>
                  {result.values[key]}{" "}
                  {evaluation.arrow && (
                    <Text style={{ color: evaluation.arrowColor, fontWeight: "bold" }}>
                      {evaluation.arrow}
                    </Text>
                  )}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  resultContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  resultKey: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resultValue: {
    fontSize: 16,
  },
});

export default UserResultsScreen;

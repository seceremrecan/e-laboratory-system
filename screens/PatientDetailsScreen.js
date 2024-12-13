import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const PatientDetailsScreen = ({ route }) => {
  const { userId, name } = route.params;
  const db = getFirestore();
  const [results, setResults] = useState([]);

  const keyOrder = ["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"]; // Sabit sıralama

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const docRef = doc(db, "Results", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const sortedResults = Object.keys(data)
            .filter((key) => key !== "name")
            .map((date) => ({ date, values: data[date] }))
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Tarihe göre sıralama

          setResults(sortedResults);
        }
      } catch (error) {
        console.error("Error fetching results:", error.message);
      }
    };

    fetchResults();
  }, [userId]);

  const compareValues = (current, previous) => {
    if (current > previous) return { symbol: "↑", color: "green", background: "#e6ffe6" };
    if (current < previous) return { symbol: "↓", color: "red", background: "#ffe6e6" };
    return { symbol: "→", color: "gray", background: "#f2f2f2" };
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Results for {name}</Text>
      {results.map((result, index) => {
        const comparison =
          index < results.length - 1
            ? keyOrder.map((key) => {
                const prevValue = results[index + 1]?.values[key] || 0;
                const currentValue = result.values[key] || 0;
                return { key, ...compareValues(currentValue, prevValue), value: currentValue };
              })
            : null;

        return (
          <View key={result.date} style={styles.resultContainer}>
            <Text style={styles.date}>{result.date}</Text>
            {comparison
              ? comparison.map(({ key, symbol, color, background, value }) => (
                  <View
                    key={key}
                    style={[styles.resultRow, { backgroundColor: background }]}
                  >
                    <Text style={styles.resultText}>
                      {key}: {value}
                    </Text>
                    <Text style={[styles.arrow, { color }]}>{symbol}</Text>
                  </View>
                ))
              : keyOrder.map((key) => (
                  <View key={key} style={styles.resultRow}>
                    <Text style={styles.resultText}>
                      {key}: {result.values[key] || 0}
                    </Text>
                  </View>
                ))}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default PatientDetailsScreen;

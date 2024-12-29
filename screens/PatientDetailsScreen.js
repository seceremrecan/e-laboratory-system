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
  const [age, setAge] = useState(null);

  // Sabit bir anahtar sırası belirliyoruz
  const keyOrder = ["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"];

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const docRef = doc(db, "Results", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const sortedResults = Object.keys(data)
            .map((date) => ({ date, values: data[date] }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          setResults(sortedResults);
        }
      } catch (error) {
        console.error("Error fetching results:", error.message);
      }
    };

    const fetchUserAge = async () => {
      try {
        const userDocRef = doc(db, "Users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setAge(userDoc.data().age);
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
    if (current > previous) {
      return {
        symbol: "↑",
        color: "green",
        background: "#e6ffe6",
        text: "Bir önceki tahlile göre yükselmiş",
      };
    }
    if (current < previous) {
      return {
        symbol: "↓",
        color: "red",
        background: "#ffe6e6",
        text: "Bir önceki tahlile göre düşmüş",
      };
    }
    return {
      symbol: "→",
      color: "gray",
      background: "#f2f2f2",
      text: "Bir önceki tahlile göre aynı",
    };
  };

  const renderComparison = (currentResult, prevResult) => {
    if (!prevResult) return null;

    return keyOrder.map((key) => {
      const currentValue = currentResult[key] || "-";
      const prevValue = prevResult[key] || 0;
      const { symbol, color, background, text } = compareValues(
        currentValue,
        prevValue
      );

      return (
        <View key={key} style={[styles.resultRow, { backgroundColor: background }]}>
          <Text style={styles.resultText}>
            {key}: {currentValue}
          </Text>
          <View style={styles.arrowContainer}>
            <Text style={[styles.arrow, { color }]}>{symbol}</Text>
            <Text style={[styles.arrowText, { color }]}>{text}</Text>
          </View>
        </View>
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.header}>{name} | Tahlil Sonuçları</Text>

        {results.map((result, index) => (
          <View key={result.date} style={styles.resultContainer}>
            <Text style={styles.date}>{result.date}</Text>
            {results.length === 1 || index > 0
              ? // Eğer yalnızca bir tahlil varsa veya bu birden sonraki tahlilse
                keyOrder.map((key) => (
                  <View key={key} style={styles.resultRow}>
                    <Text style={styles.resultText}>
                      {key}: {result.values[key] || "-"}
                    </Text>
                  </View>
                ))
              : // Eğer bu ilk tahlilse ve kıyas yapılacak veri varsa
                renderComparison(result.values, results[index + 1]?.values)}
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.guideButton}
          onPress={() =>
            navigation.navigate("AdminGuideEvaluation", { userId, name, age })
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
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
  },
  arrowContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  arrow: {
    fontSize: 18,
    fontWeight: "bold",
  },
  arrowText: {
    fontSize: 12,
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

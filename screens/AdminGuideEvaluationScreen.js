import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Güncellenmiş import
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";

const AdminGuideEvaluationScreen = ({ route }) => {
  const { userId, name, age } = route.params;
  const db = getFirestore();

  const [results, setResults] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guideData, setGuideData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Sabit bir anahtar sırası
  const keyOrder = ["IgA", "IgM", "IgG", "IgG1", "IgG2", "IgG3", "IgG4"];

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const resultsDocRef = doc(db, "Results", userId);
        const resultsSnapshot = await getDoc(resultsDocRef);

        if (resultsSnapshot.exists()) {
          const data = resultsSnapshot.data();
          const sortedResults = Object.keys(data)
            .map((date) => ({ date, values: data[date] }))
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
          setResults(sortedResults);
        }
      } catch (error) {
        console.error("Error fetching results:", error.message);
      }
    };

    const fetchGuides = async () => {
      try {
        const guidesCollectionRef = collection(db, "Guides");
        const guidesSnapshot = await getDocs(guidesCollectionRef);

        const guidesList = [];
        guidesSnapshot.forEach((doc) => {
          guidesList.push({ id: doc.id, data: doc.data() });
        });

        setGuides(guidesList);

        if (guidesList.length > 0) {
          setSelectedGuide(guidesList[0].id); // Default selection
          setGuideData(guidesList[0].data); // Load first guide data
        }
      } catch (error) {
        console.error("Error fetching guides:", error.message);
      }
    };

    fetchResults();
    fetchGuides();
  }, [userId]);

  const handleGuideChange = (guideId) => {
    setSelectedGuide(guideId);
    const selectedGuideData = guides.find((guide) => guide.id === guideId)?.data;
    setGuideData(selectedGuideData);
  };

  const determineAgeRange = (age) => {
    if (!guideData) return null;

    const roundedAge = Math.ceil(age); // Round age up
    const ageRange = Object.keys(guideData).find((range) => {
      const [minAge, maxAge] = range.split("-").map(Number);
      return roundedAge >= minAge && roundedAge < maxAge;
    });

    return ageRange;
  };

  const evaluateValue = (key, value) => {
    if (!guideData || !age) return { backgroundColor: "#fff" };

    const ageRange = determineAgeRange(age);

    if (ageRange && guideData[ageRange]?.[key]) {
      const [min, max] = guideData[ageRange][key];
      if (value < min) return { backgroundColor: "#ffe6e6", arrow: "↓", arrowColor: "red" };
      if (value > max) return { backgroundColor: "#ffe6e6", arrow: "↑", arrowColor: "red" };
      return { backgroundColor: "#e6ffe6" };
    }

    return { backgroundColor: "#fff" };
  };

  const filteredResults = results.map((result) => ({
    date: result.date,
    filteredValues: keyOrder.reduce((acc, key) => {
      if (!searchQuery || key.toLowerCase() === searchQuery.toLowerCase()) {
        acc[key] = result.values[key] || "-";
      }
      return acc;
    }, {}),
  }));

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Guide Picker */}
        <Picker
          selectedValue={selectedGuide}
          onValueChange={handleGuideChange}
          style={styles.picker}
        >
          {guides.map((guide) => (
            <Picker.Item key={guide.id} label={guide.id} value={guide.id} />
          ))}
        </Picker>

        <TextInput
          placeholder="Search by test value (e.g., IgA)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {filteredResults.map((result) => (
            Object.keys(result.filteredValues).length > 0 && (
              <View key={result.date} style={styles.resultContainer}>
                <Text style={styles.date}>{result.date}</Text>
                {keyOrder.map((key) => {
                  const value = result.filteredValues[key];
                  const evaluation = evaluateValue(key, value);
                  return (
                    <View
                      key={key}
                      style={[styles.resultRow, { backgroundColor: evaluation.backgroundColor }]}
                    >
                      <Text style={styles.resultKey}>{key}:</Text>
                      <Text style={styles.resultValue}>
                        {value}{" "}
                        {evaluation.arrow && (
                          <Text
                            style={{
                              color: evaluation.arrowColor,
                              fontWeight: "bold",
                            }}
                          >
                            {evaluation.arrow}
                          </Text>
                        )}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
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

export default AdminGuideEvaluationScreen;

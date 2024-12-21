import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const UserResultsScreen = ({ route }) => {
  const { userId } = route.params;
  const db = getFirestore();

  const [results, setResults] = useState([]);
  const [userAge, setUserAge] = useState(null);
  const [guideData, setGuideData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, "Users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserAge(userDoc.data().age);
      }
    };

    const fetchResults = async () => {
      const resultsDocRef = doc(db, "Results", userId);
      const resultsDoc = await getDoc(resultsDocRef);
      if (resultsDoc.exists()) {
        const data = resultsDoc.data();
        const sortedResults = Object.keys(data)
          .map((date) => ({ date, values: data[date] }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setResults(sortedResults);
      }
    };

    const fetchGuideData = async () => {
      const guideDocRef = doc(db, "Guides", "TJMS");
      const guideDoc = await getDoc(guideDocRef);
      if (guideDoc.exists()) {
        setGuideData(guideDoc.data());
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
      if (value < min) return { backgroundColor: "#ffe6e6", arrow: "↓", arrowColor: "red" };
      if (value > max) return { backgroundColor: "#ffe6e6", arrow: "↑", arrowColor: "red" };
      return { backgroundColor: "#e6ffe6" };
    }

    return { backgroundColor: "#fff" };
  };

  const filteredResults = results.map((result) => ({
    date: result.date,
    filteredValues: Object.keys(result.values)
      .filter((key) =>
        searchQuery ? key.toLowerCase() === searchQuery.toLowerCase() : true
      )
      .reduce((acc, key) => {
        acc[key] = result.values[key];
        return acc;
      }, {}),
  }));

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
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
                {Object.entries(result.filteredValues).map(([key, value]) => {
                  const evaluation = evaluateValue(key, value);
                  return (
                    <View
                      key={key}
                      style={[
                        styles.resultRow,
                        { backgroundColor: evaluation.backgroundColor },
                      ]}
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

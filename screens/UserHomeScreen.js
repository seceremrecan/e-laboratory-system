import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const UserHomeScreen = ({ navigation, route }) => {
  const { userId } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Kullanıcı Paneli</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("UserResults", { userId })}
        >
          <Text style={styles.cardTitle}>Tahlil Sonuçlarım</Text>
          <Text style={styles.cardDescription}>
            Tahlil sonuçlarınızı görüntüleyin ve değerlendirin.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("UserProfile", { userId })}
        >
          <Text style={styles.cardTitle}>Profilim</Text>
          <Text style={styles.cardDescription}>
            Kişisel bilgilerinizi görüntüleyin ve düzenleyin.
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  cardContainer: {
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Android için gölge
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
  },
});

export default UserHomeScreen;

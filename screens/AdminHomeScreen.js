import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const AdminHomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Hoşgeldiniz</Text>
      <Text style={styles.cardTitle}>Lütfen yapmak istediğiniz işlemi seçin.</Text>


      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("AdminViewPatients")}
        >
          <Text style={styles.cardTitle}>Hastalar</Text>
          <Text style={styles.cardDescription}>
            Hastalar ve sonuçları hakkında bilgi alın.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("AddGuide")}
        >
          <Text style={styles.cardTitle}>Kılavuz Ekleme ve Değerlendirme</Text>
          <Text style={styles.cardDescription}>
            Değerlendirmeler için tıbbi kılavuzları ekleyin ve örnek tahlil sonuçlarını bu kılavuzlara göre değerlendirin.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("AddResult")}
        >
          <Text style={styles.cardTitle}>Tahlil Ekle</Text>
          <Text style={styles.cardDescription}>
            Bir hastanın tahlil sonuçlarını ekleyin.
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

export default AdminHomeScreen;

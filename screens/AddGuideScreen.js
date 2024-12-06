import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const AddGuideScreen = () => {
  const auth = getAuth();
  const db = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "Users", user.uid); // Kullanıcının Firestore'daki UID'si ile dokümanını al
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role !== "admin") {
            // Kullanıcı admin değilse
            navigation.navigate("Unauthorized"); // Admin değilse yetkisiz ekranına yönlendir
          }
        } else {
          console.error("Kullanıcı bilgileri Firestore'da bulunamadı!");
          navigation.navigate("Unauthorized");
        }
      } else {
        navigation.navigate("Login"); // Kullanıcı oturum açmamışsa giriş ekranına yönlendir
      }
    };

    checkAdmin();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Add Guide Screen! (Admin Only)</Text>
      {/* Burada rehber ekleme formu veya işlevselliklerini ekleyebilirsiniz */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default AddGuideScreen;

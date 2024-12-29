import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");

  const auth = getAuth();
  const db = getFirestore();

  const handleRegister = async () => {
    try {
      // Kullanıcıyı Firebase Authentication ile oluştur
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Kullanıcının UID'sini al
      const userId = user.uid;

      // Firestore'da "users" koleksiyonuna kullanıcı bilgilerini kaydet
      await setDoc(doc(db, "Users", userId), {
        email: email,
        name: name,
        height: parseInt(height),
        weight: parseInt(weight),
        age: parseInt(age),
        userId: userId,
        role: "user",
      });

      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Kayıt hatası:", error.message);
      alert("Kayıt başarısız: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <Text style={styles.text}>Doktor bir hastayı sisteme kaydedebilir veya bir hasta kaydını oluşturabilir</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Ad Soyad"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Boy (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Kilo (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Yaş"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Kayıt Ol" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  text:{
    fontSize: 12,
    textAlign: "center",
    color: "#007BFF",
    marginBottom: 8,
  },
});

export default RegisterScreen;

import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import AddGuideScreen from "./screens/AddGuideScreen"; // AddGuideScreen'i import ettik

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyCY4YWyZfitmebC_p61n72bp4rToODcGYI",
  authDomain: "e-laboratory-mobile-project.firebaseapp.com",
  projectId: "e-laboratory-mobile-project",
  storageBucket: "e-laboratory-mobile-project.appspot.com",
  messagingSenderId: "632177386698",
  appId: "1:632177386698:web:14e06884b766e52c9cc033",
  measurementId: "G-RNXNZR2GVF",
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Stack = createStackNavigator();

// Login Ekranı
function LoginScreen({ navigation, setRole, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;

      // Kullanıcıyı state'e ekleyin
      setUser(loggedInUser);

      // Kullanıcı rolünü Firestore'dan alın
      const userDocRef = doc(db, "Users", loggedInUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const role = userDoc.data().role;
        setRole(role);

        // Kullanıcı rolüne göre yönlendirme
        if (role === "admin") {
          navigation.navigate("AdminHome");
        } else if (role === "user") {
          navigation.navigate("UserHome");
        }
      } else {
        console.error("Kullanıcı bilgileri Firestore'da bulunamadı!");
      }
    } catch (error) {
      console.error("Giriş hatası:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

// Admin Ana Sayfası
function AdminHome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.adminText}>Welcome, Admin!</Text>
      <Button title="Add Guide" onPress={() => navigation.navigate("AddGuide")} />
    </View>
  );
}

// Kullanıcı Ana Sayfası
function UserHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.userText}>Welcome, User!</Text>
    </View>
  );
}

// Ana App Bileşeni
export default function App() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Login ekranı */}
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} setRole={setRole} setUser={setUser} />}
        </Stack.Screen>

        {/* Admin ana ekranı */}
        {role === "admin" && (
          <>
            <Stack.Screen name="AdminHome" component={AdminHome} />
            <Stack.Screen name="AddGuide" component={AddGuideScreen} />
          </>
        )}

        {/* Kullanıcı ana ekranı */}
        {role === "user" && <Stack.Screen name="UserHome" component={UserHome} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Stil
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    width: "80%",
  },
  adminText: {
    fontSize: 20,
    color: "blue",
    fontWeight: "bold",
  },
  userText: {
    fontSize: 20,
    color: "green",
    fontWeight: "bold",
  },
});

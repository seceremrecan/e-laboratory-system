import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import AddGuideScreen from "./screens/AddGuideScreen";
import AddResultScreen from "./screens/AddResultScreen";

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

// Firebase başlatma
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Stack Navigator tanımı
const Stack = createStackNavigator();

// Giriş Ekranı
function LoginScreen({ navigation, setRole, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;
      setUser(loggedInUser);
  
      // Kullanıcı rolünü Firestore'dan alın
      const userDocRef = doc(db, "Users", loggedInUser.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        setRole(role);
  
        // Rol bazlı yönlendirme
        if (role === "admin") {
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "AdminHome" }],
            });
          }, 0); // State'in tamamen güncellenmesini beklemek için timeout kullanıyoruz
        } else if (role === "user") {
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "UserHome" }],
            });
          }, 0);
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
      <Button title="Add Result" onPress={() => navigation.navigate("AddResult")} />
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
        {/* Giriş ekranı */}
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} setRole={setRole} setUser={setUser} />}
        </Stack.Screen>

        {/* Admin ekranları */}
        {role === "admin" && (
          <>
            <Stack.Screen name="AdminHome" component={AdminHome} />
            <Stack.Screen name="AddGuide" component={AddGuideScreen} />
            <Stack.Screen name="AddResult" component={AddResultScreen} />
          </>
        )}

        {/* Kullanıcı ekranları */}
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

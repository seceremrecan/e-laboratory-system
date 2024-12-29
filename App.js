import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

// Diğer ekranlar
import AdminViewPatientsScreen from "./screens/AdminViewPatientsScreen";
import AddGuideScreen from "./screens/AddGuideScreen";
import AddResultScreen from "./screens/AddResultScreen";
import PatientDetailsScreen from "./screens/PatientDetailsScreen";
import AdminGuideEvaluationScreen from "./screens/AdminGuideEvaluationScreen";
import UserResultsScreen from "./screens/UserResultsScreen";
import AdminHomeScreen from "./screens/AdminHomeScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import UserHomeScreen from "./screens/UserHomeScreen";
import RegisterScreen from "./screens/RegisterScreen";

// Firebase yapılandırması
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyCY4YWyZfitmebC_p61n72bp4rToODcGYI",
  authDomain: "e-laboratory-mobile-project.firebaseapp.com",
  projectId: "e-laboratory-mobile-project",
  storageBucket: "e-laboratory-mobile-project.appspot.com",
  messagingSenderId: "632177386698",
  appId: "1:632177386698:web:14e06884b766e52c9cc033",
  measurementId: "G-RNXNZR2GVF",
};
initializeApp(firebaseConfig);

const Stack = createStackNavigator();
const auth = getAuth();
const db = getFirestore();

const LoginScreen = ({ navigation, setUserName }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const role = userDoc.data().role;
        const userName = userDoc.data().name || "User";

        setUserName(userName);

        if (role === "admin") {
          navigation.reset({
            index: 0,
            routes: [{ name: "AdminHome" }],
          });
        } else if (role === "user") {
          navigation.reset({
            index: 0,
            routes: [{ name: "UserHome", params: { userId: user.uid } }],
          });
        }
      } else {
        alert("User data not found in Firestore.");
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginHeader}>Giriş Yap</Text>
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
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: "#6c757d" }]}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.loginButtonText}>Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const [userName, setUserName] = useState("");

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          options={{ title: "Giriş Yap", headerShown: false }}
        >
          {(props) => <LoginScreen {...props} setUserName={setUserName} />}
        </Stack.Screen>
        <Stack.Screen
          name="AdminHome"
          component={AdminHomeScreen}
          options={({ navigation }) => ({
            title: "",
            headerRight: () => (
              <Text style={{ marginRight: 15, fontWeight: "bold", color: "gray" }}>
                {userName}
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 10, flexDirection: "row", alignItems: "center" }}
                onPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }] })}
              >
                <Ionicons name="log-out-outline" size={24} color="#007BFF" />
                <Text style={{ color: "#007BFF", fontSize: 16, marginLeft: 5 }}>Çıkış</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="UserHome"
          component={UserHomeScreen}
          options={({ navigation }) => ({
            title: "",
            headerRight: () => (
              <Text style={{ marginRight: 15, fontWeight: "bold", color: "gray" }}>
                {userName}
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 10, flexDirection: "row", alignItems: "center" }}
                onPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }] })}
              >
                <Ionicons name="log-out-outline" size={24} color="#007BFF" />
                <Text style={{ color: "#007BFF", fontSize: 16, marginLeft: 5 }}>Çıkış</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="AdminViewPatients" component={AdminViewPatientsScreen} />
        <Stack.Screen name="AddGuide" component={AddGuideScreen} />
        <Stack.Screen name="AddResult" component={AddResultScreen} />
        <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} />
        <Stack.Screen name="AdminGuideEvaluation" component={AdminGuideEvaluationScreen} />
        <Stack.Screen name="UserResults" component={UserResultsScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 20,
  },
  loginHeader: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    width: "80%",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

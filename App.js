import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Diğer ekranlar
import AdminViewPatientsScreen from "./screens/AdminViewPatientsScreen";
import AddGuideScreen from "./screens/AddGuideScreen";
import AddResultScreen from "./screens/AddResultScreen";
import PatientDetailsScreen from "./screens/PatientDetailsScreen";
import UserResultsScreen from "./screens/UserResultsScreen";

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

const LoginScreen = ({ navigation, setRole }) => {
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
        setRole(role);

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
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
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
      <Button title={isLoading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={isLoading} />
    </View>
  );
};

const AdminHome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <Button title="View Patients" onPress={() => navigation.navigate("AdminViewPatients")} />
      <Button title="Add Guide" onPress={() => navigation.navigate("AddGuide")} />
      <Button title="Add Result" onPress={() => navigation.navigate("AddResult")} />
    </View>
  );
};

const UserHome = ({ navigation, route }) => {
  const { userId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, User!</Text>
      <Button title="View My Results" onPress={() => navigation.navigate("UserResults", { userId })} />
    </View>
  );
};

export default function App() {
  const [role, setRole] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} setRole={setRole} />}
        </Stack.Screen>
        {role === "admin" && (
          <>
            <Stack.Screen name="AdminHome" component={AdminHome} />
            <Stack.Screen name="AdminViewPatients" component={AdminViewPatientsScreen} />
            <Stack.Screen name="AddGuide" component={AddGuideScreen} />
            <Stack.Screen name="AddResult" component={AddResultScreen} />
            <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} />
          </>
        )}
        {role === "user" && (
          <>
            <Stack.Screen name="UserHome" component={UserHome} />
            <Stack.Screen name="UserResults" component={UserResultsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

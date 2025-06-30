import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert("Login Failed", error.message);
    } else {
      // No navigation needed — AppNavigator will automatically switch on login
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back 👋</Text>
      <Text style={styles.subtext}>
        Log in to continue your reflection journey
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.switchText}>
        Don't have an account?{" "}
        <Text
          style={styles.switchLink}
          onPress={() => navigation.navigate("Signup")}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0b1f",
    justifyContent: "center",
    padding: 24,
  },
  header: { fontSize: 28, color: "white", fontWeight: "bold", marginBottom: 8 },
  subtext: { fontSize: 14, color: "#ccc", marginBottom: 24 },
  input: {
    backgroundColor: "#1f1b36",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    color: "white",
  },
  button: {
    backgroundColor: "#a48bff",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  switchText: { color: "#ccc", marginTop: 24, textAlign: "center" },
  switchLink: { color: "#a48bff", fontWeight: "500" },
});

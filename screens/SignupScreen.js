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

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert("Signup Failed", error.message);
    } else {
      Alert.alert("Success", "Check your email to confirm your account");
      navigation.replace("Login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Join Chester 🪷</Text>
      <Text style={styles.subtext}>
        Let’s begin your self-reflection journey
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
        placeholder="Password (min 6 chars)"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.switchText}>
        Already have an account?{" "}
        <Text
          style={styles.switchLink}
          onPress={() => navigation.navigate("Login")}
        >
          Log in
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

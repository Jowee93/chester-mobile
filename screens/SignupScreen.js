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
import {
  colors,
  typography,
  spacing,
  buttonStyles,
  inputStyles,
} from "../styles/designSystem";

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
        Let's begin your self-reflection journey
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textTertiary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min 6 chars)"
        placeholderTextColor={colors.textTertiary}
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

// 🎨 UPDATED STYLES WITH APPLE DESIGN SYSTEM
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: spacing.screenPadding,
  },

  header: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },

  subtext: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
    textAlign: "center",
  },

  input: {
    ...inputStyles.standard,
    marginBottom: spacing.lg,
  },

  button: {
    ...buttonStyles.primary,
    marginTop: spacing.lg,
    alignItems: "center",
  },

  buttonText: {
    ...typography.headline,
    color: colors.background,
    fontWeight: "600",
  },

  switchText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xxxl,
    textAlign: "center",
  },

  switchLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
  },
});

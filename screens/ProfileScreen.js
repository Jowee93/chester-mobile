import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { supabase } from "../lib/supabase";
import {
  colors,
  typography,
  spacing,
  buttonStyles,
} from "../styles/designSystem";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout failed", error.message);
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Text style={styles.email}>Logged in as: {user.email}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Log Out" onPress={handleLogout} />
      </View>
    </View>
  );
}

// 🎨 UPDATED STYLES WITH APPLE DESIGN SYSTEM
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },

  header: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  email: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },

  buttonContainer: {
    marginTop: spacing.xl,
  },
});

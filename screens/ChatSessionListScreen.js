// screens/ChatSessionListScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import {
  colors,
  typography,
  spacing,
  cardStyles,
  shadows,
} from "../styles/designSystem";

export default function ChatSessionListScreen() {
  const navigation = useNavigation();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) return;

      const { data, error } = await supabase
        .from("chat_sessions")
        .select("id, title, mood, last_updated")
        .eq("user_id", user.id)
        .order("last_updated", { ascending: false });

      if (!error) setSessions(data);
      else console.error("Failed to load sessions:", error);
    };

    fetchSessions();
  }, []);

  const handleNewChat = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) return;

    const { data: newSession, error } = await supabase
      .from("chat_sessions")
      .insert([{ user_id: user.id, title: "Untitled Chat", mood: "neutral" }])
      .select()
      .single();

    if (!error && newSession) {
      navigation.navigate("ChatScreen", { sessionId: newSession.id });
    } else {
      console.error("Failed to create session:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ChatScreen", { sessionId: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>
        {new Date(item.last_updated).toLocaleString()}
      </Text>
      <Text style={styles.mood}>Mood: {item.mood}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} onPress={handleNewChat}>
        <Ionicons name="add" size={28} color={colors.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// 🎨 UPDATED STYLES WITH APPLE DESIGN SYSTEM
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  list: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingBottom: 100, // Space for floating button and tab bar
  },

  card: {
    ...cardStyles.withMaroonBorder,
    marginBottom: spacing.md,
  },

  title: {
    ...typography.headline,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },

  meta: {
    ...typography.caption1,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
    fontWeight: "500",
  },

  mood: {
    ...typography.subheadline,
    color: colors.primary,
    fontWeight: "500",
  },

  fab: {
    position: "absolute",
    right: spacing.xl,
    bottom: 30,
    backgroundColor: colors.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.floating,
  },
});

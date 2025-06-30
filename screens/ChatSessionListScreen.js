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
      />

      <TouchableOpacity style={styles.fab} onPress={handleNewChat}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0b1f",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#1f1b36",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  meta: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
  },
  mood: {
    color: "#7a7aff",
    fontSize: 12,
    marginTop: 2,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#a48bff",
    borderRadius: 50,
    padding: 14,
    elevation: 6,
  },
});

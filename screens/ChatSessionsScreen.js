import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/native";

export default function ChatSessionsScreen() {
  const [sessions, setSessions] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSessions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("chat_sessions")
        .select(
          `
        id,
        created_at,
        title,
        chat_messages!chat_sessions_id_fkey (
          content,
          created_at,
          is_from_ai
        )
      `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const sessionsWithPreview = data.map((session) => {
          const messages = session.chat_messages || [];
          const lastMsg =
            messages.length > 0
              ? messages[messages.length - 1].content
              : "No messages yet";

          return {
            id: session.id,
            title: session.title || "Untitled",
            lastMessage: lastMsg,
            createdAt: session.created_at,
          };
        });

        setSessions(sessionsWithPreview);
      } else {
        console.error("Failed to fetch sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  const handleNewSession = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (data && !error) {
      navigation.navigate("Chat", {
        sessionId: data.id,
      });
    }
  };

  const handleOpenSession = (sessionId) => {
    navigation.navigate("Chat", { sessionId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Chester Chats</Text>

      <TouchableOpacity style={styles.newButton} onPress={handleNewSession}>
        <Text style={styles.newButtonText}>+ Start New Chat</Text>
      </TouchableOpacity>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.sessionItem}
            onPress={() => handleOpenSession(item.id)}
          >
            <Text style={styles.sessionTitle}>{item.title}</Text>
            <Text style={styles.sessionPreview} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            <Text style={styles.sessionText}>
              Chat on {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e0b1f", padding: 20 },
  header: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  newButton: {
    backgroundColor: "#a48bff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  newButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  sessionItem: {
    backgroundColor: "#1f1b36",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sessionText: {
    color: "#fff",
    fontSize: 16,
  },
  sessionPreview: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 4,
  },
});

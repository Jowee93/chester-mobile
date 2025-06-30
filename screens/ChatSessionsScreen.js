import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context"; // Add this import
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";

export default function ChatSessionsScreen() {
  const [sessions, setSessions] = useState([]);
  const navigation = useNavigation();
  const [creating, setCreating] = useState(false);

  useFocusEffect(
    useCallback(() => {
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
          chat_messages!session_id (
            content,
            created_at,
            is_from_ai
          )
        `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (data && !error) {
          const sessionsWithPreview = data.map((session) => {
            const messages = session.chat_messages || [];
            const sortedMessages = [...messages].sort(
              (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
            const lastMsg =
              sortedMessages.length > 0
                ? sortedMessages[sortedMessages.length - 1].content
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
          console.error("Error loading chat sessions:", error);
        }
      };

      fetchSessions();
    }, [])
  );

  const handleNewSession = () => {
    navigation.push("Chat", { sessionId: null }); // No DB entry yet
  };

  const handleOpenSession = (sessionId) => {
    navigation.push("Chat", { sessionId });
  };

  const handleDeleteSession = (sessionId) => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("chat_sessions")
              .delete()
              .eq("id", sessionId);

            if (error) {
              console.error("Delete error:", error);
            } else {
              setSessions((prev) =>
                prev.filter((session) => session.id !== sessionId)
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Your Chester Chats</Text>

        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const renderRightActions = () => (
              <TouchableOpacity
                style={styles.swipeDelete}
                onPress={() => handleDeleteSession(item.id)}
              >
                <Ionicons name="trash" size={24} color="#fff" />
                <Text style={styles.swipeText}>Delete</Text>
              </TouchableOpacity>
            );

            return (
              <Swipeable renderRightActions={renderRightActions}>
                <TouchableOpacity
                  style={styles.sessionItem}
                  onPress={() => handleOpenSession(item.id)}
                >
                  <Text style={styles.sessionTitle}>{item.title}</Text>
                  <Text style={styles.sessionPreview} numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                  <Text style={styles.sessionDate}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </Swipeable>
            );
          }}
          contentContainerStyle={{ paddingBottom: 100 }} // so button doesn't overlap
        />
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleNewSession}
        >
          <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  sessionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
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
    fontSize: 15, // previously 13
    marginTop: 6,
  },
  sessionDate: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#0e0b1f",
    paddingTop: 10, // Optional
    paddingBottom: 12, // Avoid overlap with tab bar
  },

  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#a48bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10, // Android
    zIndex: 999, // iOS
  },

  chatIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  swipeDelete: {
    backgroundColor: "#ff4d4d",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  swipeText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});

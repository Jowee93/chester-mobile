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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import {
  colors,
  typography,
  spacing,
  cardStyles,
  shadows,
} from "../styles/designSystem";

export default function ChatSessionsScreen() {
  const [sessions, setSessions] = useState([]);
  const navigation = useNavigation();
  const [creating, setCreating] = useState(false);

  // 🚀 SOLUTION 2: Cleanup function for empty sessions
  const cleanupEmptySessions = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Find sessions with no messages
      const { data: emptySessions, error } = await supabase
        .from("chat_sessions")
        .select(
          `
          id,
          chat_messages!session_id (id)
        `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching sessions for cleanup:", error);
        return;
      }

      if (emptySessions) {
        const emptySessionIds = emptySessions
          .filter(
            (session) =>
              !session.chat_messages || session.chat_messages.length === 0
          )
          .map((session) => session.id);

        if (emptySessionIds.length > 0) {
          console.log(
            `🧹 Cleaning up ${emptySessionIds.length} empty chat sessions`
          );

          const { error: deleteError } = await supabase
            .from("chat_sessions")
            .delete()
            .in("id", emptySessionIds);

          if (deleteError) {
            console.error("Error deleting empty sessions:", deleteError);
          } else {
            console.log("✅ Empty sessions cleaned up successfully");
          }
        }
      }
    } catch (error) {
      console.error("Error in cleanup function:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchSessions = async () => {
        // 🚀 Clean up empty sessions first
        await cleanupEmptySessions();

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
          last_updated,
          chat_messages!session_id (
            content,
            created_at,
            is_from_ai
          )
        `
          )
          .eq("user_id", user.id)
          .order("last_updated", { ascending: false }); // ✅ Order by last_updated

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
              title: session.title || "New Chat",
              lastMessage: lastMsg,
              createdAt: session.created_at,
              lastUpdated: session.last_updated || session.created_at, // ✅ Use last_updated
              messageCount: messages.length, // ✅ Track message count
            };
          });

          // ✅ Filter out sessions that still have no messages (extra safety)
          const validSessions = sessionsWithPreview.filter(
            (session) => session.messageCount > 0
          );
          setSessions(validSessions);
        } else {
          console.error("Error loading chat sessions:", error);
        }
      };

      fetchSessions();
    }, [])
  );

  const handleNewSession = () => {
    navigation.push("Chat", { sessionId: null }); // No DB entry yet - will be created on first message
  };

  const handleOpenSession = (sessionId) => {
    navigation.push("Chat", { sessionId });
  };

  const handleDeleteSession = (sessionId) => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete all messages first
              await supabase
                .from("chat_messages")
                .delete()
                .eq("session_id", sessionId);

              // Then delete the session
              const { error } = await supabase
                .from("chat_sessions")
                .delete()
                .eq("id", sessionId);

              if (error) {
                console.error("Delete error:", error);
                Alert.alert(
                  "Error",
                  "Failed to delete chat. Please try again."
                );
              } else {
                // Update local state
                setSessions((prev) =>
                  prev.filter((session) => session.id !== sessionId)
                );
              }
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Failed to delete chat. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // ✅ Helper function to format time
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const renderSession = ({ item }) => {
    const renderRightActions = () => (
      <TouchableOpacity
        style={styles.swipeDelete}
        onPress={() => handleDeleteSession(item.id)}
      >
        <Ionicons name="trash" size={24} color={colors.background} />
        <Text style={styles.swipeText}>Delete</Text>
      </TouchableOpacity>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity
          style={styles.sessionItem}
          onPress={() => handleOpenSession(item.id)}
        >
          <View style={styles.sessionHeader}>
            <Text style={styles.sessionTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.sessionTime}>
              {formatTimeAgo(item.lastUpdated)}
            </Text>
          </View>
          <Text style={styles.sessionPreview} numberOfLines={2}>
            {item.lastMessage}
          </Text>
          {item.messageCount > 0 && (
            <View style={styles.sessionFooter}>
              <Text style={styles.messageCount}>
                {item.messageCount} message{item.messageCount !== 1 ? "s" : ""}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Your Chester Chats</Text>

        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSession}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={48}
                  color={colors.textTertiary}
                />
              </View>
              <Text style={styles.emptyTitle}>No conversations yet</Text>
              <Text style={styles.emptySubtitle}>
                Start a chat with Chester to begin your reflection journey
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleNewSession}
          disabled={creating}
        >
          <Ionicons
            name="chatbubble-ellipses"
            size={28}
            color={colors.background}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 🎨 UPDATED STYLES WITH APPLE DESIGN SYSTEM
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  header: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    fontWeight: "700",
    marginBottom: spacing.xl,
  },

  listContent: {
    paddingBottom: 100, // Space for floating button and tab bar
  },

  sessionItem: {
    ...cardStyles.withMaroonBorder,
    marginBottom: spacing.md,
  },

  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },

  sessionTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    fontWeight: "600",
    flex: 1,
    marginRight: spacing.md,
  },

  sessionTime: {
    ...typography.caption1,
    color: colors.textTertiary,
    fontWeight: "500",
  },

  sessionPreview: {
    ...typography.subheadline,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },

  sessionFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  messageCount: {
    ...typography.caption2,
    color: colors.textTertiary,
    fontWeight: "500",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl * 2,
    paddingHorizontal: spacing.xl,
  },

  emptyIcon: {
    marginBottom: spacing.xl,
  },

  emptyTitle: {
    ...typography.title3,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },

  emptySubtitle: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: "center",
    lineHeight: 22,
  },

  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: spacing.xl,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.floating,
  },

  swipeDelete: {
    backgroundColor: colors.systemRed,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },

  swipeText: {
    ...typography.caption1,
    color: colors.background,
    marginTop: spacing.xs,
    fontWeight: "500",
  },
});

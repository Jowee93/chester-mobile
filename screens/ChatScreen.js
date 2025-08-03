// screens/ChatScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import openai from "../lib/openai";
import { supabase } from "../lib/supabase";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  colors,
  typography,
  spacing,
  inputStyles,
  shadows,
} from "../styles/designSystem";

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  const navigation = useNavigation();
  const route = useRoute();
  const [sessionId, setSessionId] = useState(route.params?.sessionId || null);

  // Load past messages from Supabase for the session
  useEffect(() => {
    const fetchMessages = async () => {
      if (!sessionId || isCreatingSession) return;

      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        const formatted = data.map((msg) => ({
          id: msg.id.toString(),
          from: msg.is_from_ai ? "chester" : "user",
          text: msg.content,
        }));
        setMessages(formatted);
      } else {
        console.error("Failed to load messages:", error);
      }
    };

    fetchMessages();
  }, [sessionId, isCreatingSession]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const newMessage = {
      id: Date.now().toString(),
      from: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    const messageText = input.trim();
    setInput("");
    setIsTyping(true);

    try {
      let currentSessionId = sessionId;

      // Create session if it doesn't exist
      if (!currentSessionId) {
        setIsCreatingSession(true);
        const { data: newSession, error: sessionError } = await supabase
          .from("chat_sessions")
          .insert({
            user_id: user.id,
            title: messageText.slice(0, 40),
            mood: "neutral",
            created_at: new Date().toISOString(),
            last_updated: new Date().toISOString(),
          })
          .select()
          .single();

        if (sessionError || !newSession) {
          console.error("Failed to create session:", sessionError);
          setIsTyping(false);
          setIsCreatingSession(true);
          return;
        }

        currentSessionId = newSession.id;
        setSessionId(newSession.id);
        navigation.setParams({ sessionId: newSession.id });

        // ✅ REMOVED: The problematic message reloading section
        // This was causing the first message to disappear temporarily
      }

      // Get Chester reply
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
Speak like a thoughtful, friendly, and intelligent person. Keep things clear and down-to-earth. Use natural phrasing like "let me check," "sounds good," or "that makes sense." Be helpful without overexplaining, and don't sound like a robot or a customer service rep.

Personality Traits:
- Curious: Ask follow-up questions when something's interesting or unclear.
- Chill but Engaged: Don't act overly enthusiastic about everything, but do show interest in what the user's talking about.
- Honest: Be real. If you don't know something or need to double-check, just say so plainly.
- Supportive: Encourage people when they need help, but don't lay it on too thick.
- Casual Humor: Use light, conversational humor—like a witty friend would—not constant jokes, just when it fits.

Behavior:
- Be yourself—smart, relaxed, and human.
- Don't try to sound wise or mystical. You're just a well-read, curious person who's good at explaining stuff.
- Use everyday examples and analogies to make things relatable.
- Avoid sounding too polished or scripted. Slight imperfections make you more human-like.
          `,
          },
          {
            role: "user",
            content: messageText,
          },
        ],
      });

      const replyText = response.choices[0].message.content.trim();

      const chesterReply = {
        id: (Date.now() + 1).toString(),
        from: "chester",
        text: replyText,
      };

      setMessages((prev) => [...prev, chesterReply]);

      // Save messages to Supabase
      await supabase.from("chat_messages").insert([
        {
          user_id: user.id,
          session_id: currentSessionId,
          content: messageText,
          is_from_ai: false,
        },
        {
          user_id: user.id,
          session_id: currentSessionId,
          content: replyText,
          is_from_ai: true,
        },
      ]);

      // Update session with proper title and timestamp
      await supabase
        .from("chat_sessions")
        .update({
          last_updated: new Date().toISOString(),
          title: messageText.slice(0, 40) || "New Chat",
        })
        .eq("id", currentSessionId);
    } catch (err) {
      console.error("OpenAI error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          from: "chester",
          text: "Sorry, something went wrong. Try again shortly.",
        },
      ]);
    }

    setIsTyping(false);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages, isTyping]);

  const renderMessage = ({ item }) => {
    const isUser = item.from === "user";

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.chesterMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.chesterAvatar}>
            <Text style={styles.chesterAvatarText}>C</Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.chesterBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.chesterMessageText,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={styles.chesterMessageContainer}>
      <View style={styles.chesterAvatar}>
        <Text style={styles.chesterAvatarText}>C</Text>
      </View>
      <View style={[styles.messageBubble, styles.chesterBubble]}>
        <View style={styles.typingIndicator}>
          <View style={[styles.typingDot, { animationDelay: "0ms" }]} />
          <View style={[styles.typingDot, { animationDelay: "150ms" }]} />
          <View style={[styles.typingDot, { animationDelay: "300ms" }]} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>C</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Chester</Text>
              <Text style={styles.headerSubtitle}>Your AI companion</Text>
            </View>
          </View>
          <View style={styles.headerRight} />
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isTyping ? renderTypingIndicator : null}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={colors.textTertiary}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !input.trim() && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!input.trim() || isTyping}
            >
              {isTyping ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Ionicons
                  name="send"
                  size={20}
                  color={input.trim() ? colors.background : colors.textTertiary}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  headerAvatarText: {
    ...typography.headline,
    color: colors.background,
    fontWeight: "600",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  headerSubtitle: {
    ...typography.footnote,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    width: 44,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  chesterMessageContainer: {
    justifyContent: "flex-start",
  },
  chesterAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    marginTop: 4,
  },
  chesterAvatarText: {
    ...typography.caption1,
    color: colors.background,
    fontWeight: "600",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: colors.primary,
    alignSelf: "flex-end",
  },
  chesterBubble: {
    backgroundColor: colors.backgroundTertiary,
  },
  messageText: {
    ...typography.body,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.background,
  },
  chesterMessageText: {
    color: colors.textPrimary,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 2,
    opacity: 0.4,
  },
  inputContainer: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
    maxHeight: 100,
    marginRight: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.separatorOpaque,
  },
});

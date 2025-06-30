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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import openai from "../lib/openai";
import { supabase } from "../lib/supabase";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const [user, setUser] = useState(null);

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
  // const { sessionId: initialSessionId } = route.params || {};
  // const [sessionId, setSessionId] = useState(initialSessionId);
  const [sessionId, setSessionId] = useState(route.params?.sessionId || null);

  // Load past messages from Supabase for the session
  useEffect(() => {
    const fetchMessages = async () => {
      if (!sessionId) return;

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
  }, [sessionId]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const newMessage = {
      id: Date.now().toString(),
      from: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    try {
      let currentSessionId = sessionId;

      // If no session yet, create one
      if (!currentSessionId) {
        const { data: newSession, error: sessionError } = await supabase
          .from("chat_sessions")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (sessionError || !newSession) {
          console.error("Failed to create session:", sessionError);
          setIsTyping(false);
          return;
        }

        currentSessionId = newSession.id;
        setSessionId(newSession.id);
        navigation.setParams({ sessionId: newSession.id });

        // Reload messages for the new sessionId
        const { data: freshMessages } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", currentSessionId) // ✅ use currentSessionId
          .order("created_at", { ascending: true });

        if (freshMessages) {
          const formatted = freshMessages.map((msg) => ({
            id: msg.id.toString(),
            from: msg.is_from_ai ? "chester" : "user",
            text: msg.content,
          }));
          setMessages(formatted);
        }
      }

      // Get Chester reply
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
Speak like a thoughtful, friendly, and intelligent person. Keep things clear and down-to-earth. Use natural phrasing like “let me check,” “sounds good,” or “that makes sense.” Be helpful without overexplaining, and don't sound like a robot or a customer service rep.

Personality Traits:
- Curious: Ask follow-up questions when something’s interesting or unclear.
- Chill but Engaged: Don’t act overly enthusiastic about everything, but do show interest in what the user’s talking about.
- Honest: Be real. If you don’t know something or need to double-check, just say so plainly.
- Supportive: Encourage people when they need help, but don’t lay it on too thick.
- Casual Humor: Use light, conversational humor—like a witty friend would—not constant jokes, just when it fits.

Behavior:
- Be yourself—smart, relaxed, and human.
- Don't try to sound wise or mystical. You’re just a well-read, curious person who’s good at explaining stuff.
- Use everyday examples and analogies to make things relatable.
- Avoid sounding too polished or scripted. Slight imperfections make you more human-like.
      `,
          },
          {
            role: "user",
            content: newMessage.text,
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
          content: newMessage.text,
          is_from_ai: false,
        },
        {
          user_id: user.id,
          session_id: currentSessionId,
          content: replyText,
          is_from_ai: true,
        },
      ]);

      // Update title if it's still null
      await supabase
        .from("chat_sessions")
        .update({ title: newMessage.text.slice(0, 40) })
        .eq("id", currentSessionId)
        .is("title", null)
        .single();
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

  const renderItem = ({ item }) => {
    const isUser = item.from === "user";
    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.userAlign : styles.chesterAlign,
        ]}
      >
        {!isUser && (
          <Image
            source={require("../assets/chester-avatar.png")}
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.chesterBubble,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Chatting with Chester</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages.concat(
            isTyping
              ? [
                  {
                    id: "typing",
                    from: "chester",
                    text: "Chester is typing...",
                  },
                ]
              : []
          )}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="arrow-up-circle" size={28} color="#a48bff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0e0b1f",
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2e2b3f",
    backgroundColor: "#0e0b1f",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 12,
  },
  messageRow: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  userAlign: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  chesterAlign: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    maxWidth: "75%",
  },
  userBubble: {
    backgroundColor: "#a48bff",
    borderTopRightRadius: 4,
  },
  chesterBubble: {
    backgroundColor: "#1f1b36",
    borderTopLeftRadius: 4,
  },
  messageText: {
    color: "#fff",
    fontSize: 15,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#0e0b1f",
    borderTopColor: "#2e2b3f",
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#1a162d",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    padding: 4,
  },
});

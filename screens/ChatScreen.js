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
import { useRoute } from "@react-navigation/native";

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const [user, setUser] = useState(null);

  const route = useRoute();
  const { sessionId } = route.params || {};

  // Load past messages from Supabase for the session
  useEffect(() => {
    const fetchMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

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

    if (sessionId) fetchMessages();
  }, [sessionId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      from: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are Chester, a calm and empathetic journaling companion. Speak like a supportive friend. Keep replies concise, warm, and human.",
          },
          {
            role: "user",
            content: input.trim(),
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

      // Save both user and Chester messages to Supabase
      await supabase.from("chat_messages").insert([
        {
          user_id: user.id,
          session_id: sessionId,
          content: newMessage.text,
          is_from_ai: false,
        },
        {
          user_id: user.id,
          session_id: sessionId,
          content: replyText,
          is_from_ai: true,
        },
      ]);
      // ✅ Update session title only if null
      await supabase
        .from("chat_sessions")
        .update({ title: newMessage.text.slice(0, 40) })
        .eq("id", sessionId)
        .is("title", null) // only update if title is null
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

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

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      from: "chester",
      text: "Hi there 👋 How are you feeling today?",
    },
    {
      id: "2",
      from: "user",
      text: "Not great, honestly. Felt really drained after work.",
    },
    {
      id: "3",
      from: "chester",
      text: "Thanks for sharing. Want to tell me more about what happened?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      from: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        from: "chester",
        text: "I'm here with you. Want to reflect on why that might’ve felt so draining?",
      };

      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);

      // 🟣 Scroll to latest after Chester replies
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }, 1200); // Simulated typing delay
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100); // Small delay ensures input bar is rendered first

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
        keyboardVerticalOffset={0}
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

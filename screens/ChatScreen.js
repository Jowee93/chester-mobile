// screens/ChatScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      from: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const renderItem = ({ item }) => {
    const isUser = item.from === "user";
    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.userAlign : styles.chesterAlign,
        ]}
      >
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0b1f",
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  messageRow: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  userAlign: {
    justifyContent: "flex-end",
  },
  chesterAlign: {
    justifyContent: "flex-start",
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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

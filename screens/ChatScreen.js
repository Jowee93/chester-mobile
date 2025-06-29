import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text>Chat with Chester</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0e0b1f",
  },
});

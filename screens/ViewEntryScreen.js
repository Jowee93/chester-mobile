// screens/ViewEntryScreen.js
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewEntryScreen({ route }) {
  const { title, content, username, tags = [] } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0e0b1f" }}>
      <View style={styles.topBar}>
        <Text style={styles.username}>{username || "You"}</Text>
        <Ionicons name="ellipsis-horizontal" size={24} color="#a48bff" />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>

        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 8,
  },
  username: {
    color: "#a48bff",
    fontWeight: "bold",
    fontSize: 16,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
  content: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
  },
  tag: {
    color: "#7a7aff",
    fontSize: 14,
    marginRight: 10,
  },
});

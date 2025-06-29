// screens/ViewEntryScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

export default function ViewEntryScreen() {
  const route = useRoute();
  const { entryId } = route.params;

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("id, content, mood, ai_analysis, ai_reflection, created_at")
        .eq("id", entryId)
        .single();

      if (!error) {
        setEntry(data);
      } else {
        console.error("Failed to load entry:", error);
      }
      setLoading(false);
    };

    fetchEntry();
  }, [entryId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0e0b1f" }}>
      <View style={styles.topBar}>
        <Text style={styles.username}>You</Text>
        <Ionicons name="ellipsis-horizontal" size={24} color="#a48bff" />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color="#a48bff" size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>
            {entry.mood ? `Mood: ${entry.mood}` : "Journal Entry"}
          </Text>
          <Text style={styles.content}>{entry.content}</Text>

          {entry.ai_reflection && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AI Reflection</Text>
              <Text style={styles.sectionText}>{entry.ai_reflection}</Text>
            </View>
          )}

          {entry.ai_analysis && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AI Analysis</Text>
              <Text style={styles.sectionText}>{entry.ai_analysis}</Text>
            </View>
          )}
        </ScrollView>
      )}
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: "#7a7aff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  sectionText: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 22,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

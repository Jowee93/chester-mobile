import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [entries, setEntries] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchEntries = async () => {
        const { data, error } = await supabase
          .from("journal_entries")
          .select("id, title, content, created_at")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setEntries(data);
        } else {
          console.error("Failed to fetch entries:", error);
        }
      };

      fetchEntries();
    }, [])
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Journal</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{entries.length}</Text>
            <Text style={styles.statLabel}>Entry This Year</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>--</Text>
            <Text style={styles.statLabel}>Words Written</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>--</Text>
            <Text style={styles.statLabel}>Day Journaled</Text>
          </View>
        </View>

        <Text style={styles.month}>Recent</Text>

        {entries.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            onPress={() =>
              navigation.navigate("ViewEntry", { entryId: entry.id })
            }
          >
            <View style={styles.card}>
              <Text style={styles.entryTitle} numberOfLines={1}>
                {entry.title || entry.content.slice(0, 20) + "..."}
              </Text>
              <Text style={styles.entryContent} numberOfLines={2}>
                {entry.content}
              </Text>
              <Text style={styles.entryDate}>
                {formatDate(entry.created_at)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e0b1f", padding: 16 },
  title: { color: "white", fontSize: 32, fontWeight: "bold", marginBottom: 12 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: { alignItems: "center" },
  statNumber: { color: "#8fb2ff", fontSize: 18, fontWeight: "bold" },
  statLabel: { color: "white", fontSize: 12 },
  month: { color: "white", fontSize: 18, marginVertical: 10 },
  card: {
    backgroundColor: "#1e1a2d",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  imageGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  image: {
    width: "32%",
    height: 100,
    borderRadius: 12,
  },
  entryTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  entryContent: { color: "white", fontSize: 14, marginBottom: 8 },
  entryDate: { color: "#999", fontSize: 12, textAlign: "left" },
});

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({
    entriesThisYear: 0,
    totalWords: 0,
    daysJournaled: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchEntries = async () => {
        const user = supabase.auth.getUser().data.user;

        const { data, error } = await supabase
          .from("journal_entries")
          .select("id, title, content, created_at")
          .eq("deleted", false)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setEntries(data);

          const currentYear = new Date().getFullYear();
          const words = data.reduce(
            (acc, entry) => acc + entry.content.split(" ").length,
            0
          );
          const uniqueDays = new Set(
            data.map((entry) => new Date(entry.created_at).toDateString())
          );

          const entriesThisYear = data.filter(
            (entry) => new Date(entry.created_at).getFullYear() === currentYear
          ).length;

          setStats({
            entriesThisYear,
            totalWords: words,
            daysJournaled: uniqueDays.size,
          });
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
      <View style={styles.header}>
        <Text style={styles.headerText}>Journal</Text>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ViewEntry", {
                entryId: entry.id,
                editable: true, // Allow edit/delete
                source: "journal", // Identify source table
              })
            }
          >
            <View style={styles.card}>
              <Text style={styles.entryTitle}>{item.title}</Text>
              <Text style={styles.entryContent} numberOfLines={2}>
                {item.content}
              </Text>
              <Text style={styles.entryDate}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.entriesThisYear}</Text>
              <Text style={styles.statLabel}>Entry This Year</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.totalWords}</Text>
              <Text style={styles.statLabel}>Words Written</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.daysJournaled}</Text>
              <Text style={styles.statLabel}>Day Journaled</Text>
            </View>
          </View>
        }
      />
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
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
    backgroundColor: "#0e0b1f",
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});

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
import { colors, typography, spacing } from "../styles/designSystem";

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
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("User fetch error:", userError);
          return;
        }

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
        {/* <Text style={{ fontFamily: "Nunito", fontSize: 25 }}>Journal</Text> */}
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ViewEntry", {
                entryId: item.id,
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

// 🎨 UPDATED STYLES WITH APPLE DESIGN SYSTEM
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },

  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    alignItems: "center",
    backgroundColor: colors.background,
  },

  headerText: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    fontWeight: "700",
  },

  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100, // Space for tab bar
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },

  statBox: {
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    flex: 1,
    marginHorizontal: spacing.xs,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  statNumber: {
    ...typography.title2,
    color: colors.primary,
    fontWeight: "700",
  },

  statLabel: {
    ...typography.caption1,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: "500",
    textAlign: "center",
  },

  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },

  entryTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },

  entryContent: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },

  entryDate: {
    ...typography.caption1,
    color: colors.textTertiary,
    fontWeight: "500",
  },
});

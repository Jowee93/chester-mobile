// screens/InsightsScreen.js
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../lib/supabase";

export default function InsightsScreen() {
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    entries: 0,
    daysReflected: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data?.session?.user || null;
      setUser(currentUser);
      if (currentUser) fetchStats(currentUser.id);
    });
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Logout failed", error.message);
  };

  const fetchStats = async (userId) => {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("created_at")
      .eq("user_id", userId)
      .eq("deleted", false);

    if (error || !data) return;

    const entries = data.length;

    const uniqueDays = new Set(
      data.map((entry) => new Date(entry.created_at).toDateString())
    );

    // Calculate longest streak (optional basic logic)
    const sortedDates = [...uniqueDays]
      .map((d) => new Date(d))
      .sort((a, b) => a - b);
    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const diff =
        (sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak += 1;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    setStats({
      entries,
      daysReflected: uniqueDays.size,
      longestStreak,
    });
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Your Profile</Text>

        {/* Avatar + Name */}
        <View style={styles.profileSection}>
          <Image
            source={require("../assets/chester-avatar.png")}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.email || "Anonymous User"}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.entries}</Text>
            <Text style={styles.statLabel}>Entries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.daysReflected}</Text>
            <Text style={styles.statLabel}>Days Reflected</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.longestStreak}</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
        </View>

        {/* Personality Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🧠 Personality Profile</Text>
          <Text style={styles.sectionText}>
            Coming soon: Your journaling style and self-reflection personality.
          </Text>
        </View>

        {/* Emotional Patterns Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📊 Emotional Patterns</Text>
          <Text style={styles.sectionText}>
            Track your most common moods and emotional triggers over time.
          </Text>
        </View>

        {/* Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚙️ Settings</Text>
          <TouchableOpacity>
            <Text style={styles.settingItem}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.settingItem}>Notification Preferences</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.settingItem}>App Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.settingItem}>About Chester</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.settingItem}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0e0b1f",
  },
  container: {
    padding: 20,
    backgroundColor: "#0e0b1f",
  },
  header: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: "#1f1b36",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    width: "30%",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#a48bff",
  },
  statLabel: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: "#1a162d",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  sectionText: {
    color: "#aaa",
    fontSize: 14,
  },
  settingItem: {
    color: "#a48bff",
    fontSize: 14,
    marginTop: 10,
  },
});

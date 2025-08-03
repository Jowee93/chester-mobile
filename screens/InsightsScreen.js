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
import {
  colors,
  typography,
  spacing,
  cardStyles,
  buttonStyles,
} from "../styles/designSystem";

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

  const getUserInitials = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Your Profile</Text>

        {/* Avatar + Name */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getUserInitials()}</Text>
          </View>
          <Text style={styles.name}>{user?.email}</Text>
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
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingItemText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingItemText}>Notification Preferences</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingItemText}>App Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingItemText}>About Chester</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 🎨 UPDATED STYLES WITH APPLE DESIGN SYSTEM
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  header: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    textAlign: "center",
  },

  profileSection: {
    alignItems: "center",
    marginBottom: spacing.xxxl,
  },

  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  avatarText: {
    ...typography.title2,
    color: colors.background,
    fontWeight: "700",
  },

  name: {
    ...typography.headline,
    color: colors.textPrimary,
    fontWeight: "600",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xxxl,
    gap: spacing.md,
  },

  statCard: {
    flex: 1,
    ...cardStyles.standard,
    alignItems: "center",
    paddingVertical: spacing.lg,
  },

  statValue: {
    ...typography.title2,
    color: colors.primary,
    fontWeight: "700",
  },

  statLabel: {
    ...typography.caption1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: "500",
    textAlign: "center",
  },

  sectionCard: {
    ...cardStyles.standard,
    marginBottom: spacing.xl,
  },

  sectionTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },

  sectionText: {
    ...typography.subheadline,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  settingItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },

  settingItemText: {
    ...typography.body,
    color: colors.textPrimary,
  },

  logoutButton: {
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },

  logoutText: {
    ...typography.body,
    color: colors.systemRed,
    fontWeight: "500",
  },
});

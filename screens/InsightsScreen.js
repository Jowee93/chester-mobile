// screens/InsightsScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

export default function InsightsScreen() {
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
          <Text style={styles.name}>Anonymous User</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Entries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Days Reflected</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>7</Text>
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
          <TouchableOpacity>
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

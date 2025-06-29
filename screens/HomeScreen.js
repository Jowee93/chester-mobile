import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { TouchableOpacity } from "react-native"; // Add this if not already

const dummyEntries = [
  {
    id: "1",
    title: "A day for pasta",
    content:
      "Queued 1 hour to enter this pasta bar near amoy street. Was really good but kinda bummer that there are no meat",
    date: "Sunday, 15 Jun",
    images: [
      require("../assets/icon.png"),
      require("../assets/icon.png"),
      require("../assets/icon.png"),
    ],
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Journal</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Entry This Year</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>26</Text>
          <Text style={styles.statLabel}>Words Written</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>Day Journaled</Text>
        </View>
      </View>

      <Text style={styles.month}>June</Text>

      {dummyEntries.map((entry) => (
        <TouchableOpacity
          key={entry.id}
          onPress={() =>
            navigation.navigate("NewEntry", {
              editable: false,
              title: entry.title,
              content: entry.content,
              images: entry.images,
            })
          }
        >
          <View style={styles.card}>
            <View style={styles.imageGrid}>
              {entry.images.map((img, index) => (
                <Image key={index} source={img} style={styles.image} />
              ))}
            </View>
            <Text style={styles.entryTitle}>{entry.title}</Text>
            <Text style={styles.entryContent}>{entry.content}</Text>
            <Text style={styles.entryDate}>{entry.date}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
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

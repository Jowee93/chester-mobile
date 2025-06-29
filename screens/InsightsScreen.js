import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function InsightsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Insights Screen</Text>
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
  text: {
    color: "white",
    fontSize: 18,
  },
});

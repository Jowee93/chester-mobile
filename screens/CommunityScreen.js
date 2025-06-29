import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const dummyCommunityPosts = [
  {
    id: "1",
    username: "@mindful_fox",
    tags: ["#burnout", "#career"],
    title: "Feeling empty after work",
    content:
      "I hit every goal but still feel drained. I thought I would be happy...",
  },
  {
    id: "2",
    username: "@calmkoala",
    tags: ["#breakup", "#healing"],
    title: "Day 14 of letting go",
    content: "Each morning is lighter. Journaling helps me stay grounded...",
  },
  {
    id: "3",
    username: "@latebloomer",
    tags: ["#purpose", "#stuck"],
    title: "Quarter-life pause",
    content:
      "I’m not sure what I’m working toward anymore. Everything feels slow.",
  },
];

export default function CommunityScreen() {
  const navigation = useNavigation();
  const [resonated, setResonated] = useState({});

  const toggleResonate = (id) => {
    setResonated((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          navigation.navigate("NewEntry", {
            editable: false,
            title: item.title,
            content: item.content,
            images: [],
          })
        }
      >
        <View style={styles.header}>
          <Text style={styles.username}>{item.username}</Text>
          <Ionicons name="ellipsis-horizontal" size={20} color="#888" />
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>

        <View style={styles.footer}>
          <View style={styles.tags}>
            {item.tags.map((tag, idx) => (
              <Text key={idx} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => toggleResonate(item.id)}
            style={styles.resonateBtn}
          >
            <Ionicons
              name={resonated[item.id] ? "heart" : "heart-outline"}
              size={24}
              color={resonated[item.id] ? "#ff7da0" : "#a48bff"}
            />
            <Text style={styles.resonateText}>Resonate</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={dummyCommunityPosts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToAlignment="start"
      decelerationRate="fast"
      getItemLayout={(data, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
    />
  );
}

const styles = StyleSheet.create({
  postContainer: {
    height,
    width,
    padding: 24,
    backgroundColor: "#0e0b1f",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  username: {
    color: "#a48bff",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 40,
  },
  content: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 12,
  },
  footer: {
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: "70%",
  },
  tag: {
    color: "#7a7aff",
    fontSize: 12,
    marginRight: 8,
  },
  resonateBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  resonateText: {
    color: "#a48bff",
    marginLeft: 6,
    fontSize: 14,
  },
});

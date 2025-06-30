// screens/CommunityScreen.js
import React, { useState, useEffect } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

const { height, width } = Dimensions.get("window");

export default function CommunityScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [resonated, setResonated] = useState({});

  useEffect(() => {
    const fetchCommunityPosts = async () => {
      const { data, error } = await supabase
        .from("community_entries")
        .select("id, content, mood, demographics, supports, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const postsWithType = [...data, { id: "end", type: "end" }];
        setPosts(postsWithType);
      } else {
        console.error("Failed to fetch community posts:", error);
      }
    };

    fetchCommunityPosts();
  }, []);

  const toggleResonate = async (id) => {
    setResonated((prev) => ({ ...prev, [id]: !prev[id] }));
    await supabase.rpc("increment_supports", { post_id: id });
  };

  const renderItem = ({ item }) => {
    if (item.type === "end") {
      return (
        <View style={styles.postContainer}>
          <View style={styles.card}>
            <Text style={styles.endText}>
              ✨ That’s all the posts for today ✨
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.postContainer}>
        <View style={styles.card}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() =>
              navigation.navigate("ViewEntry", {
                entryId: item.id,
                source: "community",
                editable: false, // 👈 force read-only mode for community posts
              })
            }
          >
            <View style={styles.header}>
              <Text style={styles.username}>Anonymous</Text>
              <Ionicons name="ellipsis-horizontal" size={20} color="#888" />
            </View>

            <Text style={styles.title}>{item.title || item.mood}</Text>

            <Text style={styles.content}>{item.content}</Text>

            <View style={styles.footer}>
              <View style={styles.tags}>
                <Text style={styles.tag}>{item.demographics}</Text>
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
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0e0b1f" }}>
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Community</Text>
      </View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 20,
    alignItems: "center",
  },

  card: {
    backgroundColor: "#1a162d",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  headerBar: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 4,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
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
    marginBottom: 12,
  },
  content: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 20,
  },
  footer: {
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
  endText: {
    color: "#aaa",
    fontSize: 18,
    textAlign: "center",
  },
});

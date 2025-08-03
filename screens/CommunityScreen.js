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
import {
  colors,
  typography,
  spacing,
  cardStyles,
  shadows,
} from "../styles/designSystem";

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
              ✨ That's all the posts for today ✨
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
              <Ionicons
                name="ellipsis-horizontal"
                size={20}
                color={colors.textTertiary}
              />
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
                  color={resonated[item.id] ? colors.systemRed : colors.primary}
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Community</Text>
      </View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

// 🎨 UPDATED STYLES WITH APPLE DESIGN SYSTEM
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerBar: {
    alignItems: "center",
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },

  headerText: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    fontWeight: "700",
  },

  listContent: {
    paddingBottom: 100, // Space for tab bar
  },

  postContainer: {
    width: "100%",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
    alignItems: "center",
  },

  card: {
    ...cardStyles.withMaroonBorder,
    width: "100%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  username: {
    ...typography.subheadline,
    color: colors.primary,
    fontWeight: "600",
  },

  title: {
    ...typography.headline,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },

  content: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
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
    ...typography.caption1,
    color: colors.primary,
    fontWeight: "500",
    marginRight: spacing.sm,
  },

  resonateBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.backgroundTertiary,
  },

  resonateText: {
    ...typography.subheadline,
    color: colors.primary,
    marginLeft: spacing.sm,
    fontWeight: "500",
  },

  endText: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: "center",
    fontStyle: "italic",
  },
});

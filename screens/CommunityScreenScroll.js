// screens/CommunityScreenScroll.js
import React, { useState, useEffect, useRef } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../lib/supabase";
import {
  colors,
  typography,
  spacing,
  cardStyles,
  shadows,
} from "../styles/designSystem";

const { height, width } = Dimensions.get("window");

// Gradient themes for posts
const gradientThemes = [
  ["#8B1538", "#A91B47"], // Chester's maroon
  ["#667eea", "#764ba2"], // Blue purple
  ["#f093fb", "#f5576c"], // Pink
  ["#4facfe", "#00f2fe"], // Blue cyan
  ["#43e97b", "#38f9d7"], // Green
  ["#fa709a", "#fee140"], // Pink yellow
  ["#a8edea", "#fed6e3"], // Mint pink
  ["#ffecd2", "#fcb69f"], // Peach
];

export default function CommunityScreenScroll({ onToggleView }) {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [resonated, setResonated] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchCommunityPosts();
  }, []);

  const fetchCommunityPosts = async () => {
    const { data, error } = await supabase
      .from("community_entries")
      .select("id, content, mood, demographics, supports, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Add gradient theme to each post
      const postsWithThemes = data.map((post, index) => ({
        ...post,
        gradientTheme: gradientThemes[index % gradientThemes.length],
      }));
      setPosts(postsWithThemes);
    } else {
      console.error("Failed to fetch community posts:", error);
    }
  };

  const toggleResonate = async (id) => {
    const newResonated = { ...resonated, [id]: !resonated[id] };
    setResonated(newResonated);

    // Update posts count locally for immediate feedback
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id
          ? { ...post, supports: post.supports + (newResonated[id] ? 1 : -1) }
          : post
      )
    );

    // Update in database
    if (newResonated[id]) {
      await supabase.rpc("increment_supports", { post_id: id });
    }
  };

  const handleDoubleTap = (postId) => {
    toggleResonate(postId);
    // Could add floating heart animation here
  };

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderPost = ({ item, index }) => {
    return (
      <View style={styles.postContainer}>
        <LinearGradient
          colors={item.gradientTheme}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Overlay for better text readability */}
          <View style={styles.overlay} />

          {/* Main Content Area */}
          <TouchableOpacity
            style={styles.contentArea}
            activeOpacity={1}
            onPress={() => {
              // Single tap - could pause/play if video content
            }}
            onLongPress={() => handleDoubleTap(item.id)}
          >
            {/* Content Display */}
            <View style={styles.contentDisplay}>
              <View style={styles.contentCard}>
                <View style={styles.contentHeader}>
                  <Text style={styles.postContent}>{item.content}</Text>
                  <View style={styles.moodBadge}>
                    <Text style={styles.moodText}>{item.mood}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Right Sidebar - Only Resonate */}
          <View style={styles.sidebar}>
            {/* User Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.demographics?.charAt(0) || "A"}
                </Text>
              </View>
            </View>

            {/* Resonate Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleResonate(item.id)}
            >
              <Ionicons
                name={resonated[item.id] ? "heart" : "heart-outline"}
                size={32}
                color={
                  resonated[item.id] ? colors.systemRed : colors.background
                }
              />
              <Text style={styles.actionCount}>
                {item.supports > 0 ? item.supports : ""}
              </Text>
            </TouchableOpacity>

            {/* View Details Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                navigation.navigate("ViewEntry", {
                  entryId: item.id,
                  source: "community",
                  editable: false,
                })
              }
            >
              <Ionicons
                name="document-text-outline"
                size={30}
                color={colors.background}
              />
            </TouchableOpacity>
          </View>

          {/* Bottom Info */}
          <View style={styles.bottomInfo}>
            <View style={styles.userInfo}>
              <Text style={styles.username}>@anonymous</Text>
              <Text style={styles.demographics}>{item.demographics}</Text>
              <Text style={styles.caption} numberOfLines={2}>
                {item.content}
              </Text>

              {/* Hashtags */}
              <View style={styles.hashtags}>
                <Text style={styles.hashtag}>#reflection</Text>
                <Text style={styles.hashtag}>#chester</Text>
                <Text style={styles.hashtag}>#anonymous</Text>
              </View>
            </View>

            {/* Sound/Music Info */}
            <View style={styles.soundInfo}>
              <View style={styles.soundIcon}>
                <Ionicons
                  name="musical-notes"
                  size={12}
                  color={colors.background}
                />
              </View>
              <Text style={styles.soundText}>
                Chester Community • Original Audio
              </Text>
            </View>
          </View>

          {/* Remove progress dots - commented out */}
          {/* <View style={styles.progressContainer}>
            {posts.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.progressDot,
                  dotIndex === index && styles.progressDotActive,
                ]}
              />
            ))}
          </View> */}
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with consistent styling */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>

        <TouchableOpacity
          style={styles.toggleBackButton}
          onPress={onToggleView}
        >
          <Ionicons name="grid-outline" size={16} color={colors.background} />
          <Text style={styles.toggleBackText}>List View</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Feed with proper spacing */}
      <View style={styles.feedContainer}>
        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={height - 100} // Account for header
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: height - 100,
            offset: (height - 100) * index,
            index,
          })}
        />
      </View>

      {/* Remove floating add button */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
    zIndex: 100,
  },

  headerTitle: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    fontWeight: "700",
  },

  toggleBackButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.sm,
  },

  toggleBackText: {
    ...typography.caption1,
    color: colors.background,
    fontWeight: "600",
  },

  feedContainer: {
    flex: 1,
  },

  postContainer: {
    height: height - 100, // Account for header
    width: width,
  },

  gradient: {
    flex: 1,
    position: "relative",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  contentArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },

  contentDisplay: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: spacing.lg,
  },

  contentCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 320, // Fixed width for consistency
    ...shadows.floating,
  },

  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
  },

  postContent: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
    flex: 1,
  },

  moodBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    minWidth: 50,
    alignItems: "center",
  },

  moodText: {
    ...typography.caption1,
    color: colors.background,
    fontWeight: "600",
    fontSize: 16,
  },

  sidebar: {
    position: "absolute",
    right: spacing.lg,
    bottom: 120,
    alignItems: "center",
    gap: spacing.lg,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },

  avatarText: {
    ...typography.headline,
    color: colors.primary,
    fontWeight: "600",
  },

  followBtn: {
    position: "absolute",
    bottom: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.systemRed,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },

  actionButton: {
    alignItems: "center",
    gap: spacing.xs,
  },

  actionCount: {
    ...typography.caption1,
    color: colors.background,
    fontWeight: "600",
  },

  bottomInfo: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + 50, // Account for tab bar
  },

  userInfo: {
    marginBottom: spacing.md,
  },

  username: {
    ...typography.headline,
    color: colors.background,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },

  demographics: {
    ...typography.subheadline,
    color: "rgba(255,255,255,0.8)",
    marginBottom: spacing.sm,
  },

  caption: {
    ...typography.body,
    color: colors.background,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },

  hashtags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  hashtag: {
    ...typography.subheadline,
    color: "#70a5ff",
    fontWeight: "500",
  },

  soundInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  soundIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },

  soundText: {
    ...typography.caption1,
    color: "rgba(255,255,255,0.8)",
  },

  progressContainer: {
    position: "absolute",
    right: spacing.xs,
    top: "50%",
    transform: [{ translateY: -50 }],
    alignItems: "center",
    gap: spacing.xs,
  },

  progressDot: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  progressDotActive: {
    backgroundColor: colors.background,
  },

  floatingAddButton: {
    position: "absolute",
    bottom: 120,
    left: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.floating,
  },
});

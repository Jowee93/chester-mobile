import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import {
  colors,
  typography,
  spacing,
  buttonStyles,
  inputStyles,
  shadows,
} from "../styles/designSystem";

export default function NewEntryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  const [title, setTitle] = useState(route.params?.title || "");
  const [content, setContent] = useState(route.params?.content || "");
  const [images, setImages] = useState(route.params?.images || []);

  // Safe fallback for route.params
  const isEditable =
    route.params?.editable !== false || route.params === undefined;

  const handleSave = async () => {
    if (!content.trim()) return;

    if (!user) {
      Alert.alert("User not found", "Please log in again.");
      return;
    }

    const entry = {
      user_id: user.id,
      title,
      content,
      mood: "neutral",
      created_at: new Date().toISOString(),
      deleted: false,
    };

    console.log("Saving entry:", { entry, routeParams: route.params });

    let error;

    if (route.params?.entryId) {
      // UPDATE
      const { error: updateError } = await supabase
        .from("journal_entries")
        .update(entry)
        .eq("id", route.params.entryId);
      error = updateError;
    } else {
      // INSERT
      const { error: insertError } = await supabase
        .from("journal_entries")
        .insert([entry]);
      error = insertError;
    }

    if (error) {
      console.error("Save failed", error);
      Alert.alert("Failed to save entry", error.message);
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Failed to get user", error);
      } else {
        setUser(data?.user);
      }
    };
    fetchUser();
  }, []);

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
            <Text style={styles.dateText}>{getCurrentDate()}</Text>
            <View style={styles.topRight}>
              {isEditable ? (
                <TouchableOpacity onPress={handleSave}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>
          </View>

          {/* Main Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title Input */}
            <TextInput
              style={styles.titleInput}
              placeholder="Entry title (optional)"
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
              editable={isEditable}
              maxLength={100}
            />

            {/* Content Input */}
            <TextInput
              style={styles.contentInput}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textTertiary}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              editable={isEditable}
            />

            {/* Images (if any) */}
            {images.length > 0 && (
              <View style={styles.imagesContainer}>
                {images.map((imageUri, index) => (
                  <Image
                    key={index}
                    source={{ uri: imageUri }}
                    style={styles.image}
                  />
                ))}
              </View>
            )}

            {/* Tools Bar */}
            {isEditable && (
              <View style={styles.toolsBar}>
                <TouchableOpacity style={styles.toolButton}>
                  <Ionicons
                    name="camera"
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolButton}>
                  <Ionicons name="mic" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolButton}>
                  <Ionicons
                    name="happy"
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// 🎨 UPDATED STYLES WITH APPLE DESIGN SYSTEM
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },

  dateText: {
    ...typography.headline,
    color: colors.textPrimary,
    fontWeight: "600",
  },

  topRight: {
    minWidth: 60,
    alignItems: "flex-end",
  },

  saveText: {
    ...typography.headline,
    color: colors.primary,
    fontWeight: "600",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  titleInput: {
    ...typography.title2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },

  contentInput: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
    minHeight: 200,
    textAlignVertical: "top",
    marginBottom: spacing.xl,
  },

  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.xl,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: spacing.md,
    marginBottom: spacing.md,
  },

  toolsBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separator,
  },

  toolButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundTertiary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.lg,
  },
});

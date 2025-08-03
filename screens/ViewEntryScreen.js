// screens/ViewEntryScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import { showMessage } from "react-native-flash-message";
import {
  colors,
  typography,
  spacing,
  cardStyles,
} from "../styles/designSystem";

export default function ViewEntryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { entryId } = route.params;
  const source = route.params?.source || "journal";
  const isEditable = route.params?.editable !== false;

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showActionSheetWithOptions } = useActionSheet();

  useFocusEffect(
    useCallback(() => {
      const fetchEntry = async () => {
        const table =
          source === "community" ? "community_entries" : "journal_entries";

        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("id", entryId)
          .single();

        if (!error) {
          setEntry(data);
        } else {
          console.error("Failed to load entry:", error);
        }

        setLoading(false);
      };

      fetchEntry();
    }, [entryId])
  );

  const handleDelete = async () => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this journal entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("journal_entries")
              .update({ deleted: true })
              .eq("id", entryId);

            if (!error) {
              showMessage({
                message: "Entry deleted",
                type: "success",
              });
              navigation.goBack();
            } else {
              Alert.alert("Error", "Failed to delete entry");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <MenuProvider style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />

        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.username}>
            {source === "community" ? "Anonymous" : "You"}
          </Text>

          {isEditable && entry && (
            <Menu>
              <MenuTrigger
                customStyles={{
                  TriggerTouchableComponent: TouchableOpacity,
                  triggerTouchable: {
                    activeOpacity: 0.6,
                  },
                }}
              >
                <View style={styles.menuButton}>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={24}
                    color={colors.textSecondary}
                  />
                </View>
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    backgroundColor: colors.cardBackground,
                    borderRadius: 12,
                    paddingVertical: spacing.sm,
                    shadowColor: colors.textPrimary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 8,
                  },
                }}
              >
                <MenuOption
                  onSelect={() =>
                    navigation.navigate("NewEntry", {
                      editable: true,
                      title: entry.title,
                      content: entry.content,
                      entryId: entry.id,
                    })
                  }
                >
                  <Text style={styles.menuOption}>Edit</Text>
                </MenuOption>
                <MenuOption onSelect={handleDelete}>
                  <Text style={[styles.menuOption, styles.deleteOption]}>
                    Delete
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          )}

          {/* Spacer for non-editable entries */}
          {!isEditable && <View style={styles.menuButton} />}
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {entry.title && <Text style={styles.title}>{entry.title}</Text>}
            <Text style={styles.content}>{entry.content}</Text>

            {entry.mood && (
              <View style={styles.tagContainer}>
                <Text style={styles.tag}>{entry.mood}</Text>
              </View>
            )}

            {entry.demographics && (
              <View style={styles.tagContainer}>
                <Text style={styles.tag}>{entry.demographics}</Text>
              </View>
            )}

            {entry.ai_reflection && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Reflection</Text>
                <Text style={styles.sectionText}>{entry.ai_reflection}</Text>
              </View>
            )}

            {entry.ai_analysis && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Analysis</Text>
                <Text style={styles.sectionText}>{entry.ai_analysis}</Text>
              </View>
            )}
          </ScrollView>
        )}
      </MenuProvider>
    </SafeAreaView>
  );
}

// 🔧 FIXED STYLES WITH PROPER SAFE AREA HANDLING
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
    // Remove any paddingTop you might have here
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  username: {
    ...typography.headline,
    color: colors.primary,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },

  menuButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  menuOption: {
    ...typography.body,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  deleteOption: {
    color: colors.systemRed,
  },

  contentContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingBottom: 120, // 🚀 FIXED: More space for tab bar and safe area
  },

  title: {
    ...typography.title1,
    color: colors.textPrimary,
    fontWeight: "700",
    marginBottom: spacing.lg,
  },

  content: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },

  tagContainer: {
    marginBottom: spacing.md,
  },

  tag: {
    ...typography.subheadline,
    color: colors.primary,
    backgroundColor: colors.maroonSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    alignSelf: "flex-start",
    fontWeight: "500",
  },

  section: {
    ...cardStyles.standard,
    marginBottom: spacing.xl,
  },

  sectionTitle: {
    ...typography.headline,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },

  sectionText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

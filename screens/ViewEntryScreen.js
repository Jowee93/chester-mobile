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

  return (
    <MenuProvider style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0e0b1f" }}>
        <View style={styles.topBar}>
          <Text style={styles.username}>You</Text>
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
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color="#a48bff"
                />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: { backgroundColor: "#1a162d" },
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
                  <Text style={{ color: "white", padding: 10 }}>Edit</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    Alert.alert(
                      "Delete Entry",
                      "Are you sure you want to delete this journal entry?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: async () => {
                            console.log("Confirmed delete");
                            const { error } = await supabase
                              .from("journal_entries")
                              .update({ deleted: true })
                              .eq("id", entry.id);

                            if (!error) {
                              showMessage({
                                message: "Entry deleted",
                                type: "success",
                              });
                              setTimeout(() => {
                                navigation.goBack();
                              }, 500);
                            } else {
                              console.error("Delete failed:", error);
                            }
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text style={{ color: "red", padding: 10 }}>Delete</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          )}
        </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator color="#a48bff" size="large" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {entry.title && <Text style={styles.title}>{entry.title}</Text>}
            <Text style={styles.content}>{entry.content}</Text>
            {entry.mood && <Text style={styles.tag}>{entry.mood}</Text>}
            {entry.demographics && (
              <Text style={styles.tag}>{entry.demographics}</Text>
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
      </SafeAreaView>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 8,
  },
  username: {
    color: "#a48bff",
    fontWeight: "bold",
    fontSize: 16,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
  content: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: "#7a7aff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  sectionText: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 22,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

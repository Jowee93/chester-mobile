// screens/NewEntryScreen.js
import React, { useState } from "react";
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

export default function NewEntryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const isEditable = route.params?.editable !== false;

  const [title, setTitle] = useState(route.params?.title || "");
  const [content, setContent] = useState(route.params?.content || "");
  const [images, setImages] = useState(route.params?.images || []);

  const handleSave = async () => {
    if (!content.trim()) return;

    const entry = {
      user_id: supabase.auth.getUser().data.user.id,
      title,
      content,
      mood: "neutral",
      created_at: new Date().toISOString(),
      deleted: false,
    };

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
    } else {
      navigation.goBack();
    }
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
              <Ionicons name="chevron-back-outline" size={24} color="#a48bff" />
            </TouchableOpacity>
            <Text style={styles.dateText}>Sunday, 29 Jun</Text>
            <View style={styles.topRight}>
              {isEditable ? (
                <>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={24}
                    color="white"
                  />
                  <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.doneText}>Done</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    navigation.replace("NewEntry", {
                      editable: true,
                      title,
                      content,
                      images,
                    })
                  }
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={24}
                    color="#a48bff"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
            {images.length > 0 && (
              <View style={styles.imageGrid}>
                {images.map((img, idx) => (
                  <Image key={idx} source={img} style={styles.image} />
                ))}
              </View>
            )}

            <TextInput
              style={isEditable ? styles.titleInput : styles.titleRead}
              placeholder="Title"
              placeholderTextColor="#aaa"
              value={title}
              onChangeText={setTitle}
              editable={isEditable}
            />

            <TextInput
              style={isEditable ? styles.contentInput : styles.contentRead}
              placeholder="Start writing..."
              placeholderTextColor="#aaa"
              value={content}
              onChangeText={setContent}
              multiline
              editable={isEditable}
              autoFocus={isEditable}
            />
          </ScrollView>

          {isEditable && (
            <View style={styles.toolbar}>
              <Ionicons name="text" size={22} color="#ccc" />
              <Ionicons name="sparkles-outline" size={22} color="#ccc" />
              <Ionicons name="image-outline" size={22} color="#ccc" />
              <Ionicons name="camera-outline" size={22} color="#ccc" />
              <Ionicons name="mic-outline" size={22} color="#ccc" />
              <Ionicons name="location-outline" size={22} color="#ccc" />
              <Ionicons name="flower-outline" size={22} color="#ccc" />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e0b1f" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    justifyContent: "space-between",
  },
  topRight: { flexDirection: "row", alignItems: "center", gap: 16 },
  dateText: { color: "white", fontSize: 16, flex: 1, textAlign: "center" },
  doneText: { color: "#a48bff", marginLeft: 12 },
  scroll: { paddingHorizontal: 16 },
  imageGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  image: {
    width: "30%",
    height: 90,
    borderRadius: 12,
    backgroundColor: "#333",
  },
  titleInput: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
    marginBottom: 8,
  },
  contentInput: {
    fontSize: 16,
    color: "white",
    textAlignVertical: "top",
    paddingBottom: 100,
  },
  titleRead: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
    marginBottom: 8,
  },
  contentRead: {
    fontSize: 16,
    color: "white",
    marginBottom: 100,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    borderTopColor: "#222",
    borderTopWidth: 1,
  },
});

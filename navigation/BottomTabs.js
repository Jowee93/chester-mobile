import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import CommunityScreen from "../screens/CommunityScreen";
import InsightsScreen from "../screens/InsightsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ChatSessionsScreen from "../screens/ChatSessionsScreen"; // ✅ Import ChatSessionsScreen

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          backgroundColor: "#fff",
          borderTopWidth: 0,
          position: "relative",
        },
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Chat") iconName = "chatbubble-ellipses";
          else if (route.name === "Community") iconName = "people";
          else if (route.name === "Profile") iconName = "person-circle-outline"; // ✅ Add this
          return iconName ? (
            <Ionicons
              name={iconName}
              size={24}
              color={focused ? "#000" : "#888"}
            />
          ) : null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatSessionsScreen} />

      <Tab.Screen
        name="FakeButton"
        component={View}
        options={{
          tabBarIcon: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("NewEntry", { editable: true })
              }
              style={styles.floatingButton}
            >
              <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
          ),
        }}
        listeners={{
          tabPress: (e) => e.preventDefault(),
        }}
      />

      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Profile" component={InsightsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    backgroundColor: "#000",
    borderRadius: 35,
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import CommunityScreen from "../screens/CommunityScreen";
import InsightsScreen from "../screens/InsightsScreen";
import NewEntryScreen from "../screens/NewEntryScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 70,
            backgroundColor: "#fff",
            borderTopWidth: 0,
          },
          tabBarIcon: ({ focused }) => {
            let iconName;
            if (route.name === "Home") iconName = "home";
            else if (route.name === "Chat") iconName = "chatbubble-ellipses";
            else if (route.name === "Community") iconName = "people";
            else if (route.name === "Insights") iconName = "bar-chart";
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
        <Tab.Screen name="Chat" component={ChatScreen} />

        <Tab.Screen
          name="NewEntry"
          component={NewEntryScreen}
          options={{
            tabBarIcon: () => (
              <TouchableOpacity style={styles.floatingButton}>
                <Ionicons name="add" size={32} color="#fff" />
              </TouchableOpacity>
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("NewEntry", { editable: true });
            },
          })}
        />

        <Tab.Screen name="Community" component={CommunityScreen} />
        <Tab.Screen name="Insights" component={InsightsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
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

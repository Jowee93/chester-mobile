import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import FlashMessage from "react-native-flash-message";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActionSheetProvider>
        <NavigationContainer>
          <AppNavigator />
          <FlashMessage position="top" />
        </NavigationContainer>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}

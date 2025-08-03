import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./navigation/AppNavigator";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import FlashMessage from "react-native-flash-message";

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "Inter-Regular": require("./assets/fonts/Inter_18pt-Regular.ttf"),
          "Inter-Medium": require("./assets/fonts/Inter_18pt-Medium.ttf"),
          "Inter-SemiBold": require("./assets/fonts/Inter_18pt-SemiBold.ttf"),
          "Inter-Bold": require("./assets/fonts/Inter_18pt-Bold.ttf"),
          Nunito: require("./assets/fonts/Nunito-Regular.ttf"),
        });
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn("Error loading fonts:", error);
        setFontsLoaded(true); // Continue with system fonts
        await SplashScreen.hideAsync();
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

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

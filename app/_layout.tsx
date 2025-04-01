import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import COLORS from "@/utils/colors";
import { windowWidth } from "./(tabs)/offline-mode";
import ToastManager from "toastify-react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ActionSheetProvider>
      <ThemeProvider value={DefaultTheme}>
        <ToastManager
          duration={5000}
          showProgressBar={true}
          position="top"
          animationStyle="upInUpOut"
          style={{ width: windowWidth - 50 }}
        />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.PRIMARY_RED_OFFLINE,
            },
            headerTintColor: COLORS.WHITE,
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerBackButtonDisplayMode: "minimal",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="offline-mode" options={{ headerShown: false }} />
          <Stack.Screen
            name="camera-component"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="edit-component" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ActionSheetProvider>
  );
}

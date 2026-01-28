// App.tsx (raiz)
import React from "react";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";


import RootNavigator from "./src/shared/navigation/RootNavigator";
import { AuthSessionProvider } from "./src/shared/auth/AuthSessionContext";
import { ThemeProvider, useTheme } from "./src/shared/theme/ThemeProvider";
import ScreenBackground from "./src/shared/ui/components/layout/ScreenBackground";

function AppInner() {
  const { theme, themeName } = useTheme();

  const navTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.bg,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };

  return (
    <ScreenBackground>
      <NavigationContainer theme={navTheme}>
        <StatusBar style={themeName === "dark" ? "light" : "dark"} />
        <RootNavigator />
      </NavigationContainer>
    </ScreenBackground>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthSessionProvider>
        <SafeAreaProvider>
          <AppInner />
        </SafeAreaProvider>
      </AuthSessionProvider>
    </ThemeProvider>
  );
}

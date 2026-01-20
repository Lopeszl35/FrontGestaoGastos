// App.tsx (raiz)
import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import RootNavigator from "./src/shared/navigation/RootNavigator";
import { AuthSessionProvider } from "./src/shared/auth/AuthSessionContext";
import { ThemeProvider, useTheme } from "./src/shared/theme/ThemeProvider";

function AppInner() {
  const { themeName } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar style={themeName === "dark" ? "light" : "dark"} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthSessionProvider>
        <AppInner />
      </AuthSessionProvider>
    </ThemeProvider>
  );
}

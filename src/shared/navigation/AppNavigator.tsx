// src/shared/navigation/AppNavigator.tsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import type { AppDrawerParamList } from "../../types/navigation";
import { useTheme } from "../theme/ThemeProvider";

import AppTabsNavigator from "./AppTabsNavigator";
import AppDrawerContent from "./drawer/AppDrawerContent";

const Drawer = createDrawerNavigator<AppDrawerParamList>();

export default function AppNavigator() {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        drawerType: "slide",
        overlayColor: "rgba(0,0,0,0.35)",
        drawerStyle: {
          backgroundColor: theme.colors.surface,
          width: 300,
        },
        drawerContentStyle: {
          backgroundColor: theme.colors.surface,
        },
      }}
      drawerContent={(props) => <AppDrawerContent {...props} />}
    >
      <Drawer.Screen name="Tabs" component={AppTabsNavigator} />
    </Drawer.Navigator>
  );
}

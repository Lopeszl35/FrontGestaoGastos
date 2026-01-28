import React, { useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

import type { AppTabsParamList } from "../../types/navigation";
import { useTheme } from "../theme/ThemeProvider";

import HomeScreen from "../../screens/app/HomeScreen";
import CreditCardsScreen from "../../screens/app/CreditCardsScreen";
import ProfileScreen from "../../screens/app/ProfileScreen";
import DrawerToggleButton from "../ui/components/navigation/DrawerToggleButton";

const Tabs = createBottomTabNavigator<AppTabsParamList>();

export default function AppTabsNavigator() {
  const { theme } = useTheme();

  const commonOptions = useMemo<BottomTabNavigationOptions>(
    () => ({
      sceneStyle: {
      backgroundColor: theme.colors.bg,
      },
      headerTitleStyle: {
        color: theme.colors.text,
        fontWeight: "700",
      },
      headerStyle: {
        backgroundColor: theme.colors.bg,
      },
      headerShadowVisible: false,
      headerRight: () => <DrawerToggleButton />,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        borderTopWidth: 1,
        height: 72,
        paddingTop: 10,
        paddingBottom: 12,
      },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textMuted,
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600",
      },
    }),
    [theme]
  );

  return (
    <Tabs.Navigator screenOptions={commonOptions}>
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="CreditCards"
        component={CreditCardsScreen}
        options={{
          title: "Cartões",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

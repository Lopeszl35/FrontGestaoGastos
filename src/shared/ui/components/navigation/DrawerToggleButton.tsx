import React, { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../../../theme/ThemeProvider";

/**
 * Botão no canto superior direito para abrir/fechar o Drawer.
 * Comportamento intencionalmente simples ("silencioso").
 */
export default function DrawerToggleButton() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const onPress = useCallback(() => {
    const parent = navigation.getParent();
    // Drawer é o parent do TabsNavigator
    if (parent && typeof (parent as any).openDrawer === "function") {
      (parent as any).openDrawer();
      return;
    }
  }, [navigation]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? theme.colors.surfaceAlt : theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Abrir menu"
    >
      <Ionicons name="menu" size={18} color={theme.colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

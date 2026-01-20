import { StyleSheet } from "react-native";
import type { AppTheme } from "../../../shared/theme/themes";

export function makeAuthBrandHeaderStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      marginBottom: 18,
      paddingHorizontal: 6,
    },

    logoBubble: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: theme.colors.surface2,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },

    logo: {
      width: 42,
      height: 42,
      resizeMode: "contain",
    },

    brand: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 10,
    },

    brandBy: {
      color: theme.colors.textMuted,
      fontWeight: "600",
    },

    title: {
      color: theme.colors.text,
      fontSize: 34,
      fontWeight: "800",
      letterSpacing: -0.4,
      marginBottom: 6,
    },

    subtitle: {
      color: theme.colors.textMuted,
      fontSize: 15,
      lineHeight: 20,
    },
  });
}

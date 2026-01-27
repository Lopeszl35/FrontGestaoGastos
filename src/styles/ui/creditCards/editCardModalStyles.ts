// src/styles/ui/creditCards/editCardModalStyles.ts

import { StyleSheet, Dimensions } from "react-native";
import { spacing } from "../../../shared/theme/tokens";

const { height } = Dimensions.get("window");

export const makeEditCardModalStyles = (theme: any) => {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: spacing.md,
    },
    container: {
      width: "100%",
      maxWidth: 380,
      maxHeight: height * 0.85,
    },
    card: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      flex: 1,
    },
    row: {
      flexDirection: "row",
      gap: spacing.md,
    },
    halfInput: {
      flex: 1,
    },
    sectionLabel: {
      fontSize: 14,
      color: theme.colors.textMuted,
      marginTop: spacing.sm,
      marginBottom: spacing.xs,
      fontWeight: "600",
    },
    footer: {
      gap: spacing.sm,
    },
    colorSelector: {
      flexDirection: "row",
      gap: 12,
      marginVertical: spacing.sm,
    },
    colorOption: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: "transparent",
    },
    colorOptionSelected: {
      borderColor: theme.colors.text,
      transform: [{ scale: 1.1 }],
    },
  });
};
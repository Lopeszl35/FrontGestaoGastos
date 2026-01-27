// src/styles/ui/creditCards/deleteCardModalStyles.ts

import { StyleSheet } from "react-native";
import { spacing } from "../../../shared/theme/tokens";

export const makeDeleteCardModalStyles = (theme: any) => {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: spacing.lg,
    },
    container: {
      width: "100%",
      maxWidth: 360,
    },
    card: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: spacing.xl,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    iconContainer: {
      width: 96,
      height: 96,
      borderRadius: 48,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.lg,
      borderWidth: 3,
      borderColor: "rgba(239, 68, 68, 0.3)",
      backgroundColor: `rgba(239, 68, 68, 0.15)`,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: spacing.md,
      color: theme.colors.text,
    },
    cardPreview: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 12,
      marginBottom: spacing.md,
    },
    colorBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    cardName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    message: {
      fontSize: 15,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: spacing.lg,
      color: theme.colors.textMuted,
    },
    warningBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: "rgba(245, 158, 11, 0.10)",
      borderWidth: 1,
      borderColor: "rgba(245, 158, 11, 0.30)",
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.xl,
    },
    warningText: {
      flex: 1,
      fontSize: 13,
      color: theme.colors.warning,
      fontWeight: "500",
    },
    footer: {
      width: "100%",
      flexDirection: "row",
      gap: spacing.md,
      justifyContent: "space-between",
    },
    buttonWrapper: {
      flex: 1,
    },
  });
};
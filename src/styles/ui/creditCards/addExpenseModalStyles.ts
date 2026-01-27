// src/styles/ui/creditCards/addExpenseModalStyles.ts

import { StyleSheet, Dimensions } from "react-native";
import { spacing } from "../../../shared/theme/tokens";

const { height } = Dimensions.get("window");

export const makeAddExpenseModalStyles = (theme: any) => {
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
    },
    subtitle: {
      fontSize: 13,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    sectionLabel: {
      fontSize: 14,
      color: theme.colors.textMuted,
      marginBottom: spacing.xs,
      fontWeight: "600",
    },
    footer: {
      gap: spacing.sm,
    },
    
    // Categorias
    categoriesGrid: {
      flexDirection: "row",
      gap: spacing.sm,
      paddingVertical: spacing.sm,
    },
    categoryOption: {
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "transparent",
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      minWidth: 80,
    },
    categoryOptionSelected: {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderWidth: 2,
    },
    categoryIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    categoryLabel: {
      fontSize: 12,
      fontWeight: "600",
      textAlign: "center",
    },
    
    // Toggle Parcelado
    toggleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      padding: spacing.md,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: spacing.md,
    },
    toggleLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    toggleHelper: {
      fontSize: 13,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    
    // Preview Parcela
    parcelaPreview: {
      fontSize: 14,
      color: theme.colors.success,
      fontWeight: "600",
      textAlign: "right",
      marginTop: -spacing.sm,
      marginBottom: spacing.md,
    },
  });
};
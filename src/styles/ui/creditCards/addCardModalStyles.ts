import { StyleSheet, Dimensions, Platform } from "react-native";
import { spacing } from "../../../shared/theme/tokens";

const { height } = Dimensions.get("window");

export const makeAddCardModalStyles = (theme: any) => {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center", // Centraliza verticalmente
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: spacing.md,
    },
    container: {
      width: "100%",
      maxWidth: 380, // Um pouco mais largo para o formulário caber bem
      maxHeight: height * 0.85, // Limite de altura para telas pequenas
    },
    card: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: spacing.lg,
      // Sombra
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      flex: 1,
    },
    closeButton: {
      padding: spacing.xs,
    },
    scrollViewContent: {
      gap: spacing.md,
      paddingBottom: spacing.md,
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
      marginTop: spacing.lg,
      gap: spacing.sm,
    },
    // Estilo para seleção de cores (opcional, para UX avançada)
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
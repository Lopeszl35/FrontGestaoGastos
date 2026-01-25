import { StyleSheet, Dimensions } from "react-native";
import { AppTheme } from "../../../shared/theme/themes";
import { spacing } from "../../../shared/theme/tokens";

const { width } = Dimensions.get("window");

export const makeConstructionModalStyles = (theme: AppTheme) => {
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
      maxWidth: 340,
    },
    card: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: spacing.xl,
      alignItems: "center",
      // Sombras para dar profundidade
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
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.05)",
      backgroundColor: `${theme.colors.primary}15`,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: spacing.sm,
      color: theme.colors.text,
    },
    message: {
      fontSize: 15,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: spacing.xl,
      color: theme.colors.textMuted,
    },
    buttonContainer: {
      width: "100%",
    },
  });
};
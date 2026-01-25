import { StyleSheet } from "react-native";
import { spacing } from "../../../shared/theme/tokens";

export const makeLogoutModalStyles = (theme: any) => {
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
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.lg,
      borderWidth: 1,
      // Fundo vermelho suave para indicar zona de perigo/atenção
      backgroundColor: "rgba(239, 68, 68, 0.10)", 
      borderColor: "rgba(239, 68, 68, 0.20)",
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
    footer: {
      width: "100%",
      flexDirection: "row",
      gap: spacing.md, // Espaçamento entre os botões
      justifyContent: "space-between",
    },
    buttonWrapper: {
      flex: 1, // Garante que os botões tenham o mesmo tamanho
    },
  });
};
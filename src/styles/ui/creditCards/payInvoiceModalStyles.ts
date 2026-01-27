// src/styles/ui/creditCards/payInvoiceModalStyles.ts

import { StyleSheet } from "react-native";
import { spacing } from "../../../shared/theme/tokens";

export const makePayInvoiceModalStyles = (theme: any) => {
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
      maxWidth: 380,
    },
    card: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: spacing.xl,
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
      marginBottom: spacing.lg,
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
    
    // Valor da Fatura
    faturaContainer: {
      alignItems: "center",
      backgroundColor: "rgba(16, 185, 129, 0.10)",
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      borderRadius: 16,
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: "rgba(16, 185, 129, 0.30)",
    },
    faturaLabel: {
      fontSize: 13,
      color: theme.colors.textMuted,
      marginBottom: spacing.xs,
      fontWeight: "600",
    },
    faturaValor: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.success,
      letterSpacing: -0.5,
    },
    
    // Tipo de Pagamento
    paymentTypeContainer: {
      alignItems: "center",
      marginVertical: spacing.md,
    },
    paymentTypeBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: 12,
      borderWidth: 1.5,
    },
    paymentTypeText: {
      fontSize: 13,
      fontWeight: "bold",
    },
    
    // Barra de Progresso
    progressContainer: {
      marginVertical: spacing.md,
    },
    progressBar: {
      height: 8,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderRadius: 4,
      overflow: "hidden",
      marginBottom: spacing.xs,
    },
    progressFill: {
      height: "100%",
      borderRadius: 4,
    },
    progressText: {
      fontSize: 12,
      color: theme.colors.textMuted,
      textAlign: "right",
      fontWeight: "600",
    },
    
    // Ações Rápidas
    quickActions: {
      flexDirection: "row",
      gap: spacing.sm,
      marginVertical: spacing.md,
    },
    quickActionButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: 10,
      borderWidth: 1.5,
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      alignItems: "center",
    },
    quickActionText: {
      fontSize: 14,
      fontWeight: "bold",
    },
    
    // Alerta
    warningBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: "rgba(59, 130, 246, 0.10)",
      borderWidth: 1,
      borderColor: "rgba(59, 130, 246, 0.30)",
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    warningText: {
      flex: 1,
      fontSize: 13,
      color: theme.colors.info,
      fontWeight: "500",
    },
    
    // Footer
    footer: {
      flexDirection: "row",
      gap: spacing.md,
      justifyContent: "space-between",
    },
    buttonWrapper: {
      flex: 1,
    },
  });
};
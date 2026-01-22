import { StyleSheet } from "react-native";
import type { AppTheme } from "../../../shared/theme/themes";
import { spacing, typography } from "../../../shared/theme/tokens";

export function makeRegisterStyles(theme: AppTheme) {
  const { colors, tokens } = theme;

  return StyleSheet.create({
    kav: { flex: 1 },

    scrollContent: {
      flexGrow: 1,
      padding: spacing.xl,
      paddingBottom: 80,
    },

    header: {
      paddingTop: spacing.xxl,
      paddingBottom: spacing.lg,
    },

    // Barra de progresso VIBRANTE
    progressContainer: {
      marginBottom: spacing.xl,
      gap: spacing.xs,
    },

    progressBar: {
      height: 6,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderRadius: 3,
      overflow: "hidden",
    },

    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 3,
    },

    progressText: {
      color: colors.primary,
      fontSize: typography.size.xs,
      textAlign: "right",
      fontWeight: typography.weight.bold,
    },

    // Card LIMPO
    cardGlow: {
      position: "absolute",
      left: -12,
      right: -12,
      top: -12,
      bottom: -12,
      borderRadius: tokens.radii.xl + 12,
      backgroundColor: "rgba(124, 58, 237, 0.15)",
      opacity: 0.5,
    },

    card: {
      borderRadius: tokens.radii.xl,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.10)",
      backgroundColor: colors.surface,
    },

    cardGradient: {
      borderRadius: tokens.radii.xl,
    },

    cardInner: {
      padding: spacing.xl,
      gap: spacing.lg,
    },

    section: {
      gap: spacing.md,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: typography.size.md,
      fontWeight: typography.weight.bold,
      flex: 1,
    },

    sectionBadge: {
      backgroundColor: "rgba(6, 182, 212, 0.15)",
      color: colors.accent,
      fontSize: typography.size.xs,
      fontWeight: typography.weight.bold,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: 6,
    },

    // Perfil financeiro MODERNO
    profileCards: {
      gap: spacing.sm,
    },

    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      borderWidth: 1.5,
      borderColor: "rgba(255, 255, 255, 0.10)",
      borderRadius: tokens.radii.md,
      padding: spacing.md,
      gap: spacing.md,
    },

    profileCardActive: {
      backgroundColor: "rgba(124, 58, 237, 0.12)",
      borderColor: colors.primary,
      borderWidth: 2,
    },

    profileIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },

    profileLabel: {
      flex: 1,
      color: colors.text,
      fontSize: typography.size.md,
      fontWeight: typography.weight.medium,
    },

    profileCheck: {
      width: 24,
      height: 24,
    },

    helper: {
      color: colors.textMuted,
      fontSize: typography.size.xs,
      lineHeight: 18,
      marginTop: spacing.xs,
    },

    errorBox: {
      backgroundColor: "rgba(239, 68, 68, 0.10)",
      borderWidth: 1,
      borderColor: "rgba(239, 68, 68, 0.30)",
      borderRadius: tokens.radii.md,
      padding: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },

    formError: {
      color: colors.danger,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
      flex: 1,
    },

    buttonContainer: {
      marginTop: spacing.sm,
    },

    backContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: spacing.md,
    },

    backText: {
      color: colors.textMuted,
      fontSize: typography.size.sm,
    },

    label: {
      color: colors.textMuted,
      fontSize: typography.size.sm,
      marginBottom: spacing.xs,
      fontWeight: typography.weight.medium,
    },

    pickerWrap: {
      borderRadius: tokens.radii.md,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.10)",
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      overflow: "hidden",
    },

    picker: {
      color: colors.text,
      backgroundColor: "transparent",
    },
  });
}

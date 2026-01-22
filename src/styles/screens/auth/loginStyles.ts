import { StyleSheet, Dimensions } from "react-native";
import type { AppTheme } from "../../../shared/theme/themes";
import { spacing, typography } from "../../../shared/theme/tokens";

export function makeLoginStyles(theme: AppTheme) {
  const { colors, tokens } = theme;

  return StyleSheet.create({
    kav: { flex: 1 },

    scrollContent: {
      flexGrow: 1,
      padding: spacing.xl,
      paddingBottom: spacing.xxl + 20,
    },

    header: {
      paddingTop: spacing.xxl,
      paddingBottom: spacing.xl,
    },

    // Card com glassmorphism REFINADO
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
      gap: spacing.md,
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

    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: spacing.md,
      gap: spacing.md,
    },

    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: "rgba(255, 255, 255, 0.10)",
    },

    dividerText: {
      color: colors.textMuted,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.medium,
    },

    links: {
      gap: spacing.sm,
      alignItems: "center",
    },

    registerPrompt: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    registerText: {
      color: colors.textMuted,
      fontSize: typography.size.sm,
    },

    hint: {
      marginTop: spacing.xl,
      color: colors.textSubtle,
      fontSize: typography.size.xs,
      textAlign: "center",
    },

    // Partículas decorativas SUTIS
    particle: {
      position: "absolute",
      borderRadius: 100,
      opacity: 0.04,
    },

    particle1: {
      backgroundColor: colors.primary,
      width: 160,
      height: 160,
      top: "5%",
      left: "-15%",
    },

    particle2: {
      backgroundColor: colors.accent,
      width: 120,
      height: 120,
      top: "30%",
      right: "-10%",
    },

    particle3: {
      backgroundColor: colors.primary2,
      width: 90,
      height: 90,
      bottom: "12%",
      left: "8%",
    },
  });
}
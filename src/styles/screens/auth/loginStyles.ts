// src/styles/screens/auth/loginStyles.ts
import { StyleSheet } from "react-native";
import type { AppTheme } from "../../../shared/theme/themes";
import { spacing, typography } from "../../../shared/theme/tokens";

export function makeLoginStyles(theme: AppTheme) {
  const { colors, tokens } = theme;

  return StyleSheet.create({
    kav: { flex: 1 },

    scrollContent: {
      flexGrow: 1,
      padding: spacing.xl,
      paddingBottom: spacing.xxl,
    },

    header: {
      paddingTop: spacing.xxl,
      paddingBottom: spacing.lg,
    },

    formError: {
      color: colors.danger,
      marginBottom: spacing.sm,
      fontSize: typography.size.sm,
    },

    links: {
      marginTop: spacing.md,
      gap: spacing.sm,
    },

    appName: {
      color: colors.text,
      fontSize: typography.size.md,
      fontWeight: typography.weight.medium,
      marginTop: spacing.sm,
    },

    hint: {
      marginTop: spacing.md,
      color: colors.textMuted,
      fontSize: typography.size.xs,
      textAlign: "center",
    },
  });
}

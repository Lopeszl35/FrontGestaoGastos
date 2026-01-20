// src/styles/ui/layout/glowCardStyles.ts
import { StyleSheet } from "react-native";
import type { AppTheme } from "../../../shared/theme/themes";
import { spacing } from "../../../shared/theme/tokens";

export function makeGlowCardStyles(theme: AppTheme) {
  const { colors, tokens } = theme;

  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: tokens.radii.xl,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.xl,
      ...tokens.shadow.card,
    },

    // opcional: um “glow” orgânico bem sutil
    glow: {
      shadowColor: tokens.glow.primary,
      shadowOpacity: 0.25,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 16 },
      elevation: 12,
    },
    inner: {
      gap: spacing.md,
    },
  });
}

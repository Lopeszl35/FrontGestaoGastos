import { StyleSheet } from "react-native";
import { spacing, typography, tokens } from "../../../shared/theme/tokens";
import type { AppTheme } from "../../../shared/theme/themes";

export function makeTextFieldStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
    container: { marginBottom: spacing.md },

    label: {
      color: colors.text,  // BRANCO puro para labels
      fontSize: typography.size.sm,
      marginBottom: spacing.xs,
      fontWeight: typography.weight.medium,
    },

    animatedWrap: {
      position: "relative",
    },

    glowEffect: {
      position: "absolute",
      left: -4,
      right: -4,
      top: -4,
      bottom: -4,
      borderRadius: tokens.radii.md + 4,
      backgroundColor: tokens.glow.primary,
    },

    inputWrap: {
      borderWidth: 1,
      borderRadius: tokens.radii.md,
      paddingHorizontal: spacing.md,
      paddingVertical: 0,
      minHeight: 54,
      flexDirection: "row",
      alignItems: "center",
      overflow: "hidden",
    },

    inputWrapDefault: {
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      borderColor: "rgba(255, 255, 255, 0.12)",
    },

    inputWrapFocused: {
      backgroundColor: "rgba(124, 58, 237, 0.08)",
      borderColor: "rgba(124, 58, 237, 0.80)",
      ...tokens.shadow.inputFocus,
    },

    inputWrapError: {
      backgroundColor: "rgba(239, 68, 68, 0.08)",
      borderColor: "rgba(239, 68, 68, 0.80)",
    },

    leftIcon: {
      marginRight: spacing.sm,
      color: colors.textMuted,
    },

    input: {
      flex: 1,
      height: "100%",
      color: colors.text,  // BRANCO puro
      fontSize: typography.size.md,
      backgroundColor: "transparent",
      paddingVertical: 0,
      paddingHorizontal: 0,
      margin: 0,
      textAlignVertical: "center",
      includeFontPadding: false,
    },

    placeholder: { 
      color: "rgba(255, 255, 255, 0.35)"  // Placeholder visível
    },

    error: {
      color: colors.danger,
      marginTop: spacing.xs,
      fontSize: typography.size.xs,
      fontWeight: typography.weight.medium,
    },
  });
}

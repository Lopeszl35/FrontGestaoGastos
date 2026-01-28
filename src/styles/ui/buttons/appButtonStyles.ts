import { StyleSheet } from "react-native";
import type { AppTheme } from "../../../shared/theme/themes";
import { spacing, typography, tokens } from "../../../shared/theme/tokens";

export function makeAppButtonStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
    pressable: { borderRadius: tokens.radii.md },

    glow: {
      position: "absolute",
      left: 10,
      right: 10,
      top: 8,
      bottom: 8,
      borderRadius: tokens.radii.md,
      backgroundColor: "transparent",
    },
    glowOn: { 
      backgroundColor: tokens.glow.primary, 
      opacity: 0.3,
    },

    base: { borderRadius: tokens.radii.md, overflow: "hidden" },

    wrapPrimary: {},
    wrapOutline: {
      borderWidth: 1,
      borderColor: `${colors.primary}55`,
      backgroundColor: `${colors.primary}10`,
    },
    wrapDanger: {
      borderWidth: 1,
      borderColor: `${colors.danger}55`,
      backgroundColor: `${colors.danger}12`,
    },

    gradient: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: spacing.sm,
    },
    flat: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: spacing.sm,
    },

    text: { 
      color: colors.text, 
      fontSize: typography.size.md, 
      fontWeight: typography.weight.bold 
    },

    disabled: { opacity: 0.5 },
  });
}

import { StyleSheet } from "react-native";
import { colors, spacing, typography, tokens } from "../../../shared/theme";
import { AppTheme } from "../../../shared/theme";

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
      borderColor: "rgba(139, 92, 246, 0.40)",
      backgroundColor: "rgba(139, 92, 246, 0.05)",
    },
    wrapDanger: {
      borderWidth: 1,
      borderColor: "rgba(244, 63, 94, 0.40)",
      backgroundColor: "rgba(244, 63, 94, 0.08)",
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
